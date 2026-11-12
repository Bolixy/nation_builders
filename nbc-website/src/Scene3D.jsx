import { useEffect, useRef } from "react";
import * as THREE from "three";

const PALETTE = [0x1f5fff, 0x1f5fff, 0x2563ff, 0x4cc9ff, 0x0d2a8a, 0xffffff, 0xffb703];

// 3D background: floating bricks (builders), rising bars (business), sound waves (speaking).
export default function Scene3D() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 700;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the site simply shows the plain dark background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07090f, 14, 38);
    const cam = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.z = 14;
    scene.add(new THREE.AmbientLight(0x6688ff, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 8, 6);
    scene.add(sun);
    const glow = new THREE.PointLight(0x4cc9ff, 40, 45);
    glow.position.set(-6, -2, 6);
    scene.add(glow);

    // ---- Bricks (builders)
    const N = small ? 26 : 56;
    const brickGeo = new THREE.BoxGeometry(2, 0.8, 1);
    const brickMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25 });
    const bricks = new THREE.InstancedMesh(brickGeo, brickMat, N);
    const c = new THREE.Color();
    const data = [];
    for (let i = 0; i < N; i++) {
      data.push({
        x: (Math.random() - 0.5) * 34, y: (Math.random() - 0.5) * 26, z: -14 + Math.random() * 16,
        rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
        s: 0.5 + Math.random() * 1.1, sp: 0.2 + Math.random() * 0.5, ph: Math.random() * 6.28,
      });
      bricks.setColorAt(i, c.setHex(PALETTE[(Math.random() * PALETTE.length) | 0]));
    }
    bricks.instanceColor.needsUpdate = true;
    scene.add(bricks);
    const o = new THREE.Object3D();

    // ---- Rig that follows the camera so bars and waves stay in view while scrolling
    const rig = new THREE.Group();
    scene.add(rig);

    // Business: rising bars
    const bars = new THREE.Group();
    bars.position.set(small ? 4.5 : 10, small ? -6 : -5, -3);
    bars.rotation.y = -0.5;
    const barMat = [0xffb703, 0x2ee6a6, 0x4cc9ff, 0xffb703, 0x2ee6a6].map(
      (col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.3, metalness: 0.3 })
    );
    const barGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
    const barMeshes = barMat.map((m, i) => {
      const b = new THREE.Mesh(barGeo, m);
      b.position.x = i * 1.1;
      bars.add(b);
      return b;
    });
    rig.add(bars);

    // Speaking: glowing mic core with expanding sound waves
    const wave = new THREE.Group();
    wave.position.set(small ? -4.5 : -10, small ? 5 : 3, -4);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 0.9 })
    );
    wave.add(core);
    const ringGeo = new THREE.RingGeometry(1, 1.06, 64);
    const rings = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x4cc9ff, transparent: true, side: THREE.DoubleSide })
      );
      wave.add(m);
      return m;
    });
    rig.add(wave);

    // ---- Interaction
    let mx = 0, my = 0, prog = 0;
    const onMove = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
    const onScroll = () => {
      prog = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reduce) draw(0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    function draw(t) {
      data.forEach((b, i) => {
        o.position.set(b.x + Math.sin(t * b.sp + b.ph) * 0.8, b.y + Math.cos(t * b.sp * 1.1 + b.ph) * 1.1, b.z);
        o.rotation.set(b.rx + t * b.sp * 0.4, b.ry + t * b.sp * 0.5, b.rz);
        o.scale.setScalar(b.s);
        o.updateMatrix();
        bricks.setMatrixAt(i, o.matrix);
      });
      bricks.instanceMatrix.needsUpdate = true;

      barMeshes.forEach((b, i) => {
        const h = 1 + i * 0.9 + Math.sin(t * 1.2 + i) * 0.35;
        b.scale.y = h;
        b.position.y = h / 2;
      });
      rings.forEach((r, i) => {
        const ph = (t * 0.5 + i / 3) % 1;
        r.scale.setScalar(1 + ph * 7);
        r.material.opacity = (1 - ph) * 0.8;
      });
      core.scale.setScalar(1 + Math.sin(t * 4) * 0.12);

      const targetY = -prog * 9 - my * 0.8;
      cam.position.x += (mx * 2 - cam.position.x) * 0.04;
      cam.position.y += (targetY - cam.position.y) * 0.05;
      cam.lookAt(0, cam.position.y * 0.9, 0);
      rig.position.y = cam.position.y;
      renderer.render(scene, cam);
    }

    let raf;
    const t0 = performance.now();
    if (reduce) {
      draw(0);
    } else {
      const loop = (now) => { draw((now - t0) / 1000); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      [brickGeo, barGeo, ringGeo, core.geometry].forEach((g) => g.dispose());
      [brickMat, core.material, ...barMat, ...rings.map((r) => r.material)].forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="bg3d" ref={host} aria-hidden="true" />;
}
