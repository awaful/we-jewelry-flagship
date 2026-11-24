/**
 * CASH JEWELLERS — BESPOKE CUSTOM MADE JEWELLERY
 * 3D Marquee Kinetic Engine with Hyperbolic Spacing & Spring Physics
 */

document.addEventListener('DOMContentLoaded', () => {

  const products = [
    {
      title: "Bespoke Baguette Skeleton Watch",
      subtitle: "Custom Diamond Bezel • Automatic Movement • Fluted Case",
      desc: "Bespoke horological craftsmanship. Features an invisible-set baguette cut diamond bezel, diamond pavé dial with blued steel hands, exposed tourbillon window, and iced Presidential bracelet.",
      material: "SOLID 18K GOLD & 316L STEEL",
      stones: "STEP-CUT BAGUETTE DIAMONDS",
      ctaText: "TIMEPIECE CONSULTATION ↗"
    },
    {
      title: "18mm Miami Cuban Chain",
      subtitle: "Solid 14K Yellow Gold • Hand-Set VVS Diamond Pavé",
      desc: "The quintessential atelier signature. Cast in heavy solid 14-karat yellow gold with hand-filed flat-top links, handset with microscopic VVS diamond pavé across all link faces and finished with our bespoke dual-safety iced box clasp.",
      material: "SOLID 14K / 18K YELLOW GOLD",
      stones: "VVS COLORLESS DIAMONDS",
      ctaText: "COMMISSION PIECE — @CASH_JEWELLERS ↗"
    },
    {
      title: "Custom 3D Bust Diamond Pendant",
      subtitle: "Bespoke 3D Sculpted Gold • Multi-Tier Baguette Pavé",
      desc: "One-of-one custom sculpted medallion modeled in 3D CAD from client reference, featuring a high-relief Roman Emperor bust micro-set with over 1,400 round brilliant and tapered baguette diamonds on an iced-out custom bail.",
      material: "14K TWO-TONE YELLOW & WHITE GOLD",
      stones: "VVS BAGUETTES & ROUND MICRO-PAVÉ",
      ctaText: "START 3D CUSTOM COMMISSION ↗"
    },
    {
      title: "Custom Honeycomb Diamond Grillz",
      subtitle: "8-Top / 8-Bottom Precision Dental Fit • VVS Moissanite / Diamond",
      desc: "Custom impression-molded dental grillz featuring deep cut tooth separation and honeycomb micro-pavé setting. Hand-polished mirror gold finish for seamless, comfortable everyday wear.",
      material: "SOLID 10K / 14K GOLD OR 925 SILVER",
      stones: "VVS MOISSANITE / NATURAL DIAMOND",
      ctaText: "BOOK DENTAL IMPRESSION ↗"
    },
    {
      title: "Channel-Set Baguette Eternity Band",
      subtitle: "Step-Cut Baguette Diamonds • Solid Platinum & 14K White Gold",
      desc: "A continuous halo of precision step-cut baguette diamonds, individually calibrated and channel-set in heavy solid platinum for eternal brilliance, engraved PT950 14K BESPOKE.",
      material: "PLATINUM 950 / 14K WHITE GOLD",
      stones: "VS1 STEP-CUT BAGUETTES (4.50 CTW)",
      ctaText: "ORDER BESPOKE SIZE ↗"
    },
    {
      title: "Two-Tone Royal Cuban Bracelet",
      subtitle: "14mm Interlocking Pavé • Dual-Gold Contrast Clasp",
      desc: "An elegant companion piece engineered with alternating high-polish and diamond-paved links in contrasting yellow and white gold, secured by our signature diamond-encrusted box lock clasp.",
      material: "SOLID 14K TWO-TONE GOLD",
      stones: "MICRO-PAVÉ VVS DIAMONDS (2.80 CTW)",
      ctaText: "INQUIRE ATELIER INVENTORY ↗"
    }
  ];

  const items = document.querySelectorAll('.jar-item');
  const marquee = document.getElementById('jar-slider-marquee');
  const stampWrapper = document.getElementById('backdrop-stamp');
  const floatingCapsule = document.getElementById('floating-discover-capsule');
  const capsuleBtn = document.getElementById('capsule-btn');

  // Modal elements
  const drawer = document.getElementById('product-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalMaterial = document.getElementById('modal-material');
  const modalStones = document.getElementById('modal-stones');
  const modalInquireBtn = document.getElementById('modal-inquire-btn');

  const headerMenuBtn = document.getElementById('header-menu-btn');
  const headerCircleBtn = document.getElementById('header-circle-btn');

  const N = items.length;
  let targetProgress = 0;
  let currentProgress = 0;
  let previousProgress = 0;
  let velocity = 0;
  let activeIndex = 0;

  let isDragging = false;
  let startX = 0;

  // Wheel interaction (vertical or horizontal wheel traverses 3D slider)
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetProgress += delta * 0.0015;
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
      targetProgress -= deltaX * 0.0032;
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
      targetProgress -= deltaX * 0.0032;
      startX = e.touches[0].clientX;
    }, { passive: true });
  }

  // Open drawer modal
  function openModal(idx) {
    const p = products[idx % products.length];
    if (modalTitle) modalTitle.textContent = p.title;
    if (modalSubtitle) modalSubtitle.textContent = p.subtitle;
    if (modalDesc) modalDesc.textContent = p.desc;
    if (modalMaterial) modalMaterial.textContent = p.material;
    if (modalStones) modalStones.textContent = p.stones;
    if (modalInquireBtn) modalInquireBtn.textContent = p.ctaText;
    if (drawer) drawer.classList.add('active');
  }

  if (capsuleBtn) {
    capsuleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(activeIndex);
    });
  }

  if (headerMenuBtn) {
    headerMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(activeIndex);
    });
  }

  if (headerCircleBtn) {
    headerCircleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(activeIndex);
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
      if (drawer) drawer.classList.remove('active');
    });
  }

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('active');
    });
  }

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
      stampWrapper.style.transform = `translate(-50%, -50%) rotate(${currentProgress * 70}deg)`;
    }

    const vw = window.innerWidth;
    const baseWidth = Math.min(vw, 1920);

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

      // Hyperbolic tangent fish-eye expansion
      const distortedOffset = Math.tanh(offset * 2.8);
      const x = distortedOffset * (baseWidth * 0.48);

      // Arc curvature in Y (slight downward bow at the ends)
      const y = Math.pow(Math.abs(distortedOffset), 2) * 60;

      // 3D Tilts:
      const rotY = -distortedOffset * 22;
      const rotX = 4 + Math.abs(distortedOffset) * 8;
      const rotZ = -distortedOffset * 10 + (velocity * 0.03); // inertial lean

      // Scale: hero big, edges recede
      const scale = Math.max(1.08 - Math.pow(absOffset * 2.0, 1.3) * 0.45, 0.68);
      // DoF blur: sharp center, blur edges gently
      const blurPx = Math.max(0, (absOffset - 0.09) * 12);
      const brightness = Math.max(1.0 - absOffset * 0.22, 0.80);
      const zIndex = Math.round((1 - absOffset) * 100);

      item.style.transform = `translate3d(${x}px, ${y}px, 0px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      item.style.filter = blurPx > 0.3 ? `blur(${blurPx.toFixed(1)}px) brightness(${brightness.toFixed(2)})` : `brightness(${brightness.toFixed(2)})`;
      item.style.zIndex = zIndex;
      item.style.opacity = absOffset < 0.46 ? 1.0 : Math.max(0, 1 - (absOffset - 0.46) * 5.5);

      if (i === closestIndex) {
        const angleRad = -10 * (Math.PI / 180);
        centerJarX = (window.innerWidth / 2) + (x * Math.cos(angleRad) - y * Math.sin(angleRad));
        centerJarY = (window.innerHeight / 2) + (x * Math.sin(angleRad) + y * Math.cos(angleRad));
      }
    });

    // Update active index
    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
    }

    if (floatingCapsule) {
      // Float badge to the right of the active hero piece (clean clearance)
      const badgeX = centerJarX + 165;
      const badgeY = centerJarY - 30;
      floatingCapsule.style.transform = `translate(${badgeX}px, ${badgeY}px)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

});
