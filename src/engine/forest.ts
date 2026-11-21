import * as THREE from 'three';
import { ProceduralTextureSet } from './textures';

export interface TreeCollider {
  x: number;
  z: number;
  radius: number;
}

export interface ForestSceneHandles {
  group: THREE.Group;
  colliders: TreeCollider[];
  update: (elapsed: number, delta: number) => void;
  dispose: () => void;
}

export const WATER_LEVEL = -0.22;

/**
 * Deterministic rolling Bukit Timah rainforest terrain heightfield.
 * - Gentle clearing near origin (0, 0)
 * - Natural forest stream & pond basin around (11.5, 2.2)
 * - Gradually rising wooded slopes past radius 28m
 */
export function groundHeightAt(x: number, z: number): number {
  const distFromCenter = Math.hypot(x, z);

  // Soft undulating forest floor
  let h =
    Math.sin(x * 0.085) * Math.cos(z * 0.075) * 0.42 +
    Math.sin(x * 0.19 + z * 0.14) * 0.14 +
    Math.cos(x * 0.045 - z * 0.06) * 0.25;

  // Flatten the central spawn clearing slightly for smooth first-person walking
  const clearingFactor = THREE.MathUtils.smoothstep(distFromCenter, 2.5, 11.0);
  h *= 0.28 + 0.72 * clearingFactor;

  // Carve natural pond & stream basin near (11.5, 2.2) extending toward (13.5, 10)
  const dxPond = (x - 11.4) / 6.2;
  const dzPond = (z - 1.8) / 7.6;
  const pondDistSq = dxPond * dxPond + dzPond * dzPond;
  if (pondDistSq < 1.8) {
    const basin = Math.exp(-pondDistSq * 2.15);
    h -= basin * 1.18;
  }

  // Stream channel curving toward (13.5, 11.5)
  const streamDist = Math.abs(x - (12.8 + Math.sin(z * 0.18) * 1.6));
  if (z > 3 && z < 24 && streamDist < 4.5) {
    const channel = Math.exp(-(streamDist * streamDist) / 4.2) * THREE.MathUtils.smoothstep(z, 3, 7);
    h -= channel * 0.75;
  }

  // Gentle rise toward outer rainforest ridge so horizon feels enclosed naturally
  if (distFromCenter > 26) {
    const rim = (distFromCenter - 26) / 28;
    h += rim * rim * 6.5;
  }

  return h;
}

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildBukitTimahForest(
  textures: ProceduralTextureSet,
  castShadows: boolean,
): ForestSceneHandles {
  const group = new THREE.Group();
  const colliders: TreeCollider[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // -------------------------------------------------------------------------
  // 1. Gradient Tropical Sky Dome
  // -------------------------------------------------------------------------
  const skyGeo = trackGeo(new THREE.SphereGeometry(125, 24, 16));
  const skyMat = trackMat(
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTopColor: { value: new THREE.Color('#5a9eb2') },
        uMidColor: { value: new THREE.Color('#a7d1c8') },
        uHorizonColor: { value: new THREE.Color('#dce8df') },
        uSunDir: { value: new THREE.Vector3(0.45, 0.72, -0.52).normalize() },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uMidColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uSunDir;
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = clamp(dir.y, 0.0, 1.0);
          vec3 col = mix(uHorizonColor, uMidColor, smoothstep(0.0, 0.28, h));
          col = mix(col, uTopColor, smoothstep(0.24, 0.85, h));
          float sunDot = max(dot(dir, uSunDir), 0.0);
          col += vec3(1.0, 0.94, 0.76) * pow(sunDot, 16.0) * 0.36;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
  );
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyDome);

  // -------------------------------------------------------------------------
  // 2. Sculpted Rainforest Terrain (130m × 130m extending well beyond bounds)
  // -------------------------------------------------------------------------
  const terrainGeo = trackGeo(new THREE.PlaneGeometry(130, 130, 88, 88));
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const cMoss = new THREE.Color('#546e3b');
  const cMud = new THREE.Color('#4a3a27');
  const cPath = new THREE.Color('#6f5c41');
  const cTmp = new THREE.Color();

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = groundHeightAt(x, z);
    posAttr.setY(i, y);

    // Subtle trail tint along curving central footpath
    const trailCenter = Math.sin(z * 0.14) * 2.2;
    const onTrail = Math.exp(-Math.pow((x - trailCenter) * 0.45, 2)) * (Math.abs(z) < 18 ? 1 : 0);

    if (y < WATER_LEVEL + 0.18) {
      cTmp.copy(cMud);
    } else {
      cTmp.copy(cMoss).lerp(cPath, onTrail * 0.58);
    }
    colors[i * 3] = cTmp.r;
    colors[i * 3 + 1] = cTmp.g;
    colors[i * 3 + 2] = cTmp.b;
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.floorMap,
      bumpMap: textures.floorBump,
      bumpScale: 0.12,
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.0,
    }),
  );
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  group.add(terrainMesh);

  // -------------------------------------------------------------------------
  // 3. Rippling Forest Pond & Stream Surface
  // -------------------------------------------------------------------------
  const waterGeo = trackGeo(new THREE.PlaneGeometry(24, 34, 1, 1));
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#2a5f58',
      roughness: 0.14,
      metalness: 0.22,
      bumpMap: textures.waterBump,
      bumpScale: 0.045,
      transparent: true,
      opacity: 0.84,
    }),
  );
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.set(12.2, WATER_LEVEL, 6.2);
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // -------------------------------------------------------------------------
  // 4. Composite Multi-Part Dipterocarp Rainforest Trees (Trunks + Buttresses + Branches)
  //    Plus Instanced Canopy Foliage Crowns
  // -------------------------------------------------------------------------
  const barkMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.barkMap,
      bumpMap: textures.barkBump,
      bumpScale: 0.16,
      roughness: 0.9,
      metalness: 0.0,
    }),
  );
  const canopyMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.leafMap,
      bumpMap: textures.leafBump,
      bumpScale: 0.06,
      roughness: 0.68,
      metalness: 0.02,
      color: '#5a8f49',
    }),
  );

  const rng = seededRng(2026);
  const treePositions: { x: number; z: number; scale: number; height: number }[] = [
    // Hero inner-ring trees (carefully clear of creature spawn coords & pond)
    { x: -11.5, z: 5.5, scale: 1.15, height: 11.5 },
    { x: -12.8, z: -4.2, scale: 1.0, height: 10.5 },
    { x: -6.0, z: -14.2, scale: 1.1, height: 12.0 },
    { x: 7.4, z: -13.6, scale: 1.05, height: 11.2 },
    { x: 15.8, z: -11.6, scale: 1.25, height: 13.0 }, // Draco trunk!
    { x: -16.5, z: -12.0, scale: 1.2, height: 12.4 },
    { x: -15.2, z: 10.8, scale: 1.15, height: 11.8 },
    { x: 3.4, z: 12.0, scale: 1.2, height: 12.2 }, // Pangolin buttress root neighbor
    { x: -7.5, z: 15.5, scale: 1.05, height: 11.0 },
    { x: 18.5, z: 1.2, scale: 1.1, height: 11.6 },
    { x: 18.2, z: 10.5, scale: 1.15, height: 12.0 },
    { x: 0.5, z: -17.5, scale: 1.2, height: 12.8 },
  ];

  // Add outer perimeter grove ring (radius 22m to 44m) so the forest feels endless
  for (let i = 0; i < 42; i++) {
    const angle = (i / 42) * Math.PI * 2 + (rng() - 0.5) * 0.14;
    const radius = 21.5 + rng() * 22.0;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (groundHeightAt(x, z) < WATER_LEVEL + 0.2) continue;
    treePositions.push({
      x,
      z,
      scale: 0.85 + rng() * 0.65,
      height: 9.5 + rng() * 6.5,
    });
  }

  const trunkBaseGeo = trackGeo(new THREE.CylinderGeometry(0.28, 0.56, 1, 9, 1));
  trunkBaseGeo.translate(0, 0.5, 0);
  const buttressGeo = trackGeo(new THREE.ConeGeometry(0.48, 1.9, 5));
  buttressGeo.translate(0, 0.9, 0);
  const branchGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.18, 1, 6));
  branchGeo.translate(0, 0.5, 0);

  const canopyCenters: { pos: THREE.Vector3; scale: number; tint: THREE.Color }[] = [];
  const leafPalette = ['#396e35', '#477e3d', '#548e44', '#2e5d2d', '#62984b'];

  for (const tp of treePositions) {
    const gy = groundHeightAt(tp.x, tp.z);
    const treeGroup = new THREE.Group();
    treeGroup.position.set(tp.x, gy - 0.15, tp.z);

    // Main trunk
    const trunk = new THREE.Mesh(trunkBaseGeo, barkMat);
    trunk.scale.set(tp.scale, tp.height, tp.scale);
    trunk.rotation.z = (rng() - 0.5) * 0.06;
    trunk.castShadow = castShadows && Math.hypot(tp.x, tp.z) < 26;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    // 3 flared tropical buttress roots
    for (let b = 0; b < 3; b++) {
      const ang = b * ((Math.PI * 2) / 3) + rng() * 0.6;
      const butt = new THREE.Mesh(buttressGeo, barkMat);
      butt.position.set(Math.cos(ang) * 0.34 * tp.scale, 0, Math.sin(ang) * 0.34 * tp.scale);
      butt.rotation.y = -ang;
      butt.rotation.z = 0.28;
      butt.scale.set(tp.scale * 0.65, tp.scale * 1.15, tp.scale * 1.1);
      treeGroup.add(butt);
    }

    // 3 structural boughs
    for (let br = 0; br < 3; br++) {
      const ang = br * 2.1 + rng() * 0.8;
      const bLen = (2.4 + rng() * 1.8) * tp.scale;
      const bY = tp.height * (0.64 + br * 0.1);
      const branch = new THREE.Mesh(branchGeo, barkMat);
      branch.position.set(0, bY, 0);
      branch.rotation.y = ang;
      branch.rotation.z = 0.55 + rng() * 0.35;
      branch.scale.set(tp.scale, bLen, tp.scale);
      treeGroup.add(branch);

      // Record canopy cluster at branch tip
      const tipX = tp.x + Math.sin(branch.rotation.z) * Math.cos(-ang) * bLen * 0.85;
      const tipZ = tp.z + Math.sin(branch.rotation.z) * Math.sin(-ang) * bLen * 0.85;
      canopyCenters.push({
        pos: new THREE.Vector3(tipX, gy + bY + bLen * 0.52, tipZ),
        scale: (2.2 + rng() * 1.4) * tp.scale,
        tint: new THREE.Color(leafPalette[Math.floor(rng() * leafPalette.length)]),
      });
    }

    // Crown top cluster
    canopyCenters.push({
      pos: new THREE.Vector3(tp.x, gy + tp.height + 0.5, tp.z),
      scale: (2.8 + rng() * 1.4) * tp.scale,
      tint: new THREE.Color(leafPalette[Math.floor(rng() * leafPalette.length)]),
    });

    group.add(treeGroup);
    colliders.push({ x: tp.x, z: tp.z, radius: 0.65 * tp.scale });
  }

  // Instanced foliage crowns (low-poly smoothed icosahedron clusters)
  const crownGeo = trackGeo(new THREE.IcosahedronGeometry(1, 1));
  const crownInst = new THREE.InstancedMesh(crownGeo, canopyMat, canopyCenters.length);
  crownInst.castShadow = castShadows;
  crownInst.receiveShadow = true;
  const dummy = new THREE.Object3D();
  canopyCenters.forEach((c, i) => {
    dummy.position.copy(c.pos);
    dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    dummy.scale.set(c.scale * 1.18, c.scale * 0.72, c.scale * 1.08);
    dummy.updateMatrix();
    crownInst.setMatrixAt(i, dummy.matrix);
    crownInst.setColorAt(i, c.tint);
  });
  crownInst.instanceMatrix.needsUpdate = true;
  if (crownInst.instanceColor) crownInst.instanceColor.needsUpdate = true;
  crownInst.computeBoundingSphere();
  group.add(crownInst);

  // -------------------------------------------------------------------------
  // 5. Instanced Rainforest Ferns (Rosettes of Arched Fronds)
  // -------------------------------------------------------------------------
  const fernShape = new THREE.Shape();
  fernShape.moveTo(0, 0);
  fernShape.quadraticCurveTo(0.16, 0.28, 0.14, 0.62);
  fernShape.quadraticCurveTo(0.08, 0.88, 0, 1.05);
  fernShape.quadraticCurveTo(-0.08, 0.88, -0.14, 0.62);
  fernShape.quadraticCurveTo(-0.16, 0.28, 0, 0);

  const fernGeo = trackGeo(new THREE.ShapeGeometry(fernShape, 5));
  // Arch the frond outward gracefully
  const fPos = fernGeo.attributes.position;
  for (let i = 0; i < fPos.count; i++) {
    const y = fPos.getY(i);
    fPos.setZ(i, y * y * 0.42);
    fPos.setY(i, y * 0.72);
  }
  fernGeo.computeVertexNormals();

  const fernMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.leafMap,
      roughness: 0.62,
      metalness: 0.0,
      side: THREE.DoubleSide,
      color: '#4e8a41',
    }),
  );

  const fernClusters = 42;
  const frondsPerCluster = 5;
  const fernInst = new THREE.InstancedMesh(fernGeo, fernMat, fernClusters * frondsPerCluster);
  fernInst.receiveShadow = true;
  let fIdx = 0;
  for (let c = 0; c < fernClusters; c++) {
    const ang = rng() * Math.PI * 2;
    const rad = 3.2 + rng() * 24.0;
    const cx = Math.cos(ang) * rad;
    const cz = Math.sin(ang) * rad;
    const cy = groundHeightAt(cx, cz);
    if (cy < WATER_LEVEL + 0.12) {
      // Push out of water
      for (let k = 0; k < frondsPerCluster; k++) {
        dummy.position.set(0, -20, 0);
        dummy.scale.setScalar(0.001);
        dummy.updateMatrix();
        fernInst.setMatrixAt(fIdx++, dummy.matrix);
      }
      continue;
    }
    const baseScale = 0.68 + rng() * 0.58;
    const tint = new THREE.Color().setHSL(0.28 + (rng() - 0.5) * 0.05, 0.48, 0.34 + rng() * 0.12);
    for (let k = 0; k < frondsPerCluster; k++) {
      const fAng = (k / frondsPerCluster) * Math.PI * 2 + rng() * 0.4;
      dummy.position.set(cx, cy - 0.02, cz);
      dummy.rotation.set(0.35 + rng() * 0.25, fAng, 0);
      dummy.scale.setScalar(baseScale * (0.85 + rng() * 0.3));
      dummy.updateMatrix();
      fernInst.setMatrixAt(fIdx, dummy.matrix);
      fernInst.setColorAt(fIdx, tint);
      fIdx++;
    }
  }
  fernInst.instanceMatrix.needsUpdate = true;
  if (fernInst.instanceColor) fernInst.instanceColor.needsUpdate = true;
  fernInst.computeBoundingSphere();
  group.add(fernInst);

  // -------------------------------------------------------------------------
  // 6. Instanced Grass Tufts (320 low-draw-call tufts)
  // -------------------------------------------------------------------------
  const grassGeo = trackGeo(new THREE.ConeGeometry(0.11, 0.42, 4, 1, true));
  grassGeo.translate(0, 0.2, 0);
  const grassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#5c8c42',
      roughness: 0.78,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),
  );
  const grassCount = 320;
  const grassInst = new THREE.InstancedMesh(grassGeo, grassMat, grassCount);
  for (let i = 0; i < grassCount; i++) {
    const a = rng() * Math.PI * 2;
    const r = 1.8 + rng() * 27.0;
    const gx = Math.cos(a) * r;
    const gz = Math.sin(a) * r;
    const gy = groundHeightAt(gx, gz);
    if (gy < WATER_LEVEL + 0.05) {
      dummy.position.set(0, -20, 0);
      dummy.scale.setScalar(0.001);
    } else {
      dummy.position.set(gx, gy - 0.02, gz);
      dummy.rotation.set((rng() - 0.5) * 0.25, rng() * Math.PI, (rng() - 0.5) * 0.25);
      dummy.scale.set(0.8 + rng() * 0.7, 0.75 + rng() * 0.85, 0.8 + rng() * 0.7);
    }
    dummy.updateMatrix();
    grassInst.setMatrixAt(i, dummy.matrix);
    grassInst.setColorAt(
      i,
      new THREE.Color().setHSL(0.26 + (rng() - 0.5) * 0.06, 0.45, 0.34 + rng() * 0.14),
    );
  }
  grassInst.instanceMatrix.needsUpdate = true;
  if (grassInst.instanceColor) grassInst.instanceColor.needsUpdate = true;
  grassInst.computeBoundingSphere();
  group.add(grassInst);

  // -------------------------------------------------------------------------
  // 7. Instanced River Pebbles & Mossy Stones (120 instances)
  // -------------------------------------------------------------------------
  const pebbleGeo = trackGeo(new THREE.DodecahedronGeometry(0.18, 1));
  const pebbleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#6b7068',
      roughness: 0.82,
      metalness: 0.04,
      bumpMap: textures.floorBump,
      bumpScale: 0.04,
    }),
  );
  const pebbleCount = 120;
  const pebbleInst = new THREE.InstancedMesh(pebbleGeo, pebbleMat, pebbleCount);
  pebbleInst.receiveShadow = true;
  for (let i = 0; i < pebbleCount; i++) {
    // Cluster 60% around the pond/stream bank and 40% scattered on trail
    let px: number;
    let pz: number;
    if (i < 72) {
      const ang = rng() * Math.PI * 2;
      const rad = 3.2 + rng() * 4.8;
      px = 11.4 + Math.cos(ang) * rad;
      pz = 2.4 + Math.sin(ang) * rad * 1.25;
    } else {
      const ang = rng() * Math.PI * 2;
      const rad = 2.0 + rng() * 20.0;
      px = Math.cos(ang) * rad;
      pz = Math.sin(ang) * rad;
    }
    const py = groundHeightAt(px, pz);
    const sx = 0.65 + rng() * 1.45;
    const sy = 0.38 + rng() * 0.55;
    const sz = 0.65 + rng() * 1.35;
    dummy.position.set(px, py + sy * 0.05, pz);
    dummy.rotation.set(rng() * 0.5, rng() * Math.PI * 2, rng() * 0.5);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    pebbleInst.setMatrixAt(i, dummy.matrix);
    const shade = 0.38 + rng() * 0.24;
    pebbleInst.setColorAt(i, new THREE.Color(shade, shade + 0.03, shade - 0.01));
  }
  pebbleInst.instanceMatrix.needsUpdate = true;
  if (pebbleInst.instanceColor) pebbleInst.instanceColor.needsUpdate = true;
  pebbleInst.computeBoundingSphere();
  group.add(pebbleInst);

  // -------------------------------------------------------------------------
  // 8. Timber Trail Edge Stepping Planks (Subtle Bukit Timah Boardwalk Cue)
  // -------------------------------------------------------------------------
  const plankGeo = trackGeo(new THREE.BoxGeometry(1.5, 0.07, 0.34));
  const plankMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.rottingLogMap,
      bumpMap: textures.rottingLogBump,
      bumpScale: 0.06,
      color: '#8c6d4e',
      roughness: 0.88,
    }),
  );
  const plankCount = 14;
  const plankInst = new THREE.InstancedMesh(plankGeo, plankMat, plankCount);
  plankInst.receiveShadow = true;
  for (let i = 0; i < plankCount; i++) {
    const pz = 2.0 - i * 1.15;
    const px = Math.sin(pz * 0.14) * 2.1;
    const py = groundHeightAt(px, pz);
    dummy.position.set(px, py + 0.03, pz);
    dummy.rotation.set(0, Math.cos(pz * 0.14) * 0.25, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    plankInst.setMatrixAt(i, dummy.matrix);
  }
  plankInst.instanceMatrix.needsUpdate = true;
  plankInst.computeBoundingSphere();
  group.add(plankInst);

  // -------------------------------------------------------------------------
  // 9. Floating Sun-Dappled Rainforest Pollen & Golden Spores
  // -------------------------------------------------------------------------
  const pollenCount = 240;
  const pollenPositions = new Float32Array(pollenCount * 3);
  const pollenSeeds = new Float32Array(pollenCount);
  for (let i = 0; i < pollenCount; i++) {
    pollenPositions[i * 3] = (rng() - 0.5) * 44;
    pollenPositions[i * 3 + 1] = 0.6 + rng() * 8.5;
    pollenPositions[i * 3 + 2] = (rng() - 0.5) * 44;
    pollenSeeds[i] = rng() * Math.PI * 2;
  }
  const pollenGeo = trackGeo(new THREE.BufferGeometry());
  pollenGeo.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3));
  const pollenMat = trackMat(
    new THREE.PointsMaterial({
      color: '#fff4c4',
      size: 0.11,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  const pollenPoints = new THREE.Points(pollenGeo, pollenMat);
  pollenPoints.frustumCulled = false;
  group.add(pollenPoints);

  // -------------------------------------------------------------------------
  // Animation update (gentle water ripple + drifting pollen)
  // -------------------------------------------------------------------------
  const update = (elapsed: number, delta: number) => {
    textures.waterBump.offset.x = (elapsed * 0.025) % 1;
    textures.waterBump.offset.y = (elapsed * 0.018) % 1;

    const pAttr = pollenGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pollenCount; i++) {
      const seed = pollenSeeds[i];
      const y = pAttr.getY(i) + Math.sin(elapsed * 0.7 + seed) * delta * 0.14;
      const x = pAttr.getX(i) + Math.cos(elapsed * 0.45 + seed) * delta * 0.09;
      pAttr.setXY(i, x, y > 9.5 ? 0.8 : y < 0.4 ? 8.5 : y);
    }
    pAttr.needsUpdate = true;
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };

  return { group, colliders, update, dispose };
}
