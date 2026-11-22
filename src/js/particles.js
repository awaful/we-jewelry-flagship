/**
 * PARTICLES & COSMIC ORBIT CONTROLLER (Spec 10: B-3...B-8)
 * The ONLY canvas on the entire site (WebGL).
 * 60,000 particles with custom ShaderMaterial morphing:
 * Ring (-25° Z, 55° X) -> Cloud -> Radiant Core -> Cloud -> Crescent
 * Two intertwined wireframe triangles rotating every 3.5s
 * Pinned across 450vh scrub
 */

export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const section = document.getElementById('particles-section');

  if (!canvas || !section || typeof window.THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 20000 : 60000;

  // 1. WebGL Renderer (No alpha, no antialias, max perf)
  const renderer = new window.THREE.WebGLRenderer({
    canvas: canvas,
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x05060A, 1.0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.0));
  renderer.setSize(section.clientWidth, section.clientHeight);

  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(45, section.clientWidth / section.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  // 2. Build Wireframe Triangles
  const triangleGeom1 = new window.THREE.BufferGeometry();
  const v1 = new Float32Array([
    0, 1.1, 0,
    -0.95, -0.6, 0,
    0.95, -0.6, 0,
    0, 1.1, 0
  ]);
  triangleGeom1.setAttribute('position', new window.THREE.BufferAttribute(v1, 3));

  const triangleMat = new window.THREE.LineBasicMaterial({
    color: 0xF7E7A9,
    transparent: true,
    opacity: 0.8,
    linewidth: 1
  });

  const triangle1 = new window.THREE.LineLoop(triangleGeom1, triangleMat);
  const triangle2 = new window.THREE.LineLoop(triangleGeom1, triangleMat);
  triangle2.rotation.z = Math.PI; // Intertwined
  triangle2.position.z = 0.05;

  const trianglesGroup = new window.THREE.Group();
  trianglesGroup.add(triangle1);
  trianglesGroup.add(triangle2);
  scene.add(trianglesGroup);

  // 3. Occluding Dark Disc for Crescent Phase (Radius 1.6)
  const discGeom = new window.THREE.CircleGeometry(1.6, 48);
  const discMat = new window.THREE.MeshBasicMaterial({ color: 0x05060A });
  const occludingDisc = new window.THREE.Mesh(discGeom, discMat);
  occludingDisc.position.set(0.6, 0, 0.2);
  occludingDisc.visible = false;
  scene.add(occludingDisc);

  // 4. Attribute Arrays for Morph Targets
  const aRing = new Float32Array(particleCount * 3);
  const aCloud = new Float32Array(particleCount * 3);
  const aCore = new Float32Array(particleCount * 3);
  const aCrescent = new Float32Array(particleCount * 3);
  const aRand = new Float32Array(particleCount * 4);

  const tiltZ = -25 * (Math.PI / 180);
  const tiltX = 55 * (Math.PI / 180);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    // Random seeds
    aRand[i4] = Math.random();
    aRand[i4 + 1] = Math.random();
    aRand[i4 + 2] = Math.random();
    aRand[i4 + 3] = Math.random();

    // TARGET 0: Ring (a = 3.8, b = 1.9, tilted -25° Z, 55° X, 3x dense zone)
    let theta = (i / particleCount) * Math.PI * 2;
    if (Math.random() < 0.4) {
      theta = (Math.random() * 0.8 - 0.4); // 3x dense cluster
    }
    const sigma = (Math.random() - 0.5) * 0.12;
    let rx = (3.8 + sigma) * Math.cos(theta);
    let ry = (1.9 + sigma) * Math.sin(theta);
    let rz = (Math.random() - 0.5) * 0.1;

    // Apply tilt X then Z
    let ty = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
    let tz = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
    let tx = rx * Math.cos(tiltZ) - ty * Math.sin(tiltZ);
    ty = rx * Math.sin(tiltZ) + ty * Math.cos(tiltZ);

    aRing[i3] = tx;
    aRing[i3 + 1] = ty;
    aRing[i3 + 2] = tz;

    // TARGET 1: Cloud (Gaussian sphere radius ≈3)
    const u = Math.random();
    const v = Math.random();
    const phi = Math.acos(2 * v - 1);
    const lam = 2 * Math.PI * u;
    const rad = 2.8 * Math.pow(Math.random(), 0.5);

    aCloud[i3] = rad * Math.sin(phi) * Math.cos(lam);
    aCloud[i3 + 1] = rad * Math.sin(phi) * Math.sin(lam);
    aCloud[i3 + 2] = rad * Math.cos(phi);

    // TARGET 2: Core (Dense radius 0.35 + radial rays)
    const isRay = Math.random() < 0.25;
    const cRad = isRay ? (0.35 + Math.random() * 2.2) : (Math.random() * 0.35);
    aCore[i3] = cRad * Math.sin(phi) * Math.cos(lam);
    aCore[i3 + 1] = cRad * Math.sin(phi) * Math.sin(lam);
    aCore[i3 + 2] = cRad * Math.cos(phi);

    // TARGET 3: Crescent (Right limb of occluding disc)
    const cAng = (Math.random() - 0.5) * Math.PI * 0.9;
    const crRad = 1.62 + Math.random() * 0.25;
    aCrescent[i3] = 0.6 + crRad * Math.cos(cAng);
    aCrescent[i3 + 1] = crRad * Math.sin(cAng);
    aCrescent[i3 + 2] = (Math.random() - 0.5) * 0.2;
  }

  const pGeom = new window.THREE.BufferGeometry();
  pGeom.setAttribute('position', new window.THREE.BufferAttribute(new Float32Array(aRing), 3));
  pGeom.setAttribute('aRing', new window.THREE.BufferAttribute(aRing, 3));
  pGeom.setAttribute('aCloud', new window.THREE.BufferAttribute(aCloud, 3));
  pGeom.setAttribute('aCore', new window.THREE.BufferAttribute(aCore, 3));
  pGeom.setAttribute('aCrescent', new window.THREE.BufferAttribute(aCrescent, 3));
  pGeom.setAttribute('aRand', new window.THREE.BufferAttribute(aRand, 4));

  // 5. Custom Vertex & Fragment Shader with smoothstep morphing
  const vertexShader = `
    uniform float uStage;
    uniform float uTime;
    attribute vec3 aRing;
    attribute vec3 aCloud;
    attribute vec3 aCore;
    attribute vec3 aCrescent;
    attribute vec4 aRand;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      vec3 pos = aRing;
      float stageProg = clamp(uStage, 0.0, 4.0);

      // Morph transitions: 0->1 (Ring->Cloud), 1->2 (Cloud->Core), 2->3 (Core->Cloud), 3->4 (Cloud->Crescent)
      if (stageProg <= 1.0) {
        float f = smoothstep(0.0, 1.0, stageProg);
        pos = mix(aRing, aCloud, f);
      } else if (stageProg <= 2.0) {
        float f = smoothstep(1.0, 2.0, stageProg);
        pos = mix(aCloud, aCore, f);
      } else if (stageProg <= 3.0) {
        float f = smoothstep(2.0, 3.0, stageProg);
        pos = mix(aCore, aCloud, f);
      } else {
        float f = smoothstep(3.0, 4.0, stageProg);
        pos = mix(aCloud, aCrescent, f);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Depth attenuation & twinkle
      float twinkle = 0.75 + 0.25 * sin(uTime * aRand.z * 3.0 + aRand.x * 6.283);
      gl_PointSize = (2.2 * twinkle / -mvPosition.z) * 1.5;

      vAlpha = twinkle * clamp((10.0 / -mvPosition.z), 0.3, 1.0);

      // Mix Gold -> Gold-soft with 8% cool white
      vec3 gold = vec3(0.83, 0.68, 0.21);
      vec3 goldSoft = vec3(0.97, 0.90, 0.66);
      vec3 coolWhite = vec3(0.92, 0.95, 1.0);

      if (aRand.w < 0.08) {
        vColor = coolWhite;
      } else {
        vColor = mix(gold, goldSoft, aRand.y);
      }

      // Intensify core
      if (stageProg >= 1.8 && stageProg <= 2.2) {
        vColor *= 2.2;
      }
    }
  `;

  const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      // Soft radial point with smoothstep
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      float circle = 1.0 - smoothstep(0.1, 0.5, dist);

      if (circle < 0.01) discard;

      gl_FragColor = vec4(vColor, vAlpha * circle * 0.85);
    }
  `;

  const uniforms = {
    uStage: { value: 0.0 },
    uTime: { value: 0.0 }
  };

  const pMaterial = new window.THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    transparent: true,
    blending: window.THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new window.THREE.Points(pGeom, pMaterial);
  scene.add(particles);

  // 6. Master Loop & Scrubbing across 450vh (Spec B-3...B-8)
  if (window.ScrollTrigger && window.gsap) {
    const scrubTl = window.gsap.timeline({
      scrollTrigger: {
        trigger: '#particles-section',
        start: 'top top',
        end: '+=450vh',
        pin: true,
        scrub: true
      }
    });

    scrubTl
      // 0.30 - 0.38: Title fades out, uStage 0 -> 1 (Ring -> Cloud)
      .to('.particles-h2', { opacity: 0, filter: 'blur(8px)', duration: 0.08, ease: 'none' }, 0.30)
      .to(uniforms.uStage, { value: 1.0, duration: 0.08, ease: 'expo.inOut' }, 0.30)

      // 0.38 - 0.46: uStage 1 -> 2 (Cloud -> Core), triangles scale to 0
      .to(uniforms.uStage, { value: 2.0, duration: 0.08, ease: 'expo.inOut' }, 0.38)
      .to(trianglesGroup.scale, { x: 0, y: 0, z: 0, duration: 0.08, ease: 'power2.in' }, 0.38)

      // 0.46 - 0.70: Core rest. Four disciplines text enters with word mask
      .to('.four-disciplines-center', { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.46)
      .to('.particles-side-flanks', { opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.48)
      .to('.four-disciplines-center', { opacity: 0, duration: 0.08, ease: 'power2.in' }, 0.65)
      .to('.particles-side-flanks', { opacity: 0, duration: 0.08, ease: 'power2.in' }, 0.65)

      // 0.70 - 0.80: uStage 2 -> 3 (explosion to cloud)
      .to(uniforms.uStage, { value: 3.0, duration: 0.10, ease: 'expo.out' }, 0.70)

      // 0.80 - 0.88: uStage 3 -> 4 (crescent)
      .call(() => { occludingDisc.visible = true; }, null, 0.80)
      .to(uniforms.uStage, { value: 4.0, duration: 0.08, ease: 'expo.out' }, 0.80);
  }

  // Animation Loop for Triangles & Precession
  let clock = new window.THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    uniforms.uTime.value = elapsed;

    // Precession rotation
    particles.rotation.z += 0.004;

    // Triangles continuous 3D rotation (full rotation every ≈3.5s)
    if (trianglesGroup.scale.x > 0.01) {
      trianglesGroup.rotation.y = elapsed * (Math.PI * 2 / 3.5);
      trianglesGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.2;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = section.clientWidth / section.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(section.clientWidth, section.clientHeight);
  });
}
