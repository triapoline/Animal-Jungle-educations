import * as THREE from 'three';

export interface ProceduralTextureSet {
  barkMap: THREE.CanvasTexture;
  barkBump: THREE.CanvasTexture;
  floorMap: THREE.CanvasTexture;
  floorBump: THREE.CanvasTexture;
  waterBump: THREE.CanvasTexture;
  leafMap: THREE.CanvasTexture;
  leafBump: THREE.CanvasTexture;
  pangolinMap: THREE.CanvasTexture;
  pangolinBump: THREE.CanvasTexture;
  butterflyWingMap: THREE.CanvasTexture;
  katydidWingMap: THREE.CanvasTexture;
  katydidWingBump: THREE.CanvasTexture;
  reptileScaleMap: THREE.CanvasTexture;
  reptileScaleBump: THREE.CanvasTexture;
  rottingLogMap: THREE.CanvasTexture;
  rottingLogBump: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function finishTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = anisotropy;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  } else {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

/** Seeded deterministic pseudo-random helper for crisp reproducible textures */
function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  const aniso = Math.min(maxAnisotropy, 8);
  const all: THREE.CanvasTexture[] = [];

  // 1. Tropical Dipterocarp Tree Bark (Albedo + Bump)
  const [barkC, bCtx] = makeCanvas(256, 256);
  const [barkBC, bbCtx] = makeCanvas(256, 256);
  {
    const rng = seededRng(101);
    bCtx.fillStyle = '#4e3e30';
    bCtx.fillRect(0, 0, 256, 256);
    bbCtx.fillStyle = '#808080';
    bbCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 160; i++) {
      const x = rng() * 256;
      const w = 3 + rng() * 10;
      const shade = Math.floor(48 + rng() * 44);
      bCtx.fillStyle = `rgb(${shade + 16}, ${shade + 5}, ${shade - 8})`;
      bCtx.fillRect(x, 0, w, 256);

      const bVal = Math.floor(80 + rng() * 110);
      bbCtx.fillStyle = `rgb(${bVal}, ${bVal}, ${bVal})`;
      bbCtx.fillRect(x, 0, w * 0.7, 256);
    }
    // Vertical bark fissures
    for (let i = 0; i < 90; i++) {
      const x = rng() * 256;
      const y = rng() * 256;
      const len = 30 + rng() * 90;
      bCtx.strokeStyle = 'rgba(26, 19, 14, 0.72)';
      bCtx.lineWidth = 1.2 + rng() * 2.4;
      bCtx.beginPath();
      bCtx.moveTo(x, y);
      bCtx.lineTo(x + (rng() - 0.5) * 6, y + len);
      bCtx.stroke();

      bbCtx.strokeStyle = 'rgba(20, 20, 20, 0.85)';
      bbCtx.lineWidth = 2;
      bbCtx.beginPath();
      bbCtx.moveTo(x, y);
      bbCtx.lineTo(x + (rng() - 0.5) * 6, y + len);
      bbCtx.stroke();
    }
    // Lichen and damp tropical moss patches
    for (let i = 0; i < 38; i++) {
      const x = rng() * 256;
      const y = rng() * 256;
      const r = 6 + rng() * 18;
      bCtx.fillStyle = rng() > 0.35 ? 'rgba(66, 98, 52, 0.42)' : 'rgba(148, 162, 134, 0.28)';
      bCtx.beginPath();
      bCtx.ellipse(x, y, r, r * 0.65, rng() * Math.PI, 0, Math.PI * 2);
      bCtx.fill();
    }
  }
  const barkMap = finishTexture(barkC, true, aniso, 2, 4);
  const barkBump = finishTexture(barkBC, false, aniso, 2, 4);
  all.push(barkMap, barkBump);

  // 2. Mossy Bukit Timah Rainforest Floor (Albedo + Bump)
  const [floorC, fCtx] = makeCanvas(512, 512);
  const [floorBC, fbCtx] = makeCanvas(512, 512);
  {
    const rng = seededRng(202);
    fCtx.fillStyle = '#3d4c2d';
    fCtx.fillRect(0, 0, 512, 512);
    fbCtx.fillStyle = '#787878';
    fbCtx.fillRect(0, 0, 512, 512);

    // Rich humus & emerald moss patches
    for (let i = 0; i < 240; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      const r = 14 + rng() * 44;
      const pick = rng();
      fCtx.fillStyle =
        pick < 0.45
          ? 'rgba(54, 78, 38, 0.45)'
          : pick < 0.78
            ? 'rgba(74, 58, 38, 0.4)'
            : 'rgba(84, 114, 52, 0.35)';
      fCtx.beginPath();
      fCtx.arc(x, y, r, 0, Math.PI * 2);
      fCtx.fill();

      const bv = Math.floor(90 + rng() * 75);
      fbCtx.fillStyle = `rgba(${bv},${bv},${bv},0.35)`;
      fbCtx.beginPath();
      fbCtx.arc(x, y, r * 0.8, 0, Math.PI * 2);
      fbCtx.fill();
    }
    // Fallen dried dipterocarp leaves & forest grit
    for (let i = 0; i < 420; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      const rx = 3 + rng() * 7;
      const ry = 1.6 + rng() * 3.5;
      const ang = rng() * Math.PI;
      const tone = rng();
      fCtx.fillStyle =
        tone < 0.5
          ? 'rgba(116, 82, 46, 0.72)'
          : tone < 0.8
            ? 'rgba(138, 102, 54, 0.65)'
            : 'rgba(62, 92, 42, 0.65)';
      fCtx.beginPath();
      fCtx.ellipse(x, y, rx, ry, ang, 0, Math.PI * 2);
      fCtx.fill();

      fbCtx.fillStyle = 'rgba(205, 205, 205, 0.45)';
      fbCtx.beginPath();
      fbCtx.ellipse(x, y, rx, ry, ang, 0, Math.PI * 2);
      fbCtx.fill();
    }
  }
  const floorMap = finishTexture(floorC, true, aniso, 14, 14);
  const floorBump = finishTexture(floorBC, false, aniso, 14, 14);
  all.push(floorMap, floorBump);

  // 3. Rippling Pond Water Bump Map
  const [waterBC, wbCtx] = makeCanvas(256, 256);
  {
    wbCtx.fillStyle = '#808080';
    wbCtx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 2) {
      for (let x = 0; x < 256; x += 2) {
        const u = (x / 256) * Math.PI * 2;
        const v = (y / 256) * Math.PI * 2;
        const wave =
          Math.sin(u * 4 + Math.cos(v * 3)) * 0.45 +
          Math.cos(v * 6 - u * 2) * 0.35 +
          Math.sin((u + v) * 8) * 0.2;
        const val = Math.floor(128 + wave * 95);
        wbCtx.fillStyle = `rgb(${val},${val},${val})`;
        wbCtx.fillRect(x, y, 2, 2);
      }
    }
  }
  const waterBump = finishTexture(waterBC, false, aniso, 4, 4);
  all.push(waterBump);

  // 4. Tropical Leaf with Veins (Albedo + Bump)
  const [leafC, lCtx] = makeCanvas(256, 256);
  const [leafBC, lbCtx] = makeCanvas(256, 256);
  {
    const grad = lCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#3e7c3a');
    grad.addColorStop(0.5, '#2f6b32');
    grad.addColorStop(1, '#225228');
    lCtx.fillStyle = grad;
    lCtx.fillRect(0, 0, 256, 256);

    lbCtx.fillStyle = '#808080';
    lbCtx.fillRect(0, 0, 256, 256);

    // Midrib
    lCtx.strokeStyle = '#6da652';
    lCtx.lineWidth = 4;
    lCtx.beginPath();
    lCtx.moveTo(128, 0);
    lCtx.lineTo(128, 256);
    lCtx.stroke();

    lbCtx.strokeStyle = '#e5e5e5';
    lbCtx.lineWidth = 5;
    lbCtx.beginPath();
    lbCtx.moveTo(128, 0);
    lbCtx.lineTo(128, 256);
    lbCtx.stroke();

    // Pinnate veins
    lCtx.lineWidth = 1.8;
    lbCtx.lineWidth = 2.2;
    for (let y = 18; y < 250; y += 20) {
      lCtx.strokeStyle = 'rgba(128, 178, 92, 0.7)';
      lCtx.beginPath();
      lCtx.moveTo(128, y);
      lCtx.quadraticCurveTo(78, y - 10, 12, y - 28);
      lCtx.moveTo(128, y);
      lCtx.quadraticCurveTo(178, y - 10, 244, y - 28);
      lCtx.stroke();

      lbCtx.strokeStyle = 'rgba(220, 220, 220, 0.75)';
      lbCtx.beginPath();
      lbCtx.moveTo(128, y);
      lbCtx.quadraticCurveTo(78, y - 10, 12, y - 28);
      lbCtx.moveTo(128, y);
      lbCtx.quadraticCurveTo(178, y - 10, 244, y - 28);
      lbCtx.stroke();
    }
  }
  const leafMap = finishTexture(leafC, true, aniso);
  const leafBump = finishTexture(leafBC, false, aniso);
  all.push(leafMap, leafBump);

  // 5. Overlapping Keratin Pangolin Scales (Albedo + Bump)
  const [pangC, pCtx] = makeCanvas(256, 256);
  const [pangBC, pbCtx] = makeCanvas(256, 256);
  {
    pCtx.fillStyle = '#4c3828';
    pCtx.fillRect(0, 0, 256, 256);
    pbCtx.fillStyle = '#383838';
    pbCtx.fillRect(0, 0, 256, 256);

    const rows = 9;
    const cols = 7;
    const stepY = 256 / rows;
    const stepX = 256 / cols;

    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        const cx = (c + (r % 2 === 0 ? 0 : 0.5)) * stepX;
        const cy = r * stepY;

        const g = pCtx.createLinearGradient(cx, cy - stepY * 0.5, cx, cy + stepY * 0.9);
        g.addColorStop(0, '#5a412c');
        g.addColorStop(0.55, '#866647');
        g.addColorStop(1, '#a9875e');
        pCtx.fillStyle = g;
        pCtx.strokeStyle = '#2d1f14';
        pCtx.lineWidth = 2;

        pCtx.beginPath();
        pCtx.moveTo(cx - stepX * 0.52, cy - stepY * 0.2);
        pCtx.quadraticCurveTo(cx, cy + stepY * 1.1, cx + stepX * 0.52, cy - stepY * 0.2);
        pCtx.lineTo(cx, cy - stepY * 0.55);
        pCtx.closePath();
        pCtx.fill();
        pCtx.stroke();

        // Bump height
        const bg = pbCtx.createLinearGradient(cx, cy - stepY * 0.4, cx, cy + stepY * 0.9);
        bg.addColorStop(0, '#555555');
        bg.addColorStop(0.75, '#dadada');
        bg.addColorStop(1, '#ffffff');
        pbCtx.fillStyle = bg;
        pbCtx.strokeStyle = '#141414';
        pbCtx.lineWidth = 2.4;
        pbCtx.beginPath();
        pbCtx.moveTo(cx - stepX * 0.52, cy - stepY * 0.2);
        pbCtx.quadraticCurveTo(cx, cy + stepY * 1.1, cx + stepX * 0.52, cy - stepY * 0.2);
        pbCtx.lineTo(cx, cy - stepY * 0.55);
        pbCtx.closePath();
        pbCtx.fill();
        pbCtx.stroke();
      }
    }
  }
  const pangolinMap = finishTexture(pangC, true, aniso, 2, 2);
  const pangolinBump = finishTexture(pangBC, false, aniso, 2, 2);
  all.push(pangolinMap, pangolinBump);

  // 6. Common Rose Butterfly Wing Pattern (Velvet Black + Cream Rays + Crimson Rose Spots)
  const [buttC, btCtx] = makeCanvas(256, 256);
  {
    btCtx.fillStyle = '#151417';
    btCtx.fillRect(0, 0, 256, 256);

    // Delicate dark-charcoal venation & pale cream streaks on forewing area
    for (let i = 0; i < 6; i++) {
      btCtx.strokeStyle = 'rgba(232, 224, 206, 0.72)';
      btCtx.lineWidth = 6 - i * 0.5;
      btCtx.beginPath();
      btCtx.moveTo(28, 92 + i * 10);
      btCtx.quadraticCurveTo(130, 52 + i * 18, 228, 34 + i * 26);
      btCtx.stroke();
    }

    // Vibrant white central patch (characteristic of Pachliopta aristolochiae hindwing)
    btCtx.fillStyle = '#f4f0e4';
    for (let i = 0; i < 4; i++) {
      btCtx.beginPath();
      btCtx.ellipse(94 + i * 18, 178 + (i % 2) * 8, 14, 24, -0.35 + i * 0.16, 0, Math.PI * 2);
      btCtx.fill();
    }

    // Crimson rose submarginal spots
    btCtx.fillStyle = '#d92848';
    const spots = [
      [182, 165],
      [204, 194],
      [178, 220],
      [140, 232],
      [100, 228],
    ];
    for (const [sx, sy] of spots) {
      btCtx.beginPath();
      btCtx.ellipse(sx, sy, 14, 10, 0.3, 0, Math.PI * 2);
      btCtx.fill();
    }

    // Crisp black vein lines across entire wing
    btCtx.strokeStyle = '#0d0c0f';
    btCtx.lineWidth = 2.4;
    for (let a = -0.6; a <= 1.2; a += 0.22) {
      btCtx.beginPath();
      btCtx.moveTo(10, 128);
      btCtx.lineTo(10 + Math.cos(a) * 260, 128 + Math.sin(a) * 260);
      btCtx.stroke();
    }
  }
  const butterflyWingMap = finishTexture(buttC, true, aniso);
  all.push(butterflyWingMap);

  // 7. Leaf-Mimic Katydid Veined Forewing (Albedo + Bump)
  const [katC, kCtx] = makeCanvas(256, 256);
  const [katBC, kbCtx] = makeCanvas(256, 256);
  {
    const g = kCtx.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, '#5a943c');
    g.addColorStop(0.55, '#468232');
    g.addColorStop(1, '#366828');
    kCtx.fillStyle = g;
    kCtx.fillRect(0, 0, 256, 256);

    kbCtx.fillStyle = '#808080';
    kbCtx.fillRect(0, 0, 256, 256);

    // Central leaf midrib
    kCtx.strokeStyle = '#8ec262';
    kCtx.lineWidth = 4;
    kCtx.beginPath();
    kCtx.moveTo(0, 128);
    kCtx.lineTo(256, 128);
    kCtx.stroke();

    kbCtx.strokeStyle = '#f0f0f0';
    kbCtx.lineWidth = 5;
    kbCtx.beginPath();
    kbCtx.moveTo(0, 128);
    kbCtx.lineTo(256, 128);
    kbCtx.stroke();

    // Branching veins + cryptic brown fungal blemish spots
    for (let x = 22; x < 245; x += 24) {
      kCtx.strokeStyle = 'rgba(148, 196, 102, 0.72)';
      kCtx.lineWidth = 1.6;
      kCtx.beginPath();
      kCtx.moveTo(x, 128);
      kCtx.quadraticCurveTo(x + 22, 82, x + 52, 24);
      kCtx.moveTo(x, 128);
      kCtx.quadraticCurveTo(x + 22, 174, x + 52, 232);
      kCtx.stroke();

      kbCtx.strokeStyle = 'rgba(220,220,220,0.8)';
      kbCtx.lineWidth = 2;
      kbCtx.beginPath();
      kbCtx.moveTo(x, 128);
      kbCtx.quadraticCurveTo(x + 22, 82, x + 52, 24);
      kbCtx.moveTo(x, 128);
      kbCtx.quadraticCurveTo(x + 22, 174, x + 52, 232);
      kbCtx.stroke();
    }

    // Naturalistic brown weather spots
    const blemishes = [
      [148, 86, 8],
      [182, 162, 6],
      [92, 152, 5],
    ];
    for (const [bx, by, br] of blemishes) {
      kCtx.fillStyle = 'rgba(122, 88, 44, 0.78)';
      kCtx.beginPath();
      kCtx.arc(bx, by, br, 0, Math.PI * 2);
      kCtx.fill();
    }
  }
  const katydidWingMap = finishTexture(katC, true, aniso);
  const katydidWingBump = finishTexture(katBC, false, aniso);
  all.push(katydidWingMap, katydidWingBump);

  // 8. Reptile Patterned Scales (Water Monitor & Draco)
  const [repC, rCtx] = makeCanvas(256, 256);
  const [repBC, rbCtx] = makeCanvas(256, 256);
  {
    const rng = seededRng(808);
    rCtx.fillStyle = '#333a2c';
    rCtx.fillRect(0, 0, 256, 256);
    rbCtx.fillStyle = '#505050';
    rbCtx.fillRect(0, 0, 256, 256);

    // Fine pebbled reptilian scales
    for (let y = 0; y < 256; y += 10) {
      for (let x = 0; x < 256; x += 10) {
        const ox = (y / 10) % 2 === 0 ? 0 : 5;
        const v = Math.floor(42 + rng() * 26);
        rCtx.fillStyle = `rgb(${v + 4}, ${v + 12}, ${v - 2})`;
        rCtx.beginPath();
        rCtx.arc(x + ox, y, 4.3, 0, Math.PI * 2);
        rCtx.fill();

        rbCtx.fillStyle = '#d4d4d4';
        rbCtx.beginPath();
        rbCtx.arc(x + ox, y, 3.8, 0, Math.PI * 2);
        rbCtx.fill();
      }
    }
    // Characteristic golden-cream ocelli rings of Malayan Water Monitor
    for (let y = 26; y < 240; y += 46) {
      for (let x = 24; x < 240; x += 48) {
        rCtx.strokeStyle = 'rgba(218, 198, 114, 0.78)';
        rCtx.lineWidth = 3.2;
        rCtx.beginPath();
        rCtx.arc(x + ((y / 46) % 2) * 18, y, 8, 0, Math.PI * 2);
        rCtx.stroke();
      }
    }
  }
  const reptileScaleMap = finishTexture(repC, true, aniso, 2, 2);
  const reptileScaleBump = finishTexture(repBC, false, aniso, 2, 2);
  all.push(reptileScaleMap, reptileScaleBump);

  // 9. Rotting Mossy Log
  const [logC, lgCtx] = makeCanvas(256, 256);
  const [logBC, lgbCtx] = makeCanvas(256, 256);
  {
    const rng = seededRng(909);
    lgCtx.fillStyle = '#473322';
    lgCtx.fillRect(0, 0, 256, 256);
    lgbCtx.fillStyle = '#707070';
    lgbCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 120; i++) {
      const y = rng() * 256;
      const h = 2 + rng() * 6;
      const d = Math.floor(42 + rng() * 38);
      lgCtx.fillStyle = `rgb(${d + 22}, ${d + 6}, ${d - 10})`;
      lgCtx.fillRect(0, y, 256, h);

      const bv = Math.floor(60 + rng() * 140);
      lgbCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      lgbCtx.fillRect(0, y, 256, h);
    }
    // Thick emerald moss blanket along upper surface
    for (let i = 0; i < 45; i++) {
      lgCtx.fillStyle = 'rgba(64, 108, 46, 0.55)';
      lgCtx.beginPath();
      lgCtx.ellipse(rng() * 256, rng() * 110, 12 + rng() * 26, 6 + rng() * 14, 0, 0, Math.PI * 2);
      lgCtx.fill();
    }
  }
  const rottingLogMap = finishTexture(logC, true, aniso, 2, 1);
  const rottingLogBump = finishTexture(logBC, false, aniso, 2, 1);
  all.push(rottingLogMap, rottingLogBump);

  // 10. Soft Radial Contact Shadow Decal
  const [shadC, sCtx] = makeCanvas(128, 128);
  {
    const g = sCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
    g.addColorStop(0, 'rgba(12, 20, 14, 0.62)');
    g.addColorStop(0.55, 'rgba(12, 20, 14, 0.28)');
    g.addColorStop(1, 'rgba(12, 20, 14, 0)');
    sCtx.fillStyle = g;
    sCtx.fillRect(0, 0, 128, 128);
  }
  const contactShadowMap = finishTexture(shadC, true, 1);
  contactShadowMap.wrapS = THREE.ClampToEdgeWrapping;
  contactShadowMap.wrapT = THREE.ClampToEdgeWrapping;
  all.push(contactShadowMap);

  return {
    barkMap,
    barkBump,
    floorMap,
    floorBump,
    waterBump,
    leafMap,
    leafBump,
    pangolinMap,
    pangolinBump,
    butterflyWingMap,
    katydidWingMap,
    katydidWingBump,
    reptileScaleMap,
    reptileScaleBump,
    rottingLogMap,
    rottingLogBump,
    contactShadowMap,
    dispose: () => {
      all.forEach((tex) => tex.dispose());
    },
  };
}
