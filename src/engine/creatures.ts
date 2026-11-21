import * as THREE from 'three';
import { SpeciesData } from '../types/game';
import { groundHeightAt, WATER_LEVEL } from './forest';
import { ProceduralTextureSet } from './textures';

export interface CreatureInstance {
  species: SpeciesData;
  /** Full world anchor group including perch prop */
  worldGroup: THREE.Group;
  /** Creature local group (pivot for inspection & hotspot anchors) */
  creatureGroup: THREE.Group;
  /** Invisible forgiving raycast hit sphere on clickable list */
  hitMesh: THREE.Mesh;
  /** Subtle sunlit discovery ring around/beneath undiscovered species */
  haloMesh: THREE.Mesh;
  /** Live biological idle animation */
  update: (elapsed: number, delta: number) => void;
  setDiscoveredVisual: (discovered: boolean) => void;
  setHighlighted: (highlighted: boolean) => void;
  dispose: () => void;
}

/** Shared helper for tracking per-creature disposable resources */
class ResourceBag {
  geometries: THREE.BufferGeometry[] = [];
  materials: THREE.Material[] = [];
  geo<T extends THREE.BufferGeometry>(g: T): T {
    this.geometries.push(g);
    return g;
  }
  mat<T extends THREE.Material>(m: T): T {
    this.materials.push(m);
    return m;
  }
  dispose() {
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
  }
}

function makeTube(
  bag: ResourceBag,
  points: [number, number, number][],
  radius: number,
  mat: THREE.Material,
  tubularSegments = 10,
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  const geo = bag.geo(new THREE.TubeGeometry(curve, tubularSegments, radius, 6, false));
  return new THREE.Mesh(geo, mat);
}

/** Natural habitat perch prop so every creature is authentically grounded */
function buildPerchProp(
  bag: ResourceBag,
  perchType: SpeciesData['perchType'],
  perchHeight: number,
  textures: ProceduralTextureSet,
  castShadows: boolean,
): THREE.Group {
  const perch = new THREE.Group();
  const barkMat = bag.mat(
    new THREE.MeshStandardMaterial({
      map: textures.barkMap,
      bumpMap: textures.barkBump,
      bumpScale: 0.1,
      roughness: 0.88,
    }),
  );
  const mossStoneMat = bag.mat(
    new THREE.MeshStandardMaterial({
      color: '#5a6b54',
      bumpMap: textures.floorBump,
      bumpScale: 0.08,
      roughness: 0.9,
    }),
  );
  const leafMat = bag.mat(
    new THREE.MeshStandardMaterial({
      map: textures.leafMap,
      roughness: 0.6,
      side: THREE.DoubleSide,
      color: '#48863d',
    }),
  );

  if (perchType === 'flower') {
    // Torch Ginger tropical flower cluster for Common Rose Butterfly
    const stem = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.03, 0.045, perchHeight * 0.88, 7)), leafMat);
    stem.position.y = perchHeight * 0.44;
    perch.add(stem);

    const petalMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#e6535b', roughness: 0.45, side: THREE.DoubleSide }));
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const petal = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.11, 0.28, 5)), petalMat);
      petal.position.set(Math.cos(a) * 0.09, perchHeight * 0.86, Math.sin(a) * 0.09);
      petal.rotation.z = -Math.cos(a) * 0.72;
      petal.rotation.x = Math.sin(a) * 0.72;
      perch.add(petal);
    }
    for (let l = 0; l < 4; l++) {
      const a = (l / 4) * Math.PI * 2 + 0.4;
      const leaf = new THREE.Mesh(bag.geo(new THREE.PlaneGeometry(0.32, 0.7)), leafMat);
      leaf.position.set(Math.cos(a) * 0.26, 0.36, Math.sin(a) * 0.26);
      leaf.rotation.set(0.9, a, 0);
      perch.add(leaf);
    }
  } else if (perchType === 'fern') {
    // Broad arched rainforest fern & shrub perch
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const frond = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.24, 0.02, 0.92)), leafMat);
      frond.position.set(Math.cos(a) * 0.32, perchHeight * 0.72, Math.sin(a) * 0.32);
      frond.rotation.y = -a + Math.PI / 2;
      frond.rotation.x = 0.24;
      perch.add(frond);
    }
    const pad = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.34, 0.14, perchHeight * 0.88, 7)), leafMat);
    pad.position.y = perchHeight * 0.44;
    perch.add(pad);
  } else if (perchType === 'mossRock') {
    const rock = new THREE.Mesh(bag.geo(new THREE.DodecahedronGeometry(0.62, 1)), mossStoneMat);
    rock.scale.set(1.25, perchHeight / 0.55, 1.1);
    rock.position.y = perchHeight * 0.46;
    rock.castShadow = castShadows;
    rock.receiveShadow = true;
    perch.add(rock);
  } else if (perchType === 'branch') {
    // Grounded angled tree bough for Hornbill
    const post = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.11, 0.18, perchHeight * 1.12, 8)), barkMat);
    post.position.set(-0.35, perchHeight * 0.52, -0.15);
    post.rotation.z = -0.22;
    post.castShadow = castShadows;
    perch.add(post);

    const bough = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.065, 0.1, 1.6, 8)), barkMat);
    bough.rotation.z = Math.PI / 2 - 0.08;
    bough.position.set(0.1, perchHeight - 0.05, 0);
    bough.castShadow = castShadows;
    perch.add(bough);
  } else if (perchType === 'deadwood') {
    const twigMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#6b533b', roughness: 0.92 }));
    const stem = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.05, 0.09, perchHeight * 1.15, 7)), twigMat);
    stem.position.set(-0.22, perchHeight * 0.55, 0);
    stem.rotation.z = -0.32;
    perch.add(stem);
    const arm = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.035, 0.055, 1.3, 7)), twigMat);
    arm.position.set(0.08, perchHeight - 0.03, 0);
    arm.rotation.z = Math.PI / 2 + 0.06;
    perch.add(arm);
  } else if (perchType === 'rottingLog') {
    const logMat = bag.mat(
      new THREE.MeshStandardMaterial({
        map: textures.rottingLogMap,
        bumpMap: textures.rottingLogBump,
        bumpScale: 0.12,
        roughness: 0.92,
      }),
    );
    const log = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.32, 0.38, 2.5, 10)), logMat);
    log.rotation.z = Math.PI / 2;
    log.position.set(0, perchHeight - 0.12, 0);
    log.castShadow = castShadows;
    log.receiveShadow = true;
    perch.add(log);
  } else if (perchType === 'leafNest') {
    // Low tree branch holding a stitched green Weaver Ant leaf nest
    const bough = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.05, 0.09, perchHeight * 1.15, 7)), barkMat);
    bough.position.set(-0.2, perchHeight * 0.52, -0.2);
    bough.rotation.z = -0.2;
    perch.add(bough);
    const nestMat = bag.mat(
      new THREE.MeshStandardMaterial({ map: textures.leafMap, color: '#589444', roughness: 0.68 }),
    );
    const nest = new THREE.Mesh(bag.geo(new THREE.IcosahedronGeometry(0.34, 1)), nestMat);
    nest.position.set(-0.18, perchHeight - 0.18, -0.18);
    nest.scale.set(1.2, 0.85, 1.0);
    perch.add(nest);
    const silkMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#ece7d5', roughness: 0.85 }));
    const silk = new THREE.Mesh(bag.geo(new THREE.TorusGeometry(0.24, 0.025, 5, 12)), silkMat);
    silk.position.copy(nest.position);
    silk.rotation.x = 0.7;
    perch.add(silk);
  } else if (perchType === 'treeTrunk') {
    // Bark shelf mount against the nearby giant dipterocarp trunk
    const barkSlab = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.45, 0.56, perchHeight + 1.4, 9)), barkMat);
    barkSlab.position.set(0, (perchHeight + 1.4) * 0.5 - 0.2, -0.46);
    barkSlab.castShadow = castShadows;
    perch.add(barkSlab);
  } else if (perchType === 'mudbank' || perchType === 'streamBank' || perchType === 'roots') {
    const mound = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.68, 0.95, 0.16, 10)), mossStoneMat);
    mound.position.y = 0.02;
    mound.receiveShadow = true;
    perch.add(mound);
  }

  return perch;
}

/**
 * Assemble each of the 12 species as a composite 6–14 part procedural 3D sculpture.
 */
function buildSpeciesGeometry(
  bag: ResourceBag,
  species: SpeciesData,
  textures: ProceduralTextureSet,
  castShadows: boolean,
): { group: THREE.Group; update: (elapsed: number, delta: number) => void } {
  const g = new THREE.Group();
  let update: (elapsed: number, delta: number) => void = () => {};

  const glossyEyeMat = bag.mat(
    new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.08, metalness: 0.25 }),
  );

  switch (species.id) {
    // -----------------------------------------------------------------------
    // 1. COMMON ROSE BUTTERFLY (Velvet black + crimson spotted swallowtail)
    // -----------------------------------------------------------------------
    case 'common-rose-butterfly': {
      const bodyMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#1a181c', roughness: 0.65 }));
      const crimsonMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#d42646', roughness: 0.45 }));
      const wingMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.butterflyWingMap,
          roughness: 0.52,
          metalness: 0.05,
          side: THREE.DoubleSide,
        }),
      );

      // Head, thorax, crimson-accented abdomen
      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.065, 10, 8)), crimsonMat);
      head.position.set(0, 0.05, 0.24);
      const thorax = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.06, 0.16, 6, 8)), bodyMat);
      thorax.rotation.x = Math.PI / 2;
      thorax.position.set(0, 0.04, 0.08);
      const abdomen = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.052, 0.24, 6, 8)), crimsonMat);
      abdomen.rotation.x = Math.PI / 2 + 0.1;
      abdomen.position.set(0, 0.01, -0.18);
      g.add(head, thorax, abdomen);

      // Clubbed antennae
      for (const side of [-1, 1]) {
        const ant = makeTube(
          bag,
          [
            [side * 0.025, 0.07, 0.27],
            [side * 0.08, 0.17, 0.38],
            [side * 0.11, 0.21, 0.45],
          ],
          0.008,
          bodyMat,
        );
        const club = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.018, 6, 6)), bodyMat);
        club.position.set(side * 0.11, 0.21, 0.45);
        g.add(ant, club);
      }

      // 6 jointed slender legs
      for (const side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          const z = 0.14 - i * 0.09;
          const leg = makeTube(
            bag,
            [
              [side * 0.04, 0.01, z],
              [side * 0.12, -0.07, z + 0.02],
              [side * 0.15, -0.15, z - 0.02],
            ],
            0.007,
            bodyMat,
            6,
          );
          g.add(leg);
        }
      }

      // Sculpted swallowtail wings (Extrude/Shape geometry for crisp silhouette)
      const foreShape = new THREE.Shape();
      foreShape.moveTo(0, 0);
      foreShape.bezierCurveTo(0.18, 0.3, 0.48, 0.34, 0.56, 0.16);
      foreShape.bezierCurveTo(0.58, 0.02, 0.32, -0.14, 0, -0.08);
      const foreGeo = bag.geo(new THREE.ShapeGeometry(foreShape, 10));

      const hindShape = new THREE.Shape();
      hindShape.moveTo(0, -0.04);
      hindShape.bezierCurveTo(0.32, -0.06, 0.42, -0.26, 0.28, -0.42);
      // Swallowtail spur
      hindShape.lineTo(0.34, -0.54);
      hindShape.lineTo(0.24, -0.52);
      hindShape.lineTo(0.18, -0.4);
      hindShape.bezierCurveTo(0.08, -0.38, 0.02, -0.24, 0, -0.04);
      const hindGeo = bag.geo(new THREE.ShapeGeometry(hindShape, 10));

      const leftWingPivot = new THREE.Group();
      const rightWingPivot = new THREE.Group();
      leftWingPivot.position.set(-0.04, 0.07, 0.05);
      rightWingPivot.position.set(0.04, 0.07, 0.05);

      const rf = new THREE.Mesh(foreGeo, wingMat);
      rf.rotation.x = -Math.PI / 2;
      const rh = new THREE.Mesh(hindGeo, wingMat);
      rh.rotation.x = -Math.PI / 2;
      rightWingPivot.add(rf, rh);

      const lf = new THREE.Mesh(foreGeo, wingMat);
      lf.rotation.x = -Math.PI / 2;
      lf.scale.x = -1;
      const lh = new THREE.Mesh(hindGeo, wingMat);
      lh.rotation.x = -Math.PI / 2;
      lh.scale.x = -1;
      leftWingPivot.add(lf, lh);

      g.add(leftWingPivot, rightWingPivot);

      update = (elapsed) => {
        const flap = Math.sin(elapsed * 6.5) * 0.55 + 0.32;
        rightWingPivot.rotation.z = flap;
        leftWingPivot.rotation.z = -flap;
        g.position.y = Math.sin(elapsed * 2.4) * 0.06;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 2. FIELD GRASSHOPPER (Emerald-olive body, huge muscular jumping hind legs)
    // -----------------------------------------------------------------------
    case 'field-grasshopper': {
      const greenMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#588c36', roughness: 0.48, metalness: 0.04 }),
      );
      const oliveMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#7ca848', roughness: 0.38, metalness: 0.05 }),
      );
      const darkStripe = bag.mat(new THREE.MeshStandardMaterial({ color: '#334c20', roughness: 0.65 }));

      // Pronotum / thorax shield
      const thorax = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.095, 0.11, 0.24, 10)), greenMat);
      thorax.rotation.x = Math.PI / 2;
      thorax.position.set(0, 0.16, 0.14);
      thorax.castShadow = castShadows;

      // Segmented tapering abdomen
      const abdomen = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.095, 0.52, 10)), oliveMat);
      abdomen.rotation.x = -Math.PI / 2 - 0.08;
      abdomen.position.set(0, 0.15, -0.22);

      // Head + large compound eyes
      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.095, 10, 8)), greenMat);
      head.scale.set(0.9, 1.15, 0.85);
      head.position.set(0, 0.19, 0.32);

      for (const s of [-1, 1]) {
        const eye = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.036, 8, 8)), glossyEyeMat);
        eye.position.set(s * 0.068, 0.23, 0.35);
        g.add(eye);
      }

      // Short stubby grasshopper antennae
      const antGroup = new THREE.Group();
      for (const s of [-1, 1]) {
        const ant = makeTube(
          bag,
          [
            [s * 0.03, 0.25, 0.37],
            [s * 0.08, 0.31, 0.45],
            [s * 0.11, 0.32, 0.51],
          ],
          0.008,
          darkStripe,
        );
        antGroup.add(ant);
      }

      // Folded forewings along back
      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.03, 0.09, 0.54)), darkStripe);
        wing.position.set(s * 0.072, 0.2, -0.14);
        wing.rotation.y = s * -0.05;
        g.add(wing);
      }

      // Front & middle walking legs
      for (const s of [-1, 1]) {
        g.add(
          makeTube(bag, [[s * 0.07, 0.12, 0.22], [s * 0.16, 0.07, 0.28], [s * 0.18, 0.0, 0.32]], 0.014, greenMat, 6),
          makeTube(bag, [[s * 0.08, 0.12, 0.08], [s * 0.18, 0.06, 0.08], [s * 0.2, 0.0, 0.04]], 0.015, greenMat, 6),
        );
      }

      // Enlarged muscular hind jumping legs (femur + tibia)
      for (const s of [-1, 1]) {
        const femur = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.044, 0.26, 6, 8)), oliveMat);
        femur.position.set(s * 0.14, 0.21, -0.1);
        femur.rotation.set(0.65, 0, s * -0.2);
        const tibia = makeTube(
          bag,
          [
            [s * 0.17, 0.32, -0.22],
            [s * 0.19, 0.14, -0.34],
            [s * 0.22, 0.0, -0.39],
          ],
          0.015,
          darkStripe,
          6,
        );
        g.add(femur, tibia);
      }

      g.add(thorax, abdomen, head, antGroup);
      update = (elapsed) => {
        antGroup.rotation.x = Math.sin(elapsed * 4.2) * 0.08;
        abdomen.scale.y = 1 + Math.sin(elapsed * 3.1) * 0.03;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 3. GREEN TREE FROG (Glossy moist emerald skin, bulging golden eyes, toe pads)
    // -----------------------------------------------------------------------
    case 'green-tree-frog': {
      const moistSkinMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#45a84b', roughness: 0.18, metalness: 0.06 }),
      );
      const bellyMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#d7e8a8', roughness: 0.35 }));
      const goldIrisMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#e6b835', roughness: 0.15, metalness: 0.2 }));

      // Compact hunched torso
      const body = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.24, 14, 12)), moistSkinMat);
      body.scale.set(0.95, 0.72, 1.3);
      body.position.set(0, 0.19, -0.02);
      body.rotation.x = -0.28;
      body.castShadow = castShadows;

      // Pale vocal throat sac
      const throat = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.12, 10, 8)), bellyMat);
      throat.position.set(0, 0.19, 0.22);

      // Broad flat snout
      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.17, 12, 10)), moistSkinMat);
      head.scale.set(1.12, 0.68, 1.05);
      head.position.set(0, 0.26, 0.2);

      // Bulging golden turret eyes
      for (const s of [-1, 1]) {
        const iris = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.055, 10, 8)), goldIrisMat);
        iris.position.set(s * 0.11, 0.34, 0.23);
        const pupil = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.032, 8, 8)), glossyEyeMat);
        pupil.position.set(s * 0.128, 0.345, 0.258);
        g.add(iris, pupil);
      }

      // Folded muscular hind legs + webbed feet & adhesive toe pads
      for (const s of [-1, 1]) {
        const thigh = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.062, 0.2, 6, 8)), moistSkinMat);
        thigh.position.set(s * 0.19, 0.12, -0.14);
        thigh.rotation.set(0.95, s * 0.35, s * -0.45);
        const foot = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.09, 0.11, 0.025, 6)), bellyMat);
        foot.position.set(s * 0.23, 0.015, -0.02);
        g.add(thigh, foot);

        // Front legs with adhesive suction toe pads
        const arm = makeTube(
          bag,
          [
            [s * 0.14, 0.18, 0.12],
            [s * 0.2, 0.09, 0.18],
            [s * 0.18, 0.02, 0.22],
          ],
          0.032,
          moistSkinMat,
          6,
        );
        g.add(arm);
        for (let t = -1; t <= 1; t++) {
          const pad = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.022, 6, 6)), bellyMat);
          pad.scale.set(1, 0.45, 1);
          pad.position.set(s * 0.18 + t * 0.038, 0.012, 0.27);
          g.add(pad);
        }
      }

      g.add(body, head, throat);
      update = (elapsed) => {
        const pulse = 1 + Math.sin(elapsed * 4.5) * 0.12;
        throat.scale.set(pulse, pulse * 0.9, pulse);
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 4. ORIENTAL PIED HORNBILL (Black & white plumage, iconic curved yellow beak + casque)
    // -----------------------------------------------------------------------
    case 'oriental-pied-hornbill': {
      const blackFeatherMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#1b1d20', roughness: 0.72, metalness: 0.06 }),
      );
      const whiteFeatherMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#f2efe6', roughness: 0.78 }));
      const casqueMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#e6c144', roughness: 0.34, metalness: 0.04 }));
      const clawMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#383836', roughness: 0.6 }));

      // Torso + white belly patch
      const torso = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.18, 0.34, 8, 12)), blackFeatherMat);
      torso.rotation.x = 0.58;
      torso.position.set(0, 0.36, -0.02);
      torso.castShadow = castShadows;

      const belly = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.16, 10, 8)), whiteFeatherMat);
      belly.scale.set(0.9, 1.15, 0.85);
      belly.position.set(0, 0.28, 0.04);

      // Folded black wings with white trailing edge
      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.16, 10, 8)), blackFeatherMat);
        wing.scale.set(0.36, 1.45, 0.95);
        wing.position.set(s * 0.17, 0.38, -0.06);
        wing.rotation.x = 0.65;
        g.add(wing);
      }

      // Long white-tipped pied tail
      const tail = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.16, 0.04, 0.56)), blackFeatherMat);
      tail.position.set(0, 0.24, -0.44);
      tail.rotation.x = -0.35;
      const tailTip = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.165, 0.042, 0.15)), whiteFeatherMat);
      tailTip.position.set(0, 0.16, -0.68);
      tailTip.rotation.x = -0.35;

      // Neck & head pivot for curious bird look-around
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.64, 0.14);

      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.125, 10, 10)), blackFeatherMat);
      const eyePatch = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.115, 8, 8)), whiteFeatherMat);
      eyePatch.scale.set(1.06, 0.55, 0.72);
      eyePatch.position.set(0, 0.01, 0.03);

      // Curved yellow hornbill bill + dorsal casque crest
      const beakShape = new THREE.Shape();
      beakShape.moveTo(0, -0.04);
      beakShape.quadraticCurveTo(0.24, -0.02, 0.44, -0.14);
      beakShape.quadraticCurveTo(0.28, 0.09, 0, 0.09);
      beakShape.closePath();
      const beakGeo = bag.geo(
        new THREE.ExtrudeGeometry(beakShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }),
      );
      beakGeo.center();
      const beak = new THREE.Mesh(beakGeo, casqueMat);
      beak.rotation.y = -Math.PI / 2;
      beak.position.set(0, -0.01, 0.28);

      const casque = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.052, 0.18, 6, 8)), casqueMat);
      casque.rotation.x = Math.PI / 2 - 0.15;
      casque.position.set(0, 0.11, 0.22);

      const casqueTip = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.06, 0.06, 0.09)), blackFeatherMat);
      casqueTip.position.set(0, 0.12, 0.32);

      for (const s of [-1, 1]) {
        const eye = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.024, 8, 8)), glossyEyeMat);
        eye.position.set(s * 0.11, 0.03, 0.05);
        headGroup.add(eye);
      }
      headGroup.add(head, eyePatch, beak, casque, casqueTip);

      // Two legs & gripping toes
      for (const s of [-1, 1]) {
        const leg = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.022, 0.02, 0.2, 6)), clawMat);
        leg.position.set(s * 0.07, 0.1, 0.02);
        const foot = new THREE.Mesh(bag.geo(new THREE.TorusGeometry(0.045, 0.014, 5, 8, Math.PI)), clawMat);
        foot.position.set(s * 0.07, 0.01, 0.02);
        foot.rotation.y = Math.PI / 2;
        g.add(leg, foot);
      }

      g.add(torso, belly, tail, tailTip, headGroup);
      update = (elapsed) => {
        headGroup.rotation.y = Math.sin(elapsed * 1.15) * 0.28;
        headGroup.rotation.x = Math.sin(elapsed * 0.7) * 0.08;
        tail.rotation.x = -0.35 + Math.sin(elapsed * 1.8) * 0.04;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 5. MALAYAN STICK INSECT (Camouflaged segmented brown twig body)
    // -----------------------------------------------------------------------
    case 'malayan-stick-insect': {
      const twigMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.barkMap,
          color: '#7c6244',
          roughness: 0.88,
        }),
      );
      const jointMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#55412c', roughness: 0.92 }));

      // Long slender segmented twig thorax & abdomen
      const body = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.024, 0.028, 0.92, 8)), twigMat);
      body.rotation.x = Math.PI / 2;
      body.position.set(0, 0.14, 0);
      body.castShadow = castShadows;
      g.add(body);

      // Segment rings like real bamboo/twig nodes
      for (let z = -0.38; z <= 0.36; z += 0.15) {
        const node = new THREE.Mesh(bag.geo(new THREE.TorusGeometry(0.028, 0.008, 5, 8)), jointMat);
        node.position.set(0, 0.14, z);
        g.add(node);
      }

      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.036, 8, 8)), twigMat);
      head.scale.set(0.9, 0.85, 1.35);
      head.position.set(0, 0.15, 0.48);
      g.add(head);

      // Long nocturnal feelers
      for (const s of [-1, 1]) {
        g.add(
          makeTube(
            bag,
            [
              [s * 0.015, 0.16, 0.52],
              [s * 0.05, 0.19, 0.66],
              [s * 0.09, 0.21, 0.82],
            ],
            0.005,
            jointMat,
            6,
          ),
        );
      }

      // 6 gangly stick-like jointed legs
      const legZ = [0.3, 0.06, -0.22];
      for (const s of [-1, 1]) {
        legZ.forEach((z, idx) => {
          const spread = idx === 0 ? 0.28 : idx === 1 ? 0.32 : 0.3;
          g.add(
            makeTube(
              bag,
              [
                [s * 0.02, 0.14, z],
                [s * (spread * 0.65), 0.22, z + (idx === 0 ? 0.14 : -0.06)],
                [s * spread, 0.0, z + (idx === 0 ? 0.24 : -0.18)],
              ],
              0.008,
              twigMat,
              6,
            ),
          );
        });
      }

      update = (elapsed) => {
        // Signature behavioural breeze-swaying adaptation!
        g.rotation.z = Math.sin(elapsed * 1.9) * 0.085;
        g.position.x = Math.sin(elapsed * 1.9) * 0.025;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 6. SUNDA PANGOLIN (Overlapping keratin scales, arched back, curved claws, thick tail)
    // -----------------------------------------------------------------------
    case 'sunda-pangolin': {
      const scaleMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.pangolinMap,
          bumpMap: textures.pangolinBump,
          bumpScale: 0.14,
          roughness: 0.46,
          metalness: 0.08,
        }),
      );
      const bellySkinMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#9c7e64', roughness: 0.86 }));
      const clawMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#d8cfb8', roughness: 0.42 }));

      // Arched armoured torso
      const torso = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.32, 14, 12)), scaleMat);
      torso.scale.set(0.88, 0.82, 1.52);
      torso.position.set(0, 0.31, -0.04);
      torso.castShadow = castShadows;

      // Overlapping dorsal scale ridge plates for crisp silhouette
      for (let i = 0; i < 6; i++) {
        const z = 0.28 - i * 0.14;
        const plate = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.18 - i * 0.012, 0.18, 6)), scaleMat);
        plate.position.set(0, 0.48 - Math.abs(i - 2) * 0.025, z);
        plate.rotation.x = -0.7;
        plate.scale.set(1.25, 0.6, 1.0);
        g.add(plate);
      }

      // Conical toothless snout & small ears
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.25, 0.44);
      const snout = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.12, 0.38, 10)), scaleMat);
      snout.rotation.x = Math.PI / 2 + 0.18;
      snout.position.set(0, -0.03, 0.14);
      const noseTip = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.036, 8, 8)), bellySkinMat);
      noseTip.position.set(0, -0.06, 0.33);
      for (const s of [-1, 1]) {
        const eye = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.022, 6, 6)), glossyEyeMat);
        eye.position.set(s * 0.078, 0.02, 0.08);
        headGroup.add(eye);
      }
      headGroup.add(snout, noseTip);

      // Thick tapering prehensile armoured tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.22, -0.45);
      const tail1 = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.11, 0.18, 0.46, 10)), scaleMat);
      tail1.rotation.x = Math.PI / 2 + 0.18;
      tail1.position.set(0, -0.04, -0.2);
      const tail2 = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.11, 0.48, 10)), scaleMat);
      tail2.rotation.x = -Math.PI / 2 - 0.1;
      tail2.position.set(0, -0.1, -0.62);
      tailGroup.add(tail1, tail2);

      // 4 sturdy legs + long curved digging claws on forelimbs
      for (const s of [-1, 1]) {
        const frontLeg = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.068, 0.058, 0.24, 8)), scaleMat);
        frontLeg.position.set(s * 0.2, 0.13, 0.28);
        g.add(frontLeg);
        for (let c = -1; c <= 1; c++) {
          const claw = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.016, 0.13, 5)), clawMat);
          claw.position.set(s * 0.2 + c * 0.028, 0.03, 0.34);
          claw.rotation.x = Math.PI / 2 + 0.4;
          g.add(claw);
        }
        const hindLeg = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.085, 0.07, 0.26, 8)), scaleMat);
        hindLeg.position.set(s * 0.21, 0.14, -0.26);
        g.add(hindLeg);
      }

      g.add(torso, headGroup, tailGroup);
      update = (elapsed) => {
        headGroup.rotation.x = Math.sin(elapsed * 2.2) * 0.08;
        headGroup.rotation.y = Math.sin(elapsed * 1.1) * 0.12;
        tailGroup.rotation.y = Math.sin(elapsed * 1.3) * 0.09;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 7. GIANT MUDSKIPPER (Amphibious fish: swollen gill chambers, crutch pectoral fins, turret eyes)
    // -----------------------------------------------------------------------
    case 'giant-mudskipper': {
      const fishSkinMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#58695e', roughness: 0.22, metalness: 0.12 }),
      );
      const finMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#456a74', roughness: 0.35, side: THREE.DoubleSide }),
      );
      const eyeRingMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#b7c798', roughness: 0.2 }));

      // Streamlined tapering amphibious fish body
      const body = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.11, 0.44, 8, 10)), fishSkinMat);
      body.rotation.x = Math.PI / 2 - 0.12;
      body.position.set(0, 0.16, 0.02);
      body.castShadow = castShadows;

      const tailBody = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.1, 0.46, 8)), fishSkinMat);
      tailBody.rotation.x = -Math.PI / 2 + 0.1;
      tailBody.position.set(0, 0.1, -0.36);

      // Enlarged bulbous gill cheeks holding water
      for (const s of [-1, 1]) {
        const gill = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.105, 10, 8)), fishSkinMat);
        gill.position.set(s * 0.1, 0.19, 0.22);
        g.add(gill);
      }

      // Periscopic turret eyes mounted on top of head
      const eyeGroup = new THREE.Group();
      for (const s of [-1, 1]) {
        const turret = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.052, 10, 8)), eyeRingMat);
        turret.position.set(s * 0.058, 0.31, 0.31);
        const pupil = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.032, 8, 8)), glossyEyeMat);
        pupil.position.set(s * 0.072, 0.32, 0.34);
        eyeGroup.add(turret, pupil);
      }

      // Tall spotted dorsal sail fin
      const dorsalShape = new THREE.Shape();
      dorsalShape.moveTo(0, 0);
      dorsalShape.quadraticCurveTo(0.1, 0.24, 0.34, 0.18);
      dorsalShape.lineTo(0.42, 0);
      dorsalShape.closePath();
      const dorsal = new THREE.Mesh(bag.geo(new THREE.ShapeGeometry(dorsalShape, 8)), finMat);
      dorsal.rotation.y = Math.PI / 2;
      dorsal.position.set(0, 0.21, 0.04);

      // Rounded caudal tail fin
      const caudal = new THREE.Mesh(bag.geo(new THREE.CircleGeometry(0.13, 10)), finMat);
      caudal.rotation.y = Math.PI / 2;
      caudal.position.set(0, 0.09, -0.62);

      // Muscular elbow-like pectoral walking fins
      const leftFin = new THREE.Group();
      const rightFin = new THREE.Group();
      for (const [s, grp] of [[-1, leftFin], [1, rightFin]] as const) {
        grp.position.set(s * 0.12, 0.12, 0.16);
        const arm = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.032, 0.12, 5, 6)), fishSkinMat);
        arm.rotation.z = s * -0.9;
        arm.position.set(s * 0.06, -0.04, 0);
        const fan = new THREE.Mesh(bag.geo(new THREE.CircleGeometry(0.09, 8)), finMat);
        fan.rotation.x = -Math.PI / 2 + 0.35;
        fan.position.set(s * 0.12, -0.09, 0.03);
        grp.add(arm, fan);
        g.add(grp);
      }

      g.add(body, tailBody, eyeGroup, dorsal, caudal);
      update = (elapsed) => {
        dorsal.scale.y = 0.85 + Math.sin(elapsed * 2.2) * 0.2;
        leftFin.rotation.y = Math.sin(elapsed * 2.6) * 0.12;
        rightFin.rotation.y = -Math.sin(elapsed * 2.6) * 0.12;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 8. WEAVER ANT (Amber-orange body, serrated mandibles, raised gaster)
    // -----------------------------------------------------------------------
    case 'weaver-ant': {
      const amberMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#c85a1c', roughness: 0.28, metalness: 0.08 }),
      );
      const darkAmber = bag.mat(new THREE.MeshStandardMaterial({ color: '#7d2f0c', roughness: 0.35 }));

      // Head, narrow elongated thorax, bulbous raised gaster (abdomen)
      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.095, 10, 8)), amberMat);
      head.scale.set(1.05, 0.88, 1.15);
      head.position.set(0, 0.17, 0.28);

      const thorax = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.055, 0.24, 6, 8)), amberMat);
      thorax.rotation.x = Math.PI / 2 - 0.15;
      thorax.position.set(0, 0.15, 0.04);

      const gaster = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.135, 12, 10)), amberMat);
      gaster.scale.set(0.95, 0.92, 1.28);
      gaster.position.set(0, 0.22, -0.26);
      gaster.rotation.x = 0.32;
      gaster.castShadow = castShadows;

      // Serrated mandibles
      const mandGroup = new THREE.Group();
      mandGroup.position.set(0, 0.15, 0.37);
      for (const s of [-1, 1]) {
        const jaw = makeTube(
          bag,
          [
            [s * 0.03, 0, 0],
            [s * 0.075, -0.01, 0.06],
            [s * 0.025, -0.01, 0.12],
          ],
          0.015,
          darkAmber,
          6,
        );
        mandGroup.add(jaw);
      }

      // Elbowed ant antennae + eyes
      for (const s of [-1, 1]) {
        const eye = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.024, 6, 6)), glossyEyeMat);
        eye.position.set(s * 0.075, 0.2, 0.31);
        g.add(eye);
        g.add(
          makeTube(
            bag,
            [
              [s * 0.03, 0.2, 0.34],
              [s * 0.12, 0.26, 0.44],
              [s * 0.18, 0.21, 0.56],
            ],
            0.009,
            darkAmber,
            6,
          ),
        );
      }

      // 6 long agile legs
      for (const s of [-1, 1]) {
        [0.14, 0.02, -0.1].forEach((z, idx) => {
          g.add(
            makeTube(
              bag,
              [
                [s * 0.05, 0.13, z],
                [s * 0.2, 0.19, z + (idx === 0 ? 0.08 : -0.06)],
                [s * 0.28, 0.0, z + (idx === 0 ? 0.16 : -0.16)],
              ],
              0.011,
              darkAmber,
              6,
            ),
          );
        });
      }

      g.add(head, thorax, gaster, mandGroup);
      update = (elapsed) => {
        gaster.rotation.x = 0.32 + Math.sin(elapsed * 3.4) * 0.08;
        mandGroup.scale.x = 1 + Math.sin(elapsed * 5.0) * 0.12;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 9. LEAF-MIMIC KATYDID (Cryptic veined leaf wings + extra-long whip antennae)
    // -----------------------------------------------------------------------
    case 'leaf-mimic-katydid': {
      const katMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.katydidWingMap,
          bumpMap: textures.katydidWingBump,
          bumpScale: 0.09,
          roughness: 0.55,
          side: THREE.DoubleSide,
        }),
      );
      const greenLegMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#4d8734', roughness: 0.52 }));

      // Broad vertical tented leaf-shaped forewings
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.bezierCurveTo(0.18, 0.28, 0.48, 0.32, 0.68, 0.06);
      wingShape.bezierCurveTo(0.48, -0.14, 0.18, -0.12, 0, 0);
      const wGeo = bag.geo(new THREE.ShapeGeometry(wingShape, 10));

      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(wGeo, katMat);
        wing.rotation.y = Math.PI / 2 + s * 0.14;
        wing.rotation.x = s * 0.14;
        wing.position.set(s * 0.045, 0.18, 0.22);
        wing.castShadow = castShadows;
        g.add(wing);
      }

      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.075, 10, 8)), greenLegMat);
      head.position.set(0, 0.2, 0.28);
      g.add(head);

      // Extra-long whip-like antennae (longer than body — dichotomous key diagnostic trait!)
      const antGroup = new THREE.Group();
      for (const s of [-1, 1]) {
        antGroup.add(
          makeTube(
            bag,
            [
              [s * 0.025, 0.24, 0.33],
              [s * 0.12, 0.35, 0.52],
              [s * 0.26, 0.38, 0.78],
              [s * 0.35, 0.32, 1.02],
            ],
            0.0055,
            greenLegMat,
            10,
          ),
        );
      }
      g.add(antGroup);

      // 6 spindly green legs
      for (const s of [-1, 1]) {
        g.add(
          makeTube(bag, [[s * 0.05, 0.15, 0.22], [s * 0.16, 0.12, 0.26], [s * 0.18, 0.0, 0.29]], 0.011, greenLegMat, 6),
          makeTube(bag, [[s * 0.06, 0.14, 0.06], [s * 0.17, 0.1, 0.05], [s * 0.19, 0.0, 0.02]], 0.011, greenLegMat, 6),
          makeTube(bag, [[s * 0.07, 0.16, -0.06], [s * 0.16, 0.3, -0.24], [s * 0.19, 0.0, -0.4]], 0.013, greenLegMat, 6),
        );
      }

      update = (elapsed) => {
        antGroup.rotation.y = Math.sin(elapsed * 2.1) * 0.12;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 10. ASIATIC RHINOCEROS BEETLE (Glossy dark carapace, curved horn, spiny legs)
    // -----------------------------------------------------------------------
    case 'rhinoceros-beetle': {
      const chitinMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#1b1412', roughness: 0.16, metalness: 0.32 }),
      );
      const seamMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#332018', roughness: 0.35 }));

      // Glossy domed elytra wing-cases
      const elytra = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.22, 14, 12)), chitinMat);
      elytra.scale.set(0.95, 0.72, 1.38);
      elytra.position.set(0, 0.17, -0.1);
      elytra.castShadow = castShadows;

      // Wing-case center seam
      const seam = new THREE.Mesh(bag.geo(new THREE.BoxGeometry(0.016, 0.02, 0.56)), seamMat);
      seam.position.set(0, 0.32, -0.1);

      // Sculpted thoracic pronotum shield
      const pronotum = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.18, 12, 10)), chitinMat);
      pronotum.scale.set(1.02, 0.78, 0.92);
      pronotum.position.set(0, 0.17, 0.2);

      // Head + iconic curved cephalic horn
      const head = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.1, 10, 8)), chitinMat);
      head.position.set(0, 0.14, 0.36);

      const horn = makeTube(
        bag,
        [
          [0, 0.16, 0.4],
          [0, 0.24, 0.5],
          [0, 0.38, 0.48],
          [0, 0.45, 0.42],
        ],
        0.028,
        chitinMat,
        10,
      );
      const hornTip = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.026, 0.09, 6)), chitinMat);
      hornTip.position.set(0, 0.47, 0.4);
      hornTip.rotation.x = -0.5;

      // 6 sturdy spiny burrowing legs
      for (const s of [-1, 1]) {
        [0.22, 0.04, -0.16].forEach((z, idx) => {
          g.add(
            makeTube(
              bag,
              [
                [s * 0.14, 0.12, z],
                [s * 0.26, 0.12, z + (idx === 0 ? 0.1 : -0.05)],
                [s * 0.3, 0.0, z + (idx === 0 ? 0.14 : -0.12)],
              ],
              0.022,
              seamMat,
              6,
            ),
          );
        });
      }

      g.add(elytra, seam, pronotum, head, horn, hornTip);
      update = (elapsed) => {
        g.position.y = Math.abs(Math.sin(elapsed * 2.0)) * 0.012;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 11. DRACO FLYING LIZARD (Bark scales, rib-supported glide patagia, bright yellow dewlap)
    // -----------------------------------------------------------------------
    case 'draco-flying-lizard': {
      const barkScaleMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.reptileScaleMap,
          bumpMap: textures.reptileScaleBump,
          bumpScale: 0.08,
          color: '#7c765a',
          roughness: 0.72,
        }),
      );
      const patagiaMat = bag.mat(
        new THREE.MeshStandardMaterial({
          color: '#c97b38',
          roughness: 0.48,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
        }),
      );
      const dewlapMat = bag.mat(
        new THREE.MeshStandardMaterial({ color: '#f2c733', roughness: 0.38, side: THREE.DoubleSide }),
      );

      // Sleek flattened trunk + long whip tail
      const torso = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.068, 0.36, 6, 10)), barkScaleMat);
      torso.rotation.x = Math.PI / 2;
      torso.scale.set(1.15, 0.7, 1.0);
      torso.position.set(0, 0.14, 0);
      torso.castShadow = castShadows;

      const tail = makeTube(
        bag,
        [
          [0, 0.13, -0.22],
          [0.03, 0.12, -0.52],
          [-0.02, 0.11, -0.84],
          [0.02, 0.1, -1.12],
        ],
        0.026,
        barkScaleMat,
        10,
      );

      const head = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.075, 0.22, 8)), barkScaleMat);
      head.rotation.x = Math.PI / 2;
      head.position.set(0, 0.17, 0.34);

      // Extensible bright yellow throat dewlap
      const dewlapShape = new THREE.Shape();
      dewlapShape.moveTo(0, 0);
      dewlapShape.lineTo(0.14, -0.02);
      dewlapShape.quadraticCurveTo(0.08, -0.22, -0.04, -0.14);
      dewlapShape.closePath();
      const dewlap = new THREE.Mesh(bag.geo(new THREE.ShapeGeometry(dewlapShape, 6)), dewlapMat);
      dewlap.rotation.y = Math.PI / 2;
      dewlap.position.set(0, 0.14, 0.38);

      // Wide rib-supported gliding wing membranes (patagia)
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0.16);
      wingShape.bezierCurveTo(0.32, 0.18, 0.44, 0.02, 0.34, -0.14);
      wingShape.bezierCurveTo(0.22, -0.22, 0.08, -0.2, 0, -0.16);
      wingShape.closePath();
      const patGeo = bag.geo(new THREE.ShapeGeometry(wingShape, 8));

      const leftPat = new THREE.Mesh(patGeo, patagiaMat);
      leftPat.rotation.x = -Math.PI / 2;
      leftPat.scale.x = -1;
      leftPat.position.set(-0.06, 0.14, 0.0);

      const rightPat = new THREE.Mesh(patGeo, patagiaMat);
      rightPat.rotation.x = -Math.PI / 2;
      rightPat.position.set(0.06, 0.14, 0.0);

      // 4 agile climbing lizard limbs
      for (const s of [-1, 1]) {
        g.add(
          makeTube(bag, [[s * 0.06, 0.13, 0.18], [s * 0.18, 0.12, 0.24], [s * 0.22, 0.02, 0.28]], 0.016, barkScaleMat, 6),
          makeTube(bag, [[s * 0.06, 0.13, -0.16], [s * 0.2, 0.12, -0.2], [s * 0.24, 0.02, -0.24]], 0.018, barkScaleMat, 6),
        );
      }

      g.add(torso, tail, head, dewlap, leftPat, rightPat);
      update = (elapsed) => {
        // Male territory dewlap flash + gentle glide-membrane flex
        const flash = 0.68 + Math.max(0, Math.sin(elapsed * 2.2)) * 0.45;
        dewlap.scale.set(1, flash, 1);
        const flex = Math.sin(elapsed * 1.6) * 0.12;
        rightPat.rotation.z = flex;
        leftPat.rotation.z = -flex;
      };
      break;
    }

    // -----------------------------------------------------------------------
    // 12. MALAYAN WATER MONITOR (Apex reptile: ocelli scales, forked tongue, paddle tail)
    // -----------------------------------------------------------------------
    case 'malayan-water-monitor': {
      const monitorMat = bag.mat(
        new THREE.MeshStandardMaterial({
          map: textures.reptileScaleMap,
          bumpMap: textures.reptileScaleBump,
          bumpScale: 0.1,
          roughness: 0.42,
          metalness: 0.06,
        }),
      );
      const tongueMat = bag.mat(new THREE.MeshStandardMaterial({ color: '#c44b66', roughness: 0.3 }));

      // Muscular torso + long neck + streamlined snout
      const torso = new THREE.Mesh(bag.geo(new THREE.CapsuleGeometry(0.18, 0.68, 8, 12)), monitorMat);
      torso.rotation.x = Math.PI / 2;
      torso.scale.set(1.12, 0.85, 1.0);
      torso.position.set(0, 0.24, 0.0);
      torso.castShadow = castShadows;

      const neck = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.1, 0.14, 0.36, 10)), monitorMat);
      neck.rotation.x = Math.PI / 2 - 0.18;
      neck.position.set(0, 0.28, 0.52);

      const head = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.11, 0.38, 10)), monitorMat);
      head.rotation.x = Math.PI / 2 + 0.05;
      head.scale.set(1.0, 1.0, 0.72);
      head.position.set(0, 0.31, 0.82);

      for (const s of [-1, 1]) {
        const eye = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(0.024, 8, 8)), glossyEyeMat);
        eye.position.set(s * 0.072, 0.34, 0.78);
        g.add(eye);
      }

      // Forked chemosensory tongue
      const tongueGroup = new THREE.Group();
      tongueGroup.position.set(0, 0.29, 0.96);
      const tStem = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.009, 0.011, 0.14, 5)), tongueMat);
      tStem.rotation.x = Math.PI / 2;
      tStem.position.z = 0.06;
      const tLeft = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.004, 0.008, 0.09, 5)), tongueMat);
      tLeft.rotation.set(Math.PI / 2, 0, 0.45);
      tLeft.position.set(-0.025, 0, 0.15);
      const tRight = new THREE.Mesh(bag.geo(new THREE.CylinderGeometry(0.004, 0.008, 0.09, 5)), tongueMat);
      tRight.rotation.set(Math.PI / 2, 0, -0.45);
      tRight.position.set(0.025, 0, 0.15);
      tongueGroup.add(tStem, tLeft, tRight);

      // Laterally compressed paddle-shaped swimming tail
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.2, -0.44);
      const tailMain = new THREE.Mesh(bag.geo(new THREE.ConeGeometry(0.15, 1.35, 10)), monitorMat);
      tailMain.rotation.x = -Math.PI / 2;
      tailMain.scale.set(0.42, 1.0, 1.15); // Laterally flattened like a paddle!
      tailMain.position.set(0, -0.02, -0.66);
      tailMain.castShadow = castShadows;
      tailGroup.add(tailMain);

      // 4 sprawling clawed reptile legs
      for (const s of [-1, 1]) {
        g.add(
          makeTube(
            bag,
            [
              [s * 0.16, 0.2, 0.3],
              [s * 0.32, 0.16, 0.34],
              [s * 0.36, 0.02, 0.38],
            ],
            0.048,
            monitorMat,
            6,
          ),
          makeTube(
            bag,
            [
              [s * 0.16, 0.2, -0.28],
              [s * 0.34, 0.17, -0.32],
              [s * 0.38, 0.02, -0.34],
            ],
            0.056,
            monitorMat,
            6,
          ),
        );
      }

      g.add(torso, neck, head, tongueGroup, tailGroup);
      update = (elapsed) => {
        tailGroup.rotation.y = Math.sin(elapsed * 1.45) * 0.16;
        // Periodic forked tongue flick
        const cycle = elapsed % 3.2;
        const flick = cycle < 0.45 ? Math.sin((cycle / 0.45) * Math.PI) : 0;
        tongueGroup.scale.set(1, 1, Math.max(0.01, flick));
        tongueGroup.visible = flick > 0.05;
      };
      break;
    }
  }

  return { group: g, update };
}

export function createCreatureInstance(
  species: SpeciesData,
  textures: ProceduralTextureSet,
  castShadows: boolean,
): CreatureInstance {
  const bag = new ResourceBag();
  const worldGroup = new THREE.Group();

  const [sx, sz] = species.spawnXZ;
  const rawGroundY = groundHeightAt(sx, sz);
  const baseY =
    species.perchType === 'mudbank' || species.perchType === 'streamBank'
      ? Math.max(rawGroundY, WATER_LEVEL + 0.03)
      : rawGroundY;

  worldGroup.position.set(sx, baseY, sz);
  worldGroup.rotation.y = species.initialYaw;

  // Natural grounded perch prop
  const perchProp = buildPerchProp(bag, species.perchType, species.perchHeight, textures, castShadows);
  worldGroup.add(perchProp);

  // Soft contact shadow directly beneath the prop
  const shadowMat = bag.mat(
    new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    }),
  );
  const shadowPlane = new THREE.Mesh(bag.geo(new THREE.PlaneGeometry(1.5, 1.5)), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.025;
  worldGroup.add(shadowPlane);

  // Build multi-part 3D creature sculpture
  const { group: creatureGroup, update: creatureAnim } = buildSpeciesGeometry(
    bag,
    species,
    textures,
    castShadows,
  );
  creatureGroup.position.y = species.perchHeight;
  creatureGroup.scale.setScalar(species.worldScale);
  worldGroup.add(creatureGroup);

  // Subtle sunlit field-guide halo ring (clearer on Easy, subtler on Hard for authentic cryptic discovery)
  const baseHaloOpacity =
    species.difficulty === 'easy' ? 0.62 : species.difficulty === 'medium' ? 0.36 : 0.16;
  const haloMat = bag.mat(
    new THREE.MeshBasicMaterial({
      color: '#e8d27c',
      transparent: true,
      opacity: baseHaloOpacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const haloMesh = new THREE.Mesh(bag.geo(new THREE.RingGeometry(0.46, 0.56, 24)), haloMat);
  haloMesh.rotation.x = -Math.PI / 2;
  haloMesh.position.y = Math.max(0.05, species.perchHeight - 0.04);
  worldGroup.add(haloMesh);

  // Forgiving invisible raycast collision sphere so tapping on mobile or aiming on desktop feels great
  const hitRadius = species.id === 'malayan-water-monitor' ? 1.25 : 0.85;
  const hitMat = bag.mat(new THREE.MeshBasicMaterial({ visible: false }));
  const hitMesh = new THREE.Mesh(bag.geo(new THREE.SphereGeometry(hitRadius, 10, 8)), hitMat);
  hitMesh.position.set(0, species.perchHeight + species.inspectTargetY, 0);
  hitMesh.userData.creatureId = species.id;
  worldGroup.add(hitMesh);

  let isDiscovered = false;
  let isHighlighted = false;

  const setDiscoveredVisual = (discovered: boolean) => {
    isDiscovered = discovered;
    haloMat.color.set(discovered ? '#40916c' : '#e8d27c');
    haloMat.opacity = discovered ? 0.22 : baseHaloOpacity;
  };

  const setHighlighted = (highlighted: boolean) => {
    isHighlighted = highlighted;
    if (highlighted) {
      haloMat.color.set('#f7f6f2');
      haloMat.opacity = 0.88;
    } else {
      setDiscoveredVisual(isDiscovered);
    }
  };

  const update = (elapsed: number, delta: number) => {
    creatureAnim(elapsed, delta);
    if (!isDiscovered || isHighlighted) {
      const scale = isHighlighted ? 1.15 : 1 + Math.sin(elapsed * 2.2) * 0.07;
      haloMesh.scale.setScalar(scale);
    }
  };

  return {
    species,
    worldGroup,
    creatureGroup,
    hitMesh,
    haloMesh,
    update,
    setDiscoveredVisual,
    setHighlighted,
    dispose: () => bag.dispose(),
  };
}
