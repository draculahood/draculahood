"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/config/assets";
import { BRAND } from "@/config/brand";
import { screech } from "@/components/castle/sound";

/*
 * The castle hall behind the home page: a long stone gallery with red carpet, arches, candle sconces, portraits of
 * the count's guests and bats under the ceiling. Scrolling walks the camera down the hall; the count (the owner's figure on a billboard)
 * floats ahead, on the side opposite the open card (data-side on each section). The hall is generated in code; the only
 * downloaded texture is the figure. Without WebGL the page shows a flat background and the count's portrait instead.
 */

const HISSES = ["Hssss!", "Begone", "Supper time", "Sign my book", "I see you"];

export function CastleWorld() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const depth = useRef<HTMLElement>(null);
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    let stop = false;
    let cleanup = () => {};
    (async () => {
      try {
        const THREE = await import("three");
        const el = canvas.current;
        if (!el || stop) return;
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, powerPreference: "high-performance" });
        let alive = true;
        el.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          alive = false;
          setFlat(true);
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
        renderer.setSize(innerWidth, innerHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        const scene = new THREE.Scene();
        const FOG = 0x050907;
        scene.background = new THREE.Color(FOG);
        scene.fog = new THREE.FogExp2(FOG, 0.068);
        const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 120);

        // Hall size: width, height, start and end along z.
        const W = 6.4, H = 5, Z0 = 10, Z1 = -120, L = Z0 - Z1, WALK = 106, zMid = (Z0 + Z1) / 2;

        let seed = 11;
        const rnd = () => ((seed = (seed * 48271) % 2147483647) - 1) / 2147483646;
        const canvasTex = (c: HTMLCanvasElement, rx: number, ry: number) => {
          const t = new THREE.CanvasTexture(c);
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(rx, ry);
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 4;
          return t;
        };
        const paint = (w: number, h: number, fn: (x: CanvasRenderingContext2D) => void) => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          fn(c.getContext("2d")!);
          return c;
        };

        // Large grey-green ashlar blocks with moss and damp streaks.
        const stone = paint(512, 512, (x) => {
          x.fillStyle = "#0b100d";
          x.fillRect(0, 0, 512, 512);
          const rowH = 56;
          for (let r = 0; r * rowH < 512; r++) {
            let px = -(r % 2) * 64;
            while (px < 512) {
              const bw = 96 + rnd() * 60;
              x.fillStyle = `hsl(${130 + rnd() * 25},${6 + rnd() * 7}%,${15 + rnd() * 13}%)`;
              x.fillRect(px + 4, r * rowH + 4, bw - 8, rowH - 8);
              for (let k = 0; k < 8; k++) {
                x.fillStyle = `rgba(0,0,0,${rnd() * 0.22})`;
                x.fillRect(px + 4 + rnd() * bw, r * rowH + 4 + rnd() * rowH, rnd() * 18, rnd() * 5);
              }
              px += bw;
            }
          }
          for (let i = 0; i < 30; i++) {
            const gx = rnd() * 512, gy = rnd() * 512, gr = 14 + rnd() * 46;
            const g = x.createRadialGradient(gx, gy, 0, gx, gy, gr);
            g.addColorStop(0, "rgba(70,120,80,.3)");
            g.addColorStop(1, "rgba(70,120,80,0)");
            x.fillStyle = g;
            x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
          }
          for (let i = 0; i < 12; i++) {
            const g = x.createLinearGradient(0, 0, 0, 512);
            g.addColorStop(0, "rgba(0,0,0,.55)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            x.fillStyle = g;
            x.fillRect(rnd() * 512, 0, 2 + rnd() * 5, 180 + rnd() * 300);
          }
        });
        // Flagstone floor with a long red runner down the middle.
        const floor = paint(512, 512, (x) => {
          x.fillStyle = "#0a0c0b";
          x.fillRect(0, 0, 512, 512);
          for (let r = 0; r < 8; r++)
            for (let c = 0; c < 4; c++) {
              x.fillStyle = `hsl(${120 + rnd() * 30},${4 + rnd() * 5}%,${10 + rnd() * 8}%)`;
              x.fillRect(c * 128 + 3 + (r % 2) * 20, r * 64 + 3, 122, 58);
            }
          x.fillStyle = "#4a0c16";
          x.fillRect(150, 0, 212, 512);
          x.fillStyle = "#6e1424";
          x.fillRect(162, 0, 188, 512);
          x.fillStyle = "rgba(255,180,107,.35)";
          x.fillRect(172, 0, 4, 512);
          x.fillRect(336, 0, 4, 512);
          for (let i = 0; i < 40; i++) {
            x.fillStyle = `rgba(0,0,0,${0.1 + rnd() * 0.2})`;
            x.fillRect(162 + rnd() * 188, rnd() * 512, rnd() * 30, 2);
          }
        });
        const ceiling = paint(256, 256, (x) => {
          x.fillStyle = "#060807";
          x.fillRect(0, 0, 256, 256);
          for (let i = 0; i < 260; i++) {
            x.fillStyle = `rgba(${20 + rnd() * 30},${30 + rnd() * 30},${20 + rnd() * 20},${rnd() * 0.15})`;
            x.fillRect(rnd() * 256, rnd() * 256, rnd() * 26, rnd() * 26);
          }
        });
        const stoneT = canvasTex(stone, L / 6, H / 6);
        const floorT = canvasTex(floor, 1, L / 7);
        const ceilT = canvasTex(ceiling, 2, L / 4);

        const wallMat = new THREE.MeshStandardMaterial({ map: stoneT, bumpMap: stoneT, bumpScale: 0.05, roughness: 0.95 });
        const wallGeo = new THREE.PlaneGeometry(L, H);
        const left = new THREE.Mesh(wallGeo, wallMat);
        left.rotation.y = Math.PI / 2;
        left.position.set(-W / 2, H / 2, zMid);
        const right = new THREE.Mesh(wallGeo, wallMat);
        right.rotation.y = -Math.PI / 2;
        right.position.set(W / 2, H / 2, zMid);
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, L), new THREE.MeshStandardMaterial({ map: floorT, bumpMap: floorT, bumpScale: 0.02, roughness: 0.8 }));
        fl.rotation.x = -Math.PI / 2;
        fl.position.set(0, 0, zMid);
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, L), new THREE.MeshStandardMaterial({ map: ceilT, roughness: 1 }));
        ce.rotation.x = Math.PI / 2;
        ce.position.set(0, H, zMid);
        scene.add(left, right, fl, ce);

        // Pointed stone arches every 9 units: two pillars and a pointed top made of two tilted beams.
        const archMat = new THREE.MeshStandardMaterial({ color: 0x1c221f, roughness: 0.9 });
        const pillar = new THREE.BoxGeometry(0.5, H, 0.5);
        const beam = new THREE.BoxGeometry(W * 0.56, 0.4, 0.5);
        for (let z = 3; z > Z1 + 3; z -= 9) {
          const a = new THREE.Mesh(pillar, archMat);
          a.position.set(-W / 2 + 0.25, H / 2, z);
          const b = new THREE.Mesh(pillar, archMat);
          b.position.set(W / 2 - 0.25, H / 2, z);
          const l = new THREE.Mesh(beam, archMat);
          l.position.set(-W * 0.24, H - 0.42, z);
          l.rotation.z = 0.22;
          const r = new THREE.Mesh(beam, archMat);
          r.position.set(W * 0.24, H - 0.42, z);
          r.rotation.z = -0.22;
          scene.add(a, b, l, r);
        }

        // Candle sconces with flickering warm light, alternating sides.
        const lights: { pl: InstanceType<typeof THREE.PointLight>; flame: InstanceType<typeof THREE.Mesh>; ph: number }[] = [];
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffc27a });
        const waxMat = new THREE.MeshStandardMaterial({ color: 0xd9cfc0, roughness: 0.6 });
        const ironMat = new THREE.MeshStandardMaterial({ color: 0x24221f, metalness: 0.7, roughness: 0.45 });
        let side = 1;
        for (let z = -1; z > Z1 + 6; z -= 11) {
          const x = side * (W / 2 - 0.2);
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12), ironMat);
          plate.position.set(x - side * 0.1, 2.7, z);
          const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 10), waxMat);
          wax.position.set(x - side * 0.1, 2.88, z);
          const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), flameMat);
          flame.scale.y = 1.8;
          flame.position.set(x - side * 0.1, 3.1, z);
          const pl = new THREE.PointLight(0xff9a4d, 10, 12, 1.8);
          pl.position.set(x - side * 0.45, 3.1, z);
          scene.add(plate, wax, flame, pl);
          lights.push({ pl, flame, ph: rnd() * 100 });
          side *= -1;
        }
        scene.add(new THREE.HemisphereLight(0x2a4a38, 0x060302, 0.55));

        // Portraits of the count's guests: pale faces with red eyes, labels in typewriter type.
        const labels = ["GUEST NO. 01", BRAND.symbol, "SIGNED IN 1897", "STILL AWAKE", "SEE THE LEDGER", "NEVER LEFT"];
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a2a15, roughness: 0.5, metalness: 0.45 });
        for (let i = 0; i < 9; i++) {
          const z = -5 - i * 12.8 + (i % 2 ? 6 : 0);
          const s = i % 2 ? -1 : 1;
          const pic = paint(256, 330, (x) => {
            const g = x.createLinearGradient(0, 0, 0, 330);
            g.addColorStop(0, i % 3 === 0 ? "#2a0f15" : "#18221d");
            g.addColorStop(1, "#060807");
            x.fillStyle = g;
            x.fillRect(0, 0, 256, 330);
            x.fillStyle = "#0b0b0b";
            x.beginPath();
            x.moveTo(40, 330);
            x.quadraticCurveTo(60, 230, 128, 220);
            x.quadraticCurveTo(196, 230, 216, 330);
            x.fill();
            x.fillStyle = "rgba(225,232,226,.9)";
            x.beginPath();
            x.ellipse(128, 150, 50, 64, 0, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = "#0d0f10";
            x.beginPath();
            x.moveTo(76, 140);
            x.quadraticCurveTo(80, 82, 128, 80);
            x.quadraticCurveTo(176, 82, 180, 140);
            x.lineTo(150, 108);
            x.lineTo(128, 132);
            x.lineTo(106, 108);
            x.closePath();
            x.fill();
            x.fillStyle = "#c2364a";
            x.beginPath();
            x.arc(108, 156, 6, 0, 7);
            x.arc(148, 156, 6, 0, 7);
            x.fill();
            x.fillStyle = "#fff";
            x.beginPath();
            x.moveTo(116, 192);
            x.lineTo(120, 204);
            x.lineTo(124, 192);
            x.moveTo(132, 192);
            x.lineTo(136, 204);
            x.lineTo(140, 192);
            x.fill();
            x.fillStyle = "rgba(168,255,196,.75)";
            x.font = '20px "Courier New", monospace';
            x.textAlign = "center";
            x.fillText(labels[i % labels.length], 128, 312);
          });
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.98, 1.58), frameMat);
          frame.position.set(s * (W / 2 - 0.05), 2.25, z);
          const t = new THREE.CanvasTexture(pic);
          t.colorSpace = THREE.SRGBColorSpace;
          const p = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 1.7), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: 0x1a0d10, emissiveIntensity: 0.3 }));
          p.rotation.y = -s * (Math.PI / 2);
          p.position.set(s * (W / 2 - 0.1), 2.25, z);
          scene.add(frame, p);
        }

        // Words painted on the stones in old blood (drawn once the fonts are ready).
        const writeOnWall = (txt: string, x: number, z: number, s: number) => {
          const c = paint(1024, 256, (g) => {
            g.font = '112px "Creepster", var(--font-creepster), fantasy';
            g.fillStyle = "rgba(170,30,48,.85)";
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.fillText(txt, 512, 120);
            for (let i = 0; i < 12; i++) g.fillRect(170 + rnd() * 680, 160, 3, 30 + rnd() * 70);
          });
          const t = new THREE.CanvasTexture(c);
          t.colorSpace = THREE.SRGBColorSpace;
          const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 1, depthWrite: false }));
          m.rotation.y = -s * (Math.PI / 2);
          m.position.set(x, 1.2, z);
          scene.add(m);
        };
        document.fonts?.ready.then(() => {
          writeOnWall("THE NIGHT NEVER ENDS", -W / 2 + 0.04, -33, 1);
          writeOnWall("SIGN THE BOOK", W / 2 - 0.04, -61, -1);
          writeOnWall(BRAND.symbol, -W / 2 + 0.04, -90, 1);
        });

        // A pale glow behind the far door.
        const glow = paint(256, 256, (x) => {
          const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
          g.addColorStop(0, "rgba(220,255,230,1)");
          g.addColorStop(0.3, "rgba(130,255,180,.55)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          x.fillStyle = g;
          x.fillRect(0, 0, 256, 256);
        });
        const glowTex = new THREE.CanvasTexture(glow);
        const door = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        door.position.set(0, 2.3, Z1 + 0.5);
        const endWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
        endWall.position.set(0, H / 2, Z1);
        const endLight = new THREE.PointLight(0x9dffb8, 24, 22, 1.6);
        endLight.position.set(0, 2.4, Z1 + 3);
        scene.add(door, endWall, endLight);

        // Drifting dust.
        const NP = 1200;
        const pg = new THREE.BufferGeometry();
        const pp = new Float32Array(NP * 3);
        const pv = new Float32Array(NP);
        for (let i = 0; i < NP; i++) {
          pp[i * 3] = (Math.random() - 0.5) * W * 0.95;
          pp[i * 3 + 1] = Math.random() * H;
          pp[i * 3 + 2] = Z0 - Math.random() * L;
          pv[i] = 0.04 + Math.random() * 0.14;
        }
        pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
        const dot = paint(32, 32, (x) => {
          const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
          g.addColorStop(0, "rgba(255,255,255,1)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          x.fillStyle = g;
          x.fillRect(0, 0, 32, 32);
        });
        scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.05, map: new THREE.CanvasTexture(dot), color: 0xd8ffe4, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false })));

        // Bats circling under the ceiling: two flapping wing planes each.
        const batMat = new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.DoubleSide });
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.quadraticCurveTo(0.12, 0.14, 0.32, 0.08);
        wingShape.lineTo(0.26, 0.02);
        wingShape.lineTo(0.2, -0.04);
        wingShape.lineTo(0.12, 0.0);
        wingShape.lineTo(0, -0.05);
        const wingGeo = new THREE.ShapeGeometry(wingShape);
        const bats: { g: InstanceType<typeof THREE.Group>; l: InstanceType<typeof THREE.Mesh>; r: InstanceType<typeof THREE.Mesh>; ph: number; rad: number; z: number }[] = [];
        for (let i = 0; i < 14; i++) {
          const g = new THREE.Group();
          const l = new THREE.Mesh(wingGeo, batMat);
          const r = new THREE.Mesh(wingGeo, batMat);
          r.scale.x = -1;
          g.add(l, r, new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), batMat));
          scene.add(g);
          bats.push({ g, l, r, ph: Math.random() * 10, rad: 0.8 + Math.random() * 1.6, z: Z0 - 8 - Math.random() * (L - 16) });
        }

        // ---------- the count ----------
        const count = new THREE.Group();
        const holder = new THREE.Group();
        count.add(holder);
        scene.add(count);
        // The owner's figure (public/brand/figure.webp, transparent) as a billboard; the hall's lights do not tint it.
        const figureTex = new THREE.TextureLoader().load(ASSETS.figure.src);
        figureTex.colorSpace = THREE.SRGBColorSpace;
        figureTex.anisotropy = 4;
        const FIG_H = 2.7;
        const figure = new THREE.Mesh(
          new THREE.PlaneGeometry(FIG_H * (ASSETS.figure.w / ASSETS.figure.h), FIG_H),
          new THREE.MeshBasicMaterial({ map: figureTex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide, toneMapped: false, fog: false, depthTest: false, depthWrite: false }),
        );
        figure.position.y = -0.2;
        figure.renderOrder = 10;
        holder.add(figure);
        const halo = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }));
        halo.position.z = -0.9;
        count.add(halo);
        const countLight = new THREE.PointLight(0xa8ffc4, 6, 7, 1.6);
        scene.add(countLight);
        holder.scale.setScalar(0.01);
        let appear = 0;

        // ---------- scroll, pointer, tap ----------
        const sections = () => [...document.querySelectorAll<HTMLElement>("main section[data-side]")];
        let camZ = 4;
        let countX = 1.3;
        let fitY = innerWidth < 820 ? 3.3 : 2.0;
        let fitS = innerWidth < 820 ? 0.88 : 1;
        const hero = document.querySelector<HTMLElement>(".dh-hero");
        const nav = document.querySelector<HTMLElement>(".dh-nav");
        const mouse = { x: 0, y: 0 };
        let mobile = innerWidth < 820;
        const sideFor = () => {
          if (mobile) return 0;
          const mid = scrollY + innerHeight / 2;
          let best = 1.3;
          for (const s of sections()) if (s.offsetTop <= mid) best = parseFloat(s.dataset.side || "0");
          return best;
        };
        const onMove = (e: PointerEvent) => {
          mouse.x = (e.clientX / innerWidth) * 2 - 1;
          mouse.y = -((e.clientY / innerHeight) * 2 - 1);
        };
        const onResize = () => {
          mobile = innerWidth < 820;
          camera.aspect = innerWidth / innerHeight;
          camera.fov = mobile ? 72 : 62;
          camera.updateProjectionMatrix();
          renderer.setSize(innerWidth, innerHeight, false);
        };
        onResize();
        const ray = new THREE.Raycaster();
        let spin = 0;
        const onClick = (e: MouseEvent) => {
          ray.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)), camera);
          if (!ray.intersectObject(holder, true).length) return;
          spin = Math.PI * 2;
          screech();
          const w = document.createElement("div");
          w.className = "dh-hiss";
          w.textContent = HISSES[Math.floor(Math.random() * HISSES.length)];
          w.style.left = `${e.clientX}px`;
          w.style.top = `${e.clientY - 30}px`;
          document.body.appendChild(w);
          setTimeout(() => w.remove(), 1700);
        };
        addEventListener("pointermove", onMove);
        addEventListener("resize", onResize);
        el.addEventListener("click", onClick);

        const clock = new THREE.Clock();
        let dim = 7 + Math.random() * 8;
        let raf = 0;
        let ry = 0;
        const frame = () => {
          if (!alive || stop) return;
          const dt = Math.min(clock.getDelta(), 0.05);
          const t = clock.elapsedTime;
          const max = document.documentElement.scrollHeight - innerHeight;
          const p = max > 0 ? scrollY / max : 0;
          camZ += (4 - p * WALK - camZ) * Math.min(1, dt * 3.2);
          const bob = reduce ? 0 : Math.sin(t * 1.5) * 0.03;
          camera.position.set(mouse.x * 0.35, 1.75 + bob + mouse.y * 0.15, camZ);
          camera.lookAt(mouse.x * 0.6, 1.9 + mouse.y * 0.25, camZ - 6);
          if (depth.current) depth.current.textContent = String(Math.max(0, Math.round(4 - camZ))).padStart(3, "0");

          countX += (sideFor() - countX) * Math.min(1, dt * 2);
          const dist = mobile ? 5.6 : 4.6;
          const cz = camZ - dist;
          // On phones the hero text fills the lower screen: while it is in view, fit the figure into the band between
          // the top bar and the first line of the hero, so the two never overlap.
          let goalY = mobile ? 3.3 : 2.0;
          let goalS = mobile ? 0.88 : 1;
          if (mobile && hero) {
            const top = hero.getBoundingClientRect().top;
            if (top > 0) {
              const ppu = innerHeight / (2 * dist * Math.tan((camera.fov * Math.PI) / 360));
              const bandTop = (nav?.getBoundingClientRect().bottom ?? 74) + 16;
              const bandBot = top - 16 - 16; // gap + room for the bob
              const fit = Math.min(0.88, (bandBot - bandTop) / (FIG_H * ppu));
              // Too little room on a very short screen: keep him out of the text until the visitor scrolls.
              goalS = fit < 0.3 ? 0.01 : fit;
              const centrePx = (bandTop + bandBot) / 2;
              const sightY = camera.position.y + (1.9 + mouse.y * 0.25 - camera.position.y) * (dist / 6);
              goalY = sightY + (innerHeight / 2 - centrePx) / ppu + 0.2 * goalS;
            }
          }
          fitY += (goalY - fitY) * Math.min(1, dt * 4);
          fitS += (goalS - fitS) * Math.min(1, dt * 4);
          count.position.set(countX + (reduce ? 0 : Math.sin(t * 0.7) * 0.15), fitY + (reduce ? 0 : Math.sin(t * 1.25) * 0.15), cz);
          appear = Math.min(1, appear + dt * 0.6);
          holder.scale.setScalar(Math.max(0.01, fitS * (1 - Math.pow(1 - appear, 3))));
          spin -= spin * Math.min(1, dt * 2.6);
          ry += (mouse.x * 0.5 - countX * 0.16 + (reduce ? 0 : Math.sin(t * 0.5) * 0.16) - ry) * Math.min(1, dt * 3);
          // A flat figure: keep the turn small so it never reads edge-on (a tap still spins it once).
          holder.rotation.y = ry * 0.45 + spin;
          holder.rotation.x += (-mouse.y * 0.14 - holder.rotation.x) * Math.min(1, dt * 3);
          holder.rotation.z = reduce ? 0 : Math.sin(t * 0.9) * 0.05;
          (halo.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = 0.15 + Math.sin(t * 2) * 0.05;
          countLight.position.set(count.position.x, count.position.y + 0.3, count.position.z + 1.4);

          let surge = 1;
          if (!reduce) {
            dim -= dt;
            if (dim < 0) {
              if (dim < -0.5) dim = 8 + Math.random() * 12;
              surge = Math.random() < 0.5 ? 0.1 : 1.35;
            }
          }
          for (const c of lights) {
            const f = reduce ? 1 : (0.78 + 0.14 * Math.sin(t * 9 + c.ph) + 0.08 * Math.sin(t * 23 + c.ph * 2)) * (Math.random() < 0.004 ? 0.2 : 1);
            c.pl.intensity = 10 * f * surge;
            c.flame.scale.set(0.85 + f * 0.2, 1.8 * f, 0.85 + f * 0.2);
          }
          countLight.intensity = 6 * (surge > 1 ? 1.6 : 1);

          for (const b of bats) {
            const a = t * 0.6 + b.ph;
            b.g.position.set(Math.cos(a) * b.rad, H - 0.6 + Math.sin(a * 2) * 0.25, b.z + Math.sin(a) * b.rad);
            b.g.rotation.y = -a;
            const w = reduce ? 0.3 : Math.sin(t * 14 + b.ph) * 0.7;
            b.l.rotation.y = w;
            b.r.rotation.y = -w;
          }

          if (!reduce) {
            const arr = pg.attributes.position.array as Float32Array;
            for (let i = 0; i < NP; i++) {
              arr[i * 3 + 1] += pv[i] * dt * 0.6;
              arr[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.04;
              if (arr[i * 3 + 1] > H) arr[i * 3 + 1] = 0;
            }
            pg.attributes.position.needsUpdate = true;
          }
          renderer.render(scene, camera);
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        cleanup = () => {
          cancelAnimationFrame(raf);
          removeEventListener("pointermove", onMove);
          removeEventListener("resize", onResize);
          el.removeEventListener("click", onClick);
          renderer.dispose();
        };
      } catch {
        if (!stop) setFlat(true);
      }
    })();
    return () => {
      stop = true;
      cleanup();
    };
  }, []);

  return (
    <>
      {flat ? (
        <>
          <div className="dh-flat" aria-hidden="true" />
          <img className="dh-flat-count" src={ASSETS.count.src} alt="" width={ASSETS.count.w} height={ASSETS.count.h} />
        </>
      ) : (
        <canvas ref={canvas} className="dh-world" aria-hidden="true" data-testid="world" />
      )}
      <div className="dh-vignette" aria-hidden="true" />
      <Grain />
      {flat ? null : (
        <div className="dh-hud" aria-hidden="true">
          Hall <b ref={depth}>000</b> m
        </div>
      )}
    </>
  );
}

/** Film grain from a small random canvas, made once in the browser. */
export function Grain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 160;
    const x = c.getContext("2d");
    if (!x || !ref.current) return;
    const img = x.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    ref.current.style.backgroundImage = `url(${c.toDataURL()})`;
  }, []);
  return <div ref={ref} className="dh-grain" aria-hidden="true" />;
}
