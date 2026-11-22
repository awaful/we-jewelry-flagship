/**
 * AGRUMEA FARM / STUDIO K95 AWWWARDS SOTD — 3D MARQUEE ENGINE
 * Replicated using hyperbolic tangent spacing distortion, 10° tilted track,
 * simulated depth-of-field, critically damped spring physics, and inertial tilt.
 */

document.addEventListener('DOMContentLoaded', () => {

  const products = [
    {
      title: "Confettura Extra di Fragole e Bacche Goji",
      subtitle: "Confettura Extra Artigianale",
      desc: "Coltivate nei terreni vulcanici della Sicilia, le nostre fragole vengono raccolte a mano al perfetto grado di maturazione e cotte lentamente a bassa temperatura per preservare intatti sapore, profumo e principi nutritivi.",
      format: "VASO VETRO 240g",
      origin: "100% SICILIA (ITALIA)"
    },
    {
      title: "Marmellata di Arance a fette Bio",
      subtitle: "Agrumi di Sicilia Biologici",
      desc: "Fette sottili di arance siciliane biologiche selezionate, cotte con la scorza per una consistenza rustica e un aroma inconfondibile di zagara e sole siciliano.",
      format: "VASO VETRO 240g",
      origin: "100% SICILIA BIO"
    },
    {
      title: "Caponata Siciliana Sinfonia Barocca",
      subtitle: "Ricetta Tradizionale Iblea",
      desc: "Melanzane fresche, sedano croccante, capperi di Pantelleria e olive nocellara in un perfetto equilibrio agrodolce secondo l'antica ricetta barocca.",
      format: "VASO VETRO 280g",
      origin: "100% SICILIA (ITALIA)"
    },
    {
      title: "Pesto Rosso Ibleo",
      subtitle: "Pomodori Secchi e Mandorle",
      desc: "Pomodori essiccati al sole dell'Etna, mandorle di Avola tostate e basilico fresco macinati a pietra con olio extravergine d'oliva monti iblei.",
      format: "VASO VETRO 190g",
      origin: "100% SICILIA (ITALIA)"
    },
    {
      title: "Smeraldo Pesto di Pistacchio",
      subtitle: "Pistacchio di Sicilia Puro",
      desc: "Pregiati pistacchi siciliani tostati al punto giusto con una punta di sale marino e olio extravergine d'oliva, dalla grana rustica e sapore persistente.",
      format: "VASO VETRO 190g",
      origin: "100% SICILIA (ITALIA)"
    },
    {
      title: "Confettura Extra di Gelsi Neri",
      subtitle: "Gelsi Neri dell'Etna",
      desc: "Frutto antico e prezioso delle pendici etnee, dal colore rubino profondo e note balsamiche uniche.",
      format: "VASO VETRO 240g",
      origin: "100% SICILIA (ITALIA)"
    },
    {
      title: "Cipolla in Agrodolce Gourmet",
      subtitle: "Cipolle Giarratana Tradizionali",
      desc: "La dolcezza naturale della celebre cipolla di Giarratana esaltata da un caramellamento lento con aceto di vino e spezie aromatiche.",
      format: "VASO VETRO 280g",
      origin: "100% SICILIA (ITALIA)"
    }
  ];

  const items = document.querySelectorAll('.jar-item');
  const marquee = document.getElementById('jar-slider-marquee');
  const stampWrapper = document.getElementById('backdrop-stamp');
  const floatingCapsule = document.getElementById('floating-discover-capsule');
  const capsuleText = document.getElementById('capsule-text');
  const capsuleBtn = document.getElementById('capsule-btn');

  // Modal elements
  const drawer = document.getElementById('product-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');

  const N = items.length;
  let targetProgress = 0;
  let currentProgress = 0;
  let previousProgress = 0;
  let velocity = 0;
  let activeIndex = 0;

  let isDragging = false;
  let startX = 0;

  // Wheel interaction (horizontal and vertical wheel drive slider)
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetProgress += delta * 0.0016;
  }, { passive: true });

  // Drag interaction
  if (marquee) {
    marquee.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      targetProgress -= deltaX * 0.0035;
      startX = e.clientX;
    });

    marquee.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      targetProgress -= deltaX * 0.0035;
      startX = e.touches[0].clientX;
    }, { passive: true });
  }

  // Open drawer modal
  function openModal(idx) {
    const p = products[idx];
    modalTitle.textContent = p.title;
    modalSubtitle.textContent = p.subtitle;
    modalDesc.textContent = p.desc;
    drawer.classList.add('active');
  }

  if (capsuleBtn) {
    capsuleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(activeIndex);
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.classList.remove('active');
  });

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(item.getAttribute('data-index'), 10);
      if (idx === activeIndex) {
        openModal(idx);
      } else {
        // Snap this item to center
        targetProgress += (idx - activeIndex) * (1 / N);
      }
    });
  });

  // Animation Loop with Spring Physics
  let lastTime = performance.now();

  function render(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Critically damped exponential spring physics
    const friction = 12.0;
    currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-friction * dt));

    velocity = (currentProgress - previousProgress) / (dt || 0.016);
    previousProgress = currentProgress;

    // Rotate circular background vector stamp in sync
    if (stampWrapper) {
      stampWrapper.style.transform = `translate(-50%, -50%) rotate(${currentProgress * 80}deg)`;
    }

    const vw = window.innerWidth;
    const baseSpacing = Math.min(vw * 0.38, 480);

    let minOffset = Infinity;
    let closestIndex = 0;
    let centerJarX = 0;
    let centerJarY = 0;

    items.forEach((item, i) => {
      // Offset from center (-0.5 to +0.5 of circular domain)
      let offset = ((i / N) - currentProgress) % 1;
      if (offset > 0.5) offset -= 1;
      if (offset < -0.5) offset += 1;

      const absOffset = Math.abs(offset);
      if (absOffset < minOffset) {
        minOffset = absOffset;
        closestIndex = i;
      }

      // Exact Hyperbolic Tangent Spacing Distortion from Agrumea
      // Math.tanh creates the fish-eye focal expansion at center, compressing at edges
      const distortedOffset = Math.tanh(offset / 0.65) * 0.65;
      const x = distortedOffset * baseSpacing * 2.8;

      // Arc curvature in Y
      const y = Math.pow(distortedOffset, 2) * 80;

      // 3D Tilts matching video:
      // When at center: upright
      // When to the left: rolls right and tilts forward showing top lid in perspective!
      // When to the right: tilts symmetrically
      const rotY = -distortedOffset * 36;
      const rotX = Math.abs(distortedOffset) * 18; // tilts forward showing lid
      const rotZ = -distortedOffset * 14 + (velocity * 0.04); // dynamic inertial lean

      // Dynamic Scale & Depth of Field (DoF)
      const scale = Math.max(1.08 - Math.pow(absOffset, 1.2) * 0.65, 0.65);
      const blurPx = Math.min(Math.pow(absOffset * 2.5, 1.5) * 3.5, 4.5);
      const brightness = Math.max(1.0 - absOffset * 0.35, 0.72);
      const zIndex = Math.round((1 - absOffset) * 100);

      item.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      item.style.filter = blurPx > 0.3 ? `blur(${blurPx.toFixed(1)}px) brightness(${brightness.toFixed(2)})` : 'none';
      item.style.zIndex = zIndex;
      item.style.opacity = absOffset < 0.45 ? 1.0 : Math.max(0, 1 - (absOffset - 0.45) * 6);

      if (i === closestIndex) {
        // Track center position for floating discover pill
        // Compensating for 10-degree track rotation
        const angleRad = -10 * (Math.PI / 180);
        centerJarX = (window.innerWidth / 2) + (x * Math.cos(angleRad) - y * Math.sin(angleRad));
        centerJarY = (window.innerHeight / 2) + (x * Math.sin(angleRad) + y * Math.cos(angleRad));
      }
    });

    // Update active index and floating capsule badge
    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
    }

    if (floatingCapsule) {
      // Position capsule slightly above and to the left of the center jar
      const badgeX = centerJarX - 95;
      const badgeY = centerJarY - 145;
      floatingCapsule.style.transform = `translate(${badgeX}px, ${badgeY}px)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

});
