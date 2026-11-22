/**
 * WE JEWELRY & CO. — FLAGSHIP DIGITAL EXPERIENCE
 * Engineered based on reverse-engineered motion mechanics (Brewns + Helion)
 * Houston, TX · The Luminous Inc.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. AUDIO ATMOSPHERE (Gentle Web Audio Synthesizer for Luxury Haptics)
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playLuxuryChime(freq = 1200, duration = 0.4) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before gesture
    }
  }

  const soundToggle = document.getElementById('sound-toggle');
  const soundLabel = document.getElementById('sound-label');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundLabel.textContent = soundEnabled ? 'ATMOSPHERE: ON' : 'ATMOSPHERE: OFF';
      if (soundEnabled) {
        initAudio();
        playLuxuryChime(880, 0.3);
      }
    });
  }

  /* ==========================================================================
     2. HELION PRELOADER SYSTEM (Spec B-1, B-2, B-3)
     Tabular counter 000% -> 100%, progress line & volumetric sweep
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');

  let loadProgress = { val: 0 };
  gsap.to(loadProgress, {
    val: 100,
    duration: 1.4,
    ease: 'power2.inOut',
    onUpdate: () => {
      const p = Math.floor(loadProgress.val);
      if (counterEl) counterEl.textContent = `${String(p).padStart(3, '0')}%`;
      if (barEl) barEl.style.width = `${p}%`;
    },
    onComplete: () => {
      // Preloader exit
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          preloader.style.display = 'none';
          playLuxuryChime(520, 0.5);
          triggerHeroReveal();
        }
      });
    }
  });

  /* ==========================================================================
     3. LENIS SMOOTH INERTIAL SCROLL (Spec 3 & A-6)
     ========================================================================== */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      handleHeaderContrast(e.scroll);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Header Contrast Switch on Vault Curtain
  const siteHeader = document.getElementById('site-header');
  const vaultSection = document.getElementById('vault');

  function handleHeaderContrast(scrollPos) {
    if (!siteHeader || !vaultSection) return;
    const vaultTop = vaultSection.offsetTop - 80;
    const vaultBottom = vaultTop + vaultSection.offsetHeight - 40;

    if (scrollPos >= vaultTop && scrollPos < vaultBottom) {
      siteHeader.classList.add('header-light');
    } else {
      siteHeader.classList.remove('header-light');
    }
  }

  /* ==========================================================================
     4. THREE.JS SCENOGRAPHY: 3D CUBAN LINK & HELION PARTICLE ORBIT
     Combining Brewns (physical tactile 3D piece) & Helion (cosmic diamond dust)
     ========================================================================== */
  const container = document.getElementById('webgl-container');
  let scene, camera, renderer, jewelryGroup, particlesMesh;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const particleCount = 3200;
  let particlePositions, particleVelocities;

  // Materials dictionary for live cycling
  const materials = {
    yellowGold: new THREE.MeshStandardMaterial({
      color: 0xdeb841,
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 1.4,
    }),
    whiteGold: new THREE.MeshStandardMaterial({
      color: 0xe6e6ec,
      metalness: 0.98,
      roughness: 0.12,
      envMapIntensity: 1.8,
    }),
    roseGold: new THREE.MeshStandardMaterial({
      color: 0xe0977d,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.3,
    }),
    diamondFacet: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      ior: 2.417, // Real diamond refractive index
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
  };

  function initThree() {
    if (!container) return;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Volumetric luxury lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 2.8);
    keyLight.position.set(5, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 3.2);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const diamondSparkleLight = new THREE.PointLight(0xffffff, 2.0, 20);
    diamondSparkleLight.position.set(0, 3, 4);
    scene.add(diamondSparkleLight);

    // 5. Construct 3D Jewelry Centerpiece (Sculptural Miami Cuban Link & Diamond Core)
    jewelryGroup = new THREE.Group();
    // Position on the right side of the screen on desktop (Brewns layout spec)
    if (window.innerWidth > 992) {
      jewelryGroup.position.set(1.6, -0.1, 0);
    } else {
      jewelryGroup.position.set(0, 0.5, -1);
    }

    // Interlocking Cuban links
    const linkGeometry = new THREE.TorusGeometry(0.72, 0.22, 24, 60);
    const numLinks = 6;
    for (let i = 0; i < numLinks; i++) {
      const link = new THREE.Mesh(linkGeometry, materials.yellowGold);
      link.position.y = (i - (numLinks - 1) / 2) * 0.78;
      link.rotation.x = Math.PI / 4;
      link.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.75;
      link.scale.set(0.9, 0.9, 0.9);
      jewelryGroup.add(link);
    }

    // Central Bespoke Diamond Medallion
    const medallionCore = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 48);
    const medallion = new THREE.Mesh(medallionCore, materials.yellowGold);
    medallion.rotation.x = Math.PI / 2;
    medallion.position.set(0, 0, 0.4);
    jewelryGroup.add(medallion);

    // Faceted Iced Stones Ring on Medallion Perimeter
    const stoneCount = 28;
    const stoneRadius = 1.15;
    const stoneGeom = new THREE.IcosahedronGeometry(0.12, 1);
    for (let j = 0; j < stoneCount; j++) {
      const angle = (j / stoneCount) * Math.PI * 2;
      const stone = new THREE.Mesh(stoneGeom, materials.diamondFacet);
      stone.position.set(
        Math.cos(angle) * stoneRadius,
        Math.sin(angle) * stoneRadius,
        0.52
      );
      stone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      jewelryGroup.add(stone);
    }

    // Emblem Center Gem
    const centerGem = new THREE.OctahedronGeometry(0.5, 0);
    const gemMesh = new THREE.Mesh(centerGem, materials.diamondFacet);
    gemMesh.position.set(0, 0, 0.6);
    gemMesh.rotation.z = Math.PI / 4;
    jewelryGroup.add(gemMesh);

    scene.add(jewelryGroup);

    // 6. Helion Dynamic Particle Orbit System (Spec B-4)
    // Tilted elliptical orbit at -25 deg with 3,200 diamond dust particles
    const particleGeometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);
    particleVelocities = new Float32Array(particleCount);

    const orbitRadiusA = 3.6; // Major axis
    const orbitRadiusB = 2.4; // Minor axis
    const tiltAngle = -25 * (Math.PI / 180);

    for (let p = 0; p < particleCount; p++) {
      const theta = (p / particleCount) * Math.PI * 2 + (Math.random() * 0.1);
      const scatter = (Math.random() - 0.5) * 0.45;
      
      // Ellipse formula
      let x = (orbitRadiusA + scatter) * Math.cos(theta);
      let y = (orbitRadiusB + scatter) * Math.sin(theta);
      let z = (Math.random() - 0.5) * 0.8;

      // Apply -25 deg tilt
      const tiltedY = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
      const tiltedZ = y * Math.sin(tiltAngle) + z * Math.cos(tiltAngle);

      particlePositions[p * 3] = x + (jewelryGroup.position.x * 0.6);
      particlePositions[p * 3 + 1] = tiltedY;
      particlePositions[p * 3 + 2] = tiltedZ;

      particleVelocities[p] = 0.002 + Math.random() * 0.003;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Texture Generation (Soft Star Diamond Glint)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(244, 215, 120, 0.8)');
    grad.addColorStop(0.8, 'rgba(212, 175, 55, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    particlesMesh = new THREE.Points(particleGeometry, pMaterial);
    scene.add(particlesMesh);

    // Event Listeners for Interaction & Resize
    setupInteraction();
    window.addEventListener('resize', onWindowResize);

    // Start Animation Loop
    animate();
  }

  function setupInteraction() {
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Drag rotation on canvas
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !jewelryGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      jewelryGroup.rotation.y += deltaX * 0.008;
      jewelryGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !jewelryGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      jewelryGroup.rotation.y += deltaX * 0.008;
      jewelryGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
  }

  function onWindowResize() {
    if (!camera || !renderer || !container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Responsive positioning of jewelry
    if (jewelryGroup) {
      if (window.innerWidth > 992) {
        jewelryGroup.position.set(1.6, -0.1, 0);
      } else {
        jewelryGroup.position.set(0, 0.4, -1);
      }
    }
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Mouse Lerp for Tactile Parallax Tilt (Brewns Spec A-1)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    if (jewelryGroup) {
      if (!isDragging) {
        // Continuous slow idle rotation + subtle floating sine wave
        jewelryGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15 + (mouse.x * 0.4);
        jewelryGroup.rotation.x = Math.cos(elapsedTime * 0.4) * 0.1 + (-mouse.y * 0.3);
        jewelryGroup.position.y += (Math.sin(elapsedTime * 1.2) * 0.06 - (jewelryGroup.position.y - (window.innerWidth > 992 ? -0.1 : 0.4))) * 0.05;
      }
    }

    // 2. Helion Particle Orbit Precession (Spec B-4)
    if (particlesMesh && particlePositions) {
      particlesMesh.rotation.z += 0.0015;
      particlesMesh.rotation.y = Math.sin(elapsedTime * 0.3) * 0.08;
    }

    renderer.render(scene, camera);
  }

  initThree();

  /* ==========================================================================
     5. HERO ENTRANCE REVEAL (GSAP Staggered Split Typography)
     ========================================================================== */
  function triggerHeroReveal() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-kicker', {
      opacity: 0,
      y: 15,
      duration: 0.8
    })
    .from('.hero-line', {
      yPercent: 105,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power4.out'
    }, '-=0.5')
    .from('.hero-script', {
      opacity: 0,
      scale: 0.8,
      duration: 1.0,
      ease: 'back.out(1.7)'
    }, '-=0.7')
    .from('.hero-subtext', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-cta', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.6')
    .from('#floating-badge', {
      opacity: 0,
      x: 30,
      duration: 0.8
    }, '-=0.5')
    .from('.hero-bottom-bar > div', {
      opacity: 0,
      y: 15,
      stagger: 0.08,
      duration: 0.8
    }, '-=0.5');
  }

  /* ==========================================================================
     6. FLOATING PRODUCT BADGE CYCLER (Brewns A-3 Spec)
     Swaps between signature pieces, prices, and shifts 3D piece alloy
     ========================================================================== */
  const specimens = [
    {
      title: '8MM PAVE MIAMI CUBAN',
      karat: '14K SOLID',
      specs: 'Hand-Set AAA VVS Stones · Triple-Lock Box Clasp',
      price: '$1,850 USD',
      material: 'yellowGold'
    },
    {
      title: 'CUSTOM 3D BUST PENDANT',
      karat: 'VVS ICED OUT',
      specs: '3D CAD Sculpture · 4.80 TCW VVS1 Stones · Solid Bail',
      price: '$3,400 USD',
      material: 'whiteGold'
    },
    {
      title: 'DEEP CUT 6-PIECE GRILLZ',
      karat: '18K YELLOW',
      specs: 'Mirror Polish · Exact Dental Impression Fit',
      price: '$1,200 USD',
      material: 'roseGold'
    }
  ];

  let currentSpecimenIndex = 0;
  const badgeToggleBtn = document.getElementById('badge-toggle-btn');
  const badgeTitle = document.getElementById('badge-title');
  const badgeKarat = document.getElementById('badge-karat');
  const badgeSpecs = document.getElementById('badge-specs');
  const badgePrice = document.getElementById('badge-price');

  if (badgeToggleBtn) {
    badgeToggleBtn.addEventListener('click', () => {
      playLuxuryChime(1050, 0.25);
      currentSpecimenIndex = (currentSpecimenIndex + 1) % specimens.length;
      const s = specimens[currentSpecimenIndex];

      // Crossfade animation (Spec A-3)
      gsap.to('#floating-badge', {
        opacity: 0.4,
        duration: 0.15,
        onComplete: () => {
          badgeTitle.textContent = s.title;
          badgeKarat.textContent = s.karat;
          badgeSpecs.textContent = s.specs;
          badgePrice.textContent = s.price;

          // Swap 3D jewelry link material
          if (jewelryGroup) {
            jewelryGroup.children.forEach((child) => {
              if (child.geometry && child.geometry.type === 'TorusGeometry') {
                child.material = materials[s.material];
              }
            });
          }

          gsap.to('#floating-badge', {
            opacity: 1,
            duration: 0.2
          });
        }
      });
    });
  }

  /* ==========================================================================
     7. SCROLLTRIGGER PARALLAX & CURTAIN TRANSITIONS (Brewns A-4 to A-10)
     ========================================================================== */
  if (window.ScrollTrigger) {
    // A-4 & A-5: Hero Content Differential Exit Velocity (headline ascends at 1.3x)
    gsap.to('.hero-headline-wrapper', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      yPercent: -120,
      opacity: 0.1,
      ease: 'none'
    });

    gsap.to('#floating-badge', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '80% top',
        scrub: true
      },
      yPercent: -80,
      opacity: 0,
      ease: 'none'
    });

    // 3D Object Parallax Ascension
    if (jewelryGroup) {
      gsap.to(jewelryGroup.position, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 4.2,
        z: -2,
        ease: 'none'
      });
    }

    // A-7: Vault Cards Parallax & Velocity Stretches
    gsap.utils.toArray('.vault-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });

    // Bespoke Process Steps Reveal
    gsap.utils.toArray('.process-step').forEach((step, index) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.12,
        ease: 'power3.out'
      });
    });
  }

  /* ==========================================================================
     8. VIP INQUIRY DOSSIER DISPATCH TO WHATSAPP
     ========================================================================== */
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playLuxuryChime(1320, 0.35);

      const cat = document.getElementById('inquiry-cat').value;
      const metal = document.getElementById('inquiry-metal').value;
      const budget = document.getElementById('inquiry-budget').value || 'Open';
      const contact = document.getElementById('inquiry-contact').value;

      const message = `*WE JEWELRY & CO. // BESPOKE DOSSIER INQUIRY*\n` +
                      `· Category: ${cat}\n` +
                      `· Preferred Metal: ${metal}\n` +
                      `· Target Budget: ${budget}\n` +
                      `· Client Contact: ${contact}\n\n` +
                      `Submitted via Official Flagship Terminal (Houston, TX).`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/18326886688?text=${encoded}`, '_blank');
    });
  }
});
