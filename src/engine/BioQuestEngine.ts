import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getSpeciesByDifficulty } from '../data/species';
import {
  Difficulty,
  GameMode,
  ProjectedHotspot,
  RadarTelemetry,
  SpeciesData,
} from '../types/game';
import { bioAudio } from './audio';
import { CreatureInstance, createCreatureInstance } from './creatures';
import { buildBukitTimahForest, ForestSceneHandles, groundHeightAt, WATER_LEVEL } from './forest';
import { createProceduralTextures, ProceduralTextureSet } from './textures';

export interface EngineCallbacks {
  onAimedCreatureChange: (speciesId: string | null) => void;
  onSelectCreature: (speciesId: string) => void;
  onHotspotsProjected: (hotspots: ProjectedHotspot[]) => void;
  onRadarUpdate: (telemetry: RadarTelemetry) => void;
  onPointerLockChange: (locked: boolean) => void;
  onContextLostChange: (lost: boolean) => void;
  onRequestMenu: () => void;
}

// Pre-allocated math helpers outside render loop (zero GC churn)
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _worldPos = new THREE.Vector3();
const _proj = new THREE.Vector3();
const _ndc = new THREE.Vector2();
const _centerNdc = new THREE.Vector2(0, 0);

const PLAYER_EYE_HEIGHT = 1.62;
const PLAYER_RADIUS = 0.55;
const WORLD_BOUND_RADIUS = 27.5;

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export class BioQuestEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;
  private isSoftwareGl: boolean;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private textures: ProceduralTextureSet;
  private forest: ForestSceneHandles;
  private inspectFillLight: THREE.PointLight;
  private envRenderTarget: THREE.WebGLRenderTarget;

  private creatures: CreatureInstance[] = [];
  private hitMeshes: THREE.Mesh[] = [];
  private discoveredSet = new Set<string>();

  private mode: GameMode = 'title';
  private difficulty: Difficulty = 'easy';
  private paused = false;

  // Player first-person state
  private playerPos = new THREE.Vector3(0, groundHeightAt(0, 2.5) + PLAYER_EYE_HEIGHT, 2.5);
  private playerYaw = 0; // 0 looks toward -Z (the sunlit clearing)
  private playerPitch = -0.05;
  private stepAccum = 0;
  private headBobPhase = 0;

  // Input state
  private keys = new Set<string>();
  private virtualMoveX = 0;
  private virtualMoveY = 0;
  private pointerLocked = false;

  // Drag-look / touch-look / orbit pointer tracking
  private activePointerId: number | null = null;
  private pointerDownX = 0;
  private pointerDownY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerDragged = false;
  private pinchDist = 0;

  // Inspection orbit state
  private inspectedCreature: CreatureInstance | null = null;
  private inspectTarget = new THREE.Vector3();
  private inspectOrbitYaw = 0.6;
  private inspectOrbitPitch = 0.28;
  private inspectOrbitDist = 2.0;
  private inspectTargetDist = 2.0;
  private activeHotspotId: string | null = null;
  private returnBlend = 0;

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private aimedCreatureId: string | null = null;
  private lastAimCheck = 0;
  private lastRadarCheck = 0;

  // Loop
  private clock = new THREE.Clock();
  private elapsed = 0;
  private frameId = 0;
  private disposed = false;

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.isSoftwareGl = detectSoftwareWebGL();

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
    );
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#d6e6db');
    this.scene.fog = new THREE.FogExp2('#d6e6db', 0.022);

    this.camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 155);
    this.camera.rotation.order = 'YXZ';

    // Mandatory procedural RoomEnvironment reflections for PBR fidelity
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envRenderTarget.texture;
    this.scene.environmentIntensity = 0.65;
    pmrem.dispose();

    // Warm tropical key sunlight + cool canopy/moss hemisphere fill
    const hemiLight = new THREE.HemisphereLight('#d4edf6', '#3c563a', 0.95);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#fff2d4', 2.05);
    sunLight.position.set(18, 29, -16);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 2;
      sunLight.shadow.camera.far = 72;
      const d = 32;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    // Subtle rim backlight from opposite horizon
    const rimLight = new THREE.DirectionalLight('#b4e0d8', 0.55);
    rimLight.position.set(-16, 12, 18);
    this.scene.add(rimLight);

    // Inspection close-up soft studio fill light (active only during inspect mode)
    this.inspectFillLight = new THREE.PointLight('#fff6e4', 0, 7.5, 1.5);
    this.scene.add(this.inspectFillLight);

    // Procedural textures + Bukit Timah forest world
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.textures = createProceduralTextures(maxAniso);
    this.forest = buildBukitTimahForest(this.textures, !this.isSoftwareGl);
    this.scene.add(this.forest.group);

    // Initial easy species set
    this.loadDifficulty('easy', new Set());

    // Pre-warm shaders on hardware GPUs
    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.clock.start();
    this.tick();
  }

  public loadDifficulty(difficulty: Difficulty, discoveredIds: Set<string>): void {
    this.difficulty = difficulty;
    this.discoveredSet = new Set(discoveredIds);

    // Clean up existing creatures
    for (const c of this.creatures) {
      this.scene.remove(c.worldGroup);
      c.dispose();
    }
    this.creatures = [];
    this.hitMeshes = [];
    this.inspectedCreature = null;
    this.aimedCreatureId = null;
    this.callbacks.onAimedCreatureChange(null);

    const list = getSpeciesByDifficulty(difficulty);
    for (const sp of list) {
      const inst = createCreatureInstance(sp, this.textures, !this.isSoftwareGl);
      inst.setDiscoveredVisual(this.discoveredSet.has(sp.id));
      this.scene.add(inst.worldGroup);
      this.creatures.push(inst);
      this.hitMeshes.push(inst.hitMesh);
    }

    // Reset player smoothly into central clearing facing the first landmark
    this.resetPlayerPosition();
    this.emitRadarTelemetry();
  }

  public resetPlayerPosition(): void {
    this.playerPos.set(0, groundHeightAt(0, 3.2) + PLAYER_EYE_HEIGHT, 3.2);
    this.playerYaw = 0;
    this.playerPitch = -0.04;
  }

  public setMode(nextMode: GameMode): void {
    this.mode = nextMode;
    if (nextMode !== 'explore' && document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock();
    }
    if (nextMode === 'explore') {
      this.inspectedCreature = null;
      this.activeHotspotId = null;
      this.returnBlend = 1;
      this.callbacks.onHotspotsProjected([]);
    }
    if (nextMode === 'title') {
      this.inspectedCreature = null;
      this.callbacks.onHotspotsProjected([]);
      this.callbacks.onAimedCreatureChange(null);
    }
  }

  public setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.keys.clear();
      this.virtualMoveX = 0;
      this.virtualMoveY = 0;
      if (document.pointerLockElement === this.renderer.domElement) {
        document.exitPointerLock();
      }
    }
  }

  public setDiscoveredSpecies(discoveredIds: Set<string>): void {
    this.discoveredSet = new Set(discoveredIds);
    for (const c of this.creatures) {
      c.setDiscoveredVisual(this.discoveredSet.has(c.species.id));
    }
    this.emitRadarTelemetry();
  }

  public setVirtualMoveInput(x: number, y: number): void {
    this.virtualMoveX = THREE.MathUtils.clamp(x, -1, 1);
    this.virtualMoveY = THREE.MathUtils.clamp(y, -1, 1);
  }

  public enterInspection(speciesId: string, initialHotspotId?: string): boolean {
    const inst = this.creatures.find((c) => c.species.id === speciesId);
    if (!inst) return false;

    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock();
    }

    this.inspectedCreature = inst;
    this.mode = 'inspect';
    this.activeHotspotId = initialHotspotId ?? inst.species.hotspots[0]?.id ?? null;

    // Place orbit target at creature body center
    inst.creatureGroup.getWorldPosition(this.inspectTarget);
    this.inspectTarget.y += inst.species.inspectTargetY * inst.species.worldScale;

    // Position orbit angle nicely facing the creature's front-three-quarter side
    this.inspectOrbitYaw = inst.species.initialYaw + 0.58;
    this.inspectOrbitPitch = 0.28;
    this.inspectOrbitDist = inst.species.inspectDistance;
    this.inspectTargetDist = inst.species.inspectDistance;

    // Teleport player nearby (safe distance) so returning to forest feels seamless
    const backAngle = inst.species.initialYaw + 0.55;
    const retX = inst.worldGroup.position.x + Math.sin(backAngle) * 3.1;
    const retZ = inst.worldGroup.position.z + Math.cos(backAngle) * 3.1;
    const clampedDist = Math.hypot(retX, retZ);
    const safeScale = clampedDist > WORLD_BOUND_RADIUS - 1 ? (WORLD_BOUND_RADIUS - 1) / clampedDist : 1;
    const px = retX * safeScale;
    const pz = retZ * safeScale;
    const py = Math.max(groundHeightAt(px, pz), WATER_LEVEL + 0.25) + PLAYER_EYE_HEIGHT;
    this.playerPos.set(px, py, pz);
    this.playerYaw = Math.atan2(
      px - inst.worldGroup.position.x,
      pz - inst.worldGroup.position.z,
    );
    this.playerPitch = -0.14;

    this.callbacks.onAimedCreatureChange(null);
    return true;
  }

  public focusHotspot(hotspotId: string): void {
    this.activeHotspotId = hotspotId;
    if (!this.inspectedCreature) return;
    const hs = this.inspectedCreature.species.hotspots.find((h) => h.id === hotspotId);
    if (!hs) return;
    // Gently swing orbit azimuth so the chosen anatomical part faces camera nicely
    const [ax, , az] = hs.anchor;
    if (Math.hypot(ax, az) > 0.12) {
      const localAngle = Math.atan2(ax, az);
      this.inspectOrbitYaw = this.inspectedCreature.species.initialYaw + localAngle + 0.35;
    }
  }

  public exitInspection(): void {
    this.setMode('explore');
  }

  // -------------------------------------------------------------------------
  // Event Binding (Desktop Mouse/Keyboard + Mobile Touch)
  // -------------------------------------------------------------------------
  private bindEvents(): void {
    const dom = this.renderer.domElement;

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onWindowBlur);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);

    dom.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    dom.addEventListener('wheel', this.onWheel, { passive: false });
    dom.addEventListener('touchstart', this.onTouchStart, { passive: true });
    dom.addEventListener('touchmove', this.onTouchMove, { passive: false });
    dom.addEventListener('webglcontextlost', this.onContextLost);
    dom.addEventListener('webglcontextrestored', this.onContextRestored);
  }

  private unbindEvents(): void {
    const dom = this.renderer.domElement;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onWindowBlur);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);

    dom.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    dom.removeEventListener('wheel', this.onWheel);
    dom.removeEventListener('touchstart', this.onTouchStart);
    dom.removeEventListener('touchmove', this.onTouchMove);
    dom.removeEventListener('webglcontextlost', this.onContextLost);
    dom.removeEventListener('webglcontextrestored', this.onContextRestored);
  }

  private onContextLost = (e: Event): void => {
    e.preventDefault();
    this.callbacks.onContextLostChange(true);
  };

  private onContextRestored = (): void => {
    this.callbacks.onContextLostChange(false);
  };

  private onResize = (): void => {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
    );
  };

  private onWindowBlur = (): void => {
    this.keys.clear();
    this.activePointerId = null;
    this.virtualMoveX = 0;
    this.virtualMoveY = 0;
  };

  private onPointerLockChange = (): void => {
    this.pointerLocked = document.pointerLockElement === this.renderer.domElement;
    this.callbacks.onPointerLockChange(this.pointerLocked);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.mode === 'title') return;
    if (e.code === 'Escape') {
      if (this.mode === 'inspect') {
        this.exitInspection();
      } else if (!this.pointerLocked) {
        this.callbacks.onRequestMenu();
      }
      return;
    }

    if (this.paused) return;

    this.keys.add(e.code);

    // Quick inspect aimed creature with E or Space
    if (
      this.mode === 'explore' &&
      (e.code === 'KeyE' || e.code === 'Space') &&
      this.aimedCreatureId
    ) {
      e.preventDefault();
      this.callbacks.onSelectCreature(this.aimedCreatureId);
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private raycastCreatureAtScreen(clientX: number, clientY: number): string | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    _ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    _ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(_ndc, this.camera);
    this.raycaster.far = 26;
    const hits = this.raycaster.intersectObjects(this.hitMeshes, false);
    if (hits.length > 0) {
      return (hits[0].object.userData.creatureId as string) || null;
    }
    return null;
  }

  private raycastCreatureAtCenter(): string | null {
    this.raycaster.setFromCamera(_centerNdc, this.camera);
    this.raycaster.far = 18;
    const hits = this.raycaster.intersectObjects(this.hitMeshes, false);
    if (hits.length > 0) {
      return (hits[0].object.userData.creatureId as string) || null;
    }
    return null;
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (this.paused || this.mode === 'title') return;

    // When pointer is already locked in FPS mode, left-click immediately inspects aimed creature
    if (this.mode === 'explore' && this.pointerLocked) {
      const targetId = this.aimedCreatureId || this.raycastCreatureAtCenter();
      if (targetId) {
        this.callbacks.onSelectCreature(targetId);
      }
      return;
    }

    this.activePointerId = e.pointerId;
    this.pointerDownX = e.clientX;
    this.pointerDownY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.pointerDragged = false;
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.paused || this.mode === 'title') return;

    if (this.mode === 'explore' && this.pointerLocked) {
      this.playerYaw -= e.movementX * 0.0024;
      this.playerPitch = THREE.MathUtils.clamp(
        this.playerPitch - e.movementY * 0.0022,
        -1.08,
        1.05,
      );
      return;
    }

    if (this.activePointerId !== e.pointerId) return;

    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    if (Math.hypot(e.clientX - this.pointerDownX, e.clientY - this.pointerDownY) > 6) {
      this.pointerDragged = true;
    }

    if (this.mode === 'explore') {
      // Smooth drag-to-look (works identically for mouse-drag fallback AND mobile touch-swipe)
      const sensitivity = e.pointerType === 'touch' ? 0.0052 : 0.0038;
      this.playerYaw += dx * sensitivity;
      this.playerPitch = THREE.MathUtils.clamp(
        this.playerPitch + dy * sensitivity,
        -1.08,
        1.05,
      );
    } else if (this.mode === 'inspect') {
      const orbitSens = e.pointerType === 'touch' ? 0.0075 : 0.0062;
      this.inspectOrbitYaw -= dx * orbitSens;
      this.inspectOrbitPitch = THREE.MathUtils.clamp(
        this.inspectOrbitPitch + dy * orbitSens,
        -0.12,
        1.12,
      );
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.activePointerId !== e.pointerId) return;
    this.activePointerId = null;

    if (this.paused || this.mode !== 'explore') return;

    // Clean click / tap without dragging!
    if (!this.pointerDragged) {
      const hitId = this.raycastCreatureAtScreen(e.clientX, e.clientY);
      if (hitId) {
        this.callbacks.onSelectCreature(hitId);
        return;
      }

      // On desktop mouse, clicking open forest floor optionally engages PointerLock for classic FPS look
      if (e.pointerType === 'mouse' && this.renderer.domElement.requestPointerLock) {
        try {
          const maybePromise = this.renderer.domElement.requestPointerLock() as unknown as Promise<void> | undefined;
          if (maybePromise && typeof maybePromise.catch === 'function') {
            maybePromise.catch(() => {});
          }
        } catch {
          // PointerLock unavailable in some embedded frames — drag-to-look fallback remains active!
        }
      }
    }
  };

  private onWheel = (e: WheelEvent): void => {
    if (this.mode !== 'inspect' || this.paused) return;
    e.preventDefault();
    this.inspectTargetDist = THREE.MathUtils.clamp(
      this.inspectTargetDist + e.deltaY * 0.0018,
      1.15,
      3.8,
    );
  };

  private onTouchStart = (e: TouchEvent): void => {
    if (this.mode === 'inspect' && e.touches.length === 2) {
      this.pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (this.mode === 'inspect' && e.touches.length === 2 && this.pinchDist > 0) {
      e.preventDefault();
      const nextDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const delta = this.pinchDist - nextDist;
      this.pinchDist = nextDist;
      this.inspectTargetDist = THREE.MathUtils.clamp(
        this.inspectTargetDist + delta * 0.008,
        1.15,
        3.8,
      );
    }
  };

  // -------------------------------------------------------------------------
  // Main Simulation & Render Loop
  // -------------------------------------------------------------------------
  private tick = (): void => {
    if (this.disposed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);
    this.elapsed += dt;

    if (!this.paused) {
      this.forest.update(this.elapsed, dt);
      for (const c of this.creatures) {
        c.update(this.elapsed, dt);
      }

      if (this.mode === 'title') {
        this.updateTitleCamera();
      } else if (this.mode === 'explore') {
        this.updateExploreMovement(dt);
      } else if (this.mode === 'inspect') {
        this.updateInspectCamera(dt);
      }
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (!gl || typeof gl.fenceSync !== 'function') {
      this.frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private updateTitleCamera(): void {
    const angle = this.elapsed * 0.11;
    const radius = 12.5;
    const cx = Math.sin(angle) * radius;
    const cz = Math.cos(angle) * radius;
    const cy = Math.max(groundHeightAt(cx, cz), 0) + 3.6 + Math.sin(this.elapsed * 0.35) * 0.45;
    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(1.8, 1.35, -1.8);
    this.inspectFillLight.intensity = 0;
  }

  private updateExploreMovement(dt: number): void {
    this.inspectFillLight.intensity = THREE.MathUtils.damp(this.inspectFillLight.intensity, 0, 8, dt);

    // Combine keyboard + mobile virtual joystick
    let moveF = 0;
    let moveR = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) moveF += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) moveF -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) moveR += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) moveR -= 1;

    moveF += this.virtualMoveY;
    moveR += this.virtualMoveX;

    const inputMag = Math.hypot(moveF, moveR);
    if (inputMag > 0.05) {
      const clampedMag = Math.min(1, inputMag);
      moveF = (moveF / inputMag) * clampedMag;
      moveR = (moveR / inputMag) * clampedMag;

      const walkSpeed = 5.4;
      _forward.set(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
      _right.set(Math.cos(this.playerYaw), 0, -Math.sin(this.playerYaw));

      const nextX = this.playerPos.x + (_forward.x * moveF + _right.x * moveR) * walkSpeed * dt;
      const nextZ = this.playerPos.z + (_forward.z * moveF + _right.z * moveR) * walkSpeed * dt;

      // Resolve collisions with Dipterocarp tree trunks and world perimeter
      let rx = nextX;
      let rz = nextZ;

      for (const col of this.forest.colliders) {
        const dx = rx - col.x;
        const dz = rz - col.z;
        const minDist = col.radius + PLAYER_RADIUS;
        const distSq = dx * dx + dz * dz;
        if (distSq < minDist * minDist && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          rx = col.x + (dx / dist) * minDist;
          rz = col.z + (dz / dist) * minDist;
        }
      }

      // Gently keep player from wading into deep pond center
      const groundY = groundHeightAt(rx, rz);
      if (groundY < WATER_LEVEL - 0.14) {
        rx = this.playerPos.x;
        rz = this.playerPos.z;
      }

      const distFromOrigin = Math.hypot(rx, rz);
      if (distFromOrigin > WORLD_BOUND_RADIUS) {
        const s = WORLD_BOUND_RADIUS / distFromOrigin;
        rx *= s;
        rz *= s;
      }

      const moved = Math.hypot(rx - this.playerPos.x, rz - this.playerPos.z);
      this.playerPos.x = rx;
      this.playerPos.z = rz;

      // Subtle organic walking bob + footsteps
      this.headBobPhase += moved * 2.55;
      this.stepAccum += moved;
      if (this.stepAccum > 1.75) {
        this.stepAccum = 0;
        bioAudio.playFootstep();
      }
    }

    const floorY = Math.max(groundHeightAt(this.playerPos.x, this.playerPos.z), WATER_LEVEL + 0.12);
    const targetEyeY = floorY + PLAYER_EYE_HEIGHT + Math.sin(this.headBobPhase) * 0.032;
    this.playerPos.y = THREE.MathUtils.damp(this.playerPos.y, targetEyeY, 12, dt);

    if (this.returnBlend > 0.01) {
      this.camera.position.lerp(this.playerPos, 1 - Math.exp(-9 * dt));
      this.returnBlend = THREE.MathUtils.damp(this.returnBlend, 0, 7, dt);
    } else {
      this.camera.position.copy(this.playerPos);
    }

    this.camera.rotation.set(this.playerPitch, this.playerYaw, 0, 'YXZ');

    // Throttled reticle raycast (~15 Hz)
    if (this.elapsed - this.lastAimCheck > 0.065) {
      this.lastAimCheck = this.elapsed;
      const hit = this.raycastCreatureAtCenter();
      if (hit !== this.aimedCreatureId) {
        this.aimedCreatureId = hit;
        for (const c of this.creatures) {
          c.setHighlighted(c.species.id === hit);
        }
        this.callbacks.onAimedCreatureChange(hit);
      }
    }

    // Throttled Forest Radar update (~10 Hz)
    if (this.elapsed - this.lastRadarCheck > 0.1) {
      this.lastRadarCheck = this.elapsed;
      this.emitRadarTelemetry();
    }
  }

  private updateInspectCamera(dt: number): void {
    const inst = this.inspectedCreature;
    if (!inst) return;

    this.inspectOrbitDist = THREE.MathUtils.damp(this.inspectOrbitDist, this.inspectTargetDist, 9, dt);

    // Update target center smoothly
    inst.creatureGroup.getWorldPosition(_v1);
    _v1.y += inst.species.inspectTargetY * inst.species.worldScale;
    this.inspectTarget.lerp(_v1, 1 - Math.exp(-10 * dt));

    // Compute desired orbital camera point
    const horizDist = Math.cos(this.inspectOrbitPitch) * this.inspectOrbitDist;
    const camX = this.inspectTarget.x + Math.sin(this.inspectOrbitYaw) * horizDist;
    const camZ = this.inspectTarget.z + Math.cos(this.inspectOrbitYaw) * horizDist;
    const minGroundY = Math.max(groundHeightAt(camX, camZ), WATER_LEVEL) + 0.35;
    const camY = Math.max(
      minGroundY,
      this.inspectTarget.y + Math.sin(this.inspectOrbitPitch) * this.inspectOrbitDist,
    );

    _v2.set(camX, camY, camZ);
    this.camera.position.lerp(_v2, 1 - Math.exp(-9 * dt));
    this.camera.lookAt(this.inspectTarget);

    // Softly illuminate the inspected specimen from camera side
    this.inspectFillLight.position.copy(this.camera.position);
    this.inspectFillLight.intensity = THREE.MathUtils.damp(this.inspectFillLight.intensity, 1.35, 8, dt);

    // Project all 4 anatomical hotspot 3D anchors into 2D screen space via Vector3.project()
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const projected: ProjectedHotspot[] = [];

    inst.creatureGroup.updateWorldMatrix(true, false);
    for (const hs of inst.species.hotspots) {
      _worldPos.set(hs.anchor[0], hs.anchor[1], hs.anchor[2]);
      inst.creatureGroup.localToWorld(_worldPos);
      _proj.copy(_worldPos).project(this.camera);

      const inFront = _proj.z >= -1 && _proj.z <= 1;
      const sx = ((_proj.x + 1) * 0.5) * w;
      const sy = ((-_proj.y + 1) * 0.5) * h;

      projected.push({
        id: hs.id,
        x: sx,
        y: sy,
        visible: inFront && sx > 24 && sx < w - 24 && sy > 48 && sy < h - 48,
      });
    }
    this.callbacks.onHotspotsProjected(projected);
  }

  private emitRadarTelemetry(): void {
    let nearest: SpeciesData | null = null;
    let nearestDist = Infinity;
    let nearestPos: THREE.Vector3 | null = null;
    let remaining = 0;

    for (const c of this.creatures) {
      if (this.discoveredSet.has(c.species.id)) continue;
      remaining++;
      const d = Math.hypot(
        c.worldGroup.position.x - this.playerPos.x,
        c.worldGroup.position.z - this.playerPos.z,
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearest = c.species;
        nearestPos = c.worldGroup.position;
      }
    }

    if (!nearest || !nearestPos) {
      this.callbacks.onRadarUpdate({
        nearestName: null,
        nearestId: null,
        distanceMeters: null,
        relativeAngleRad: 0,
        remainingCount: 0,
      });
      return;
    }

    // Angle from player's forward vector (-sin(yaw), -cos(yaw)) to target
    const dx = nearestPos.x - this.playerPos.x;
    const dz = nearestPos.z - this.playerPos.z;
    const fwdX = -Math.sin(this.playerYaw);
    const fwdZ = -Math.cos(this.playerYaw);
    const rightX = Math.cos(this.playerYaw);
    const rightZ = -Math.sin(this.playerYaw);

    const dotFwd = dx * fwdX + dz * fwdZ;
    const dotRight = dx * rightX + dz * rightZ;
    const relAngle = Math.atan2(dotRight, dotFwd);

    this.callbacks.onRadarUpdate({
      nearestName: nearest.name,
      nearestId: nearest.id,
      distanceMeters: Math.round(nearestDist * 10) / 10,
      relativeAngleRad: relAngle,
      remainingCount: remaining,
    });
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.unbindEvents();

    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock();
    }

    for (const c of this.creatures) {
      this.scene.remove(c.worldGroup);
      c.dispose();
    }
    this.forest.dispose();
    this.textures.dispose();
    this.envRenderTarget.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
