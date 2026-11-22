/**
 * WE JEWELRY & CO. — 3D ORBITAL CAROUSEL
 * Architecture replicated from Awwwards Site of the Day (Agrumea Farm)
 * Five sculptural jewelry pieces on an interactive 3D circular ribbon
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. PRELOADER (Fast & Seamless 0.8s)
     ========================================================================= */
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');

  let prog = { val: 0 };
  if (window.gsap && preloader) {
    window.gsap.to(prog, {
      val: 100,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.floor(prog.val);
        if (counterEl) counterEl.textContent = `${v}%`;
        if (barEl) barEl.style.width = `${v}%`;
      },
      onComplete: () => {
        window.gsap.to(preloader, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            preloader.style.display = 'none';
          }
        });
      }
    });
  }

  /* =========================================================================
     2. PRODUCT CATALOG DATA
     ========================================================================= */
  const products = [
    {
      id: 0,
      title: "Miami Cuban Chain",
      subtitle: "8MM PAVE SETTING",
      category: "[01 / CHAINS]",
      desc: "Handcrafted 14K solid yellow gold interlocking Miami Cuban links, pavé-set with brilliant-cut VVS moissanite stones and secured with a triple-lock box clasp.",
      alloy: "14K SOLID YELLOW GOLD",
      stones: "VVS1 MOISSANITE / AAA",
      link: "https://wa.me/18326886688?text=I%20am%20interested%20in%20the%20Miami%20Cuban%20Chain"
    },
    {
      id: 1,
      title: "Bespoke Bust Pendant",
      subtitle: "3D CAD CUSTOM SCULPTURE",
      category: "[02 / PENDANTS]",
      desc: "Custom anatomical bust pendant engineered in 3D CAD, cast in solid white gold, and encrusted with 4.80 TCW handset round brilliant VVS diamonds.",
      alloy: "14K WHITE GOLD / PLATINUM",
      stones: "4.80 TCW VVS DIAMONDS",
      link: "https://wa.me/18326886688?text=I%20am%20interested%20in%20a%20Custom%20Bust%20Pendant"
    },
    {
      id: 2,
      title: "Deep Cut Dental Grillz",
      subtitle: "6-TOOTH MIRROR POLISH",
      category: "[03 / GRILLZ]",
      desc: "Tailored dental grillz fabricated from exact silicone impression molds in 18K yellow gold with deep-cut gum separations and high-specular mirror finish.",
      alloy: "18K SOLID GOLD",
      stones: "OPEN FACE / SOLID",
      link: "https://wa.me/18326886688?text=I%20am%20interested%20in%20Custom%20Dental%20Grillz"
    },
    {
      id: 3,
      title: "Luminous Timepiece",
      subtitle: "AUTOMATIC ICED BEZEL",
      category: "[04 / TIMEPIECES]",
      desc: "Signature Houston automatic timepiece featuring a dual-tier iced moissanite bezel, exhibition case back, and hand-finished stainless steel bracelet.",
      alloy: "316L STEEL & GOLD ACCENTS",
      stones: "MOISSANITE ICED BEZEL",
      link: "https://wa.me/18326886688?text=I%20am%20interested%20in%20the%20Luminous%20Timepiece"
    },
    {
      id: 4,
      title: "Baguette Master Ring",
      subtitle: "TWO-TONE PRONG SUITE",
      category: "[05 / RINGS]",
      desc: "Two-tone 14K yellow and white gold architectural signet ring channel-set with step-cut baguette stones and surrounded by a micropavé halo.",
      alloy: "14K TWO-TONE GOLD",
      stones: "STEP-CUT BAGUETTE VVS",
      link: "https://wa.me/18326886688?text=I%20am%20interested%20in%20the%20Baguette%20Master%20Ring"
    }
  ];

  /* =========================================================================
     3. THREE.JS 3D SCENOGRAPHY & JEWELRY MODELS
     ========================================================================= */
  const canvas = document.getElementById('carousel-canvas');
  const stage = document.getElementById('hero-stage');
  if (!canvas || !stage || typeof window.THREE === 'undefined') return;

  const width = stage.clientWidth;
  const height = stage.clientHeight;

  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.8);

  const renderer = new window.THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = window.THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  // Studio Lighting (Golden Key, Cool Rim, Diamond Specular)
  const ambient = new window.THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const keyLight = new window.THREE.DirectionalLight(0xfff0db, 3.2);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  const rimLight = new window.THREE.DirectionalLight(0xd4af37, 3.5);
  rimLight.position.set(-6, -2, -3);
  scene.add(rimLight);

  const fillLight = new window.THREE.DirectionalLight(0xffffff, 1.8);
  fillLight.position.set(0, -4, 4);
  scene.add(fillLight);

  // Materials
  const goldMaterial = new window.THREE.MeshStandardMaterial({
    color: 0xe5bf45,
    metalness: 0.95,
    roughness: 0.16,
  });

  const whiteGoldMaterial = new window.THREE.MeshStandardMaterial({
    color: 0xefeff5,
    metalness: 0.98,
    roughness: 0.12,
  });

  const diamondMaterial = new window.THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.85,
    ior: 2.417,
    reflectivity: 0.95,
    clearcoat: 1.0,
  });

  // Construct 5 Procedural Jewelry Sculptures
  const jewelryMeshes = [];

  // Piece 0: Miami Cuban Link Chain
  const cubanGroup = new window.THREE.Group();
  for (let k = -2; k <= 2; k++) {
    const link = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.55, 0.16, 24, 48), goldMaterial);
    link.position.y = k * 0.58;
    link.rotation.x = Math.PI / 4;
    link.rotation.y = (k % 2 === 0 ? 1 : -1) * 0.7;
    cubanGroup.add(link);
  }
  jewelryMeshes.push(cubanGroup);

  // Piece 1: Custom Bust Pendant
  const pendantGroup = new window.THREE.Group();
  const bail = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.3, 0.1, 16, 32), goldMaterial);
  bail.position.y = 1.1;
  pendantGroup.add(bail);

  const disc = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.9, 0.9, 0.15, 36), whiteGoldMaterial);
  disc.rotation.x = Math.PI / 2;
  pendantGroup.add(disc);

  const emblem = new window.THREE.Mesh(new window.THREE.OctahedronGeometry(0.45, 0), diamondMaterial);
  emblem.position.z = 0.25;
  pendantGroup.add(emblem);
  jewelryMeshes.push(pendantGroup);

  // Piece 2: Deep Cut Grillz
  const grillzGroup = new window.THREE.Group();
  for (let g = -2; g <= 2; g++) {
    const tooth = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.32, 0.75, 0.28), goldMaterial);
    tooth.position.x = g * 0.36;
    tooth.position.z = -Math.abs(g) * 0.08;
    tooth.rotation.y = -g * 0.12;
    grillzGroup.add(tooth);
  }
  jewelryMeshes.push(grillzGroup);

  // Piece 3: Luminous Timepiece
  const watchGroup = new window.THREE.Group();
  const caseMesh = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.95, 0.95, 0.2, 8), whiteGoldMaterial);
  caseMesh.rotation.x = Math.PI / 2;
  watchGroup.add(caseMesh);

  const bezel = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.85, 0.08, 16, 40), diamondMaterial);
  bezel.position.z = 0.12;
  watchGroup.add(bezel);

  const dialInner = new window.THREE.Mesh(new window.THREE.CircleGeometry(0.72, 32), new window.THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.8 }));
  dialInner.position.z = 0.13;
  watchGroup.add(dialInner);
  jewelryMeshes.push(watchGroup);

  // Piece 4: Baguette Master Ring
  const ringGroup = new window.THREE.Group();
  const band = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.75, 0.18, 24, 48), goldMaterial);
  ringGroup.add(band);

  const crown = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.65, 0.4, 0.4), whiteGoldMaterial);
  crown.position.y = 0.85;
  ringGroup.add(crown);

  const mainStone = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.45, 0.28, 0.25), diamondMaterial);
  mainStone.position.y = 1.05;
  ringGroup.add(mainStone);
  jewelryMeshes.push(ringGroup);

  // Add all to scene
  jewelryMeshes.forEach(mesh => scene.add(mesh));

  /* =========================================================================
     4. ORBITAL MATH & INTERACTION (The Agrumea Experience)
     ========================================================================= */
  const N = jewelryMeshes.length;
  let targetAngle = 0;
  let currentAngle = 0;
  let activeIndex = 0;

  let isDragging = false;
  let previousMouseX = 0;

  const Rx = 3.6; // Horizontal radius of circular orbital track
  const Rz = 2.4; // Depth radius

  // Scroll rotation via Wheel
  window.addEventListener('wheel', (e) => {
    targetAngle += e.deltaY * 0.0018;
  }, { passive: true });

  // Mouse & Touch Dragging
  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    targetAngle -= deltaX * 0.0045;
    previousMouseX = e.clientX;
  });

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    targetAngle -= deltaX * 0.0045;
    previousMouseX = e.touches[0].clientX;
  }, { passive: true });

  // DOM Elements to update
  const tooltip = document.getElementById('active-product-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipLink = document.getElementById('tooltip-link');
  const curvedSvg = document.querySelector('.curved-text-svg');

  // Drawer Elements
  const drawer = document.getElementById('detail-drawer');
  const drawerPanel = drawer.querySelector('.drawer-panel');
  const closeDrawer = document.getElementById('close-drawer');
  const drawerCat = document.getElementById('drawer-cat');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerDesc = document.getElementById('drawer-desc');
  const drawerMetal = document.getElementById('drawer-metal');
  const drawerStones = document.getElementById('drawer-stones');
  const drawerConsultBtn = document.getElementById('drawer-consult-btn');

  function openDrawerForIndex(idx) {
    const item = products[idx];
    drawerCat.textContent = item.category;
    drawerTitle.textContent = item.title;
    drawerDesc.textContent = item.desc;
    drawerMetal.textContent = item.alloy;
    drawerStones.textContent = item.stones;
    drawerConsultBtn.href = item.link;

    drawer.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.add('opacity-100');
    drawerPanel.classList.remove('translate-x-full');
  }

  function hideDrawer() {
    drawer.classList.add('opacity-0', 'pointer-events-none');
    drawer.classList.remove('opacity-100');
    drawerPanel.classList.add('translate-x-full');
  }

  if (tooltipLink) {
    tooltipLink.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawerForIndex(activeIndex);
    });
  }

  if (closeDrawer) {
    closeDrawer.addEventListener('click', hideDrawer);
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) hideDrawer();
  });

  /* =========================================================================
     5. RENDER LOOP WITH DYNAMIC CAROUSEL ORBIT
     ========================================================================= */
  let clock = new window.THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Smooth inertial lerp
    currentAngle += (targetAngle - currentAngle) * 0.08;

    // Rotate the background curved typography SVG in sync
    if (curvedSvg) {
      curvedSvg.style.transform = `rotate(${-currentAngle * 25}deg)`;
    }

    let minDiff = Infinity;
    let closestIndex = 0;

    // Position each piece along the 3D orbital track
    for (let i = 0; i < N; i++) {
      const mesh = jewelryMeshes[i];
      const baseTheta = (i / N) * Math.PI * 2;
      
      // Angle relative to center (0 rad is front and center)
      let diff = (baseTheta + currentAngle) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;

      // Track closest piece to center
      if (Math.abs(diff) < minDiff) {
        minDiff = Math.abs(diff);
        closestIndex = i;
      }

      // Orbital Position formula (Exact Agrumea Farm curved arc)
      const x = Math.sin(diff) * Rx;
      const z = Math.cos(diff) * Rz - Rz;
      const y = -0.15 + Math.cos(diff) * 0.25;

      mesh.position.set(x, y, z);

      // 3D Tilt and Rotation along the track:
      // In center: upright. To left: rolls left and shows top. To right: rolls right.
      mesh.rotation.y = -diff * 0.6 + Math.sin(elapsed * 0.5 + i) * 0.08;
      mesh.rotation.z = -diff * 0.35;
      mesh.rotation.x = 0.15 + Math.cos(elapsed * 0.4 + i) * 0.05;

      // Dynamic scale: larger in front, smaller in back
      const scaleFactor = 0.72 + (Math.cos(diff) * 0.5 + 0.5) * 0.42;
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Update active index and floating tooltip
    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      const p = products[activeIndex];
      if (tooltipTitle) {
        tooltipTitle.textContent = `${p.title.toUpperCase()} · DISCOVER`;
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth, stage.clientHeight);
  });

});
