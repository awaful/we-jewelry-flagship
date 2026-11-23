/**
 * THE LUMINOUS — HOUSTON BESPOKE FINE JEWELRY ATELIER
 * Flagship Digital Experience, Dual-Depth 3D Parallax & Cinematic Motion
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. PRELOADER & OBJECT LOAD CONTROLLER
     ========================================================================= */
  const preloader = document.getElementById('preloader');
  const preBarFill = document.getElementById('pre-bar-fill');
  const preCounter = document.getElementById('pre-counter');
  
  let progress = 0;
  let isLoaded = false;
  const criticalImages = [
    'public/img/luxury/baguette-watch.png',
    'public/img/luxury/diamond-grillz.png',
    'public/img/luxury/custom-bust-pendant.png',
    'public/img/luxury/miami-cuban-chain.png'
  ];

  let loadedImagesCount = 0;
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loadedImagesCount++;
    };
  });

  const startTime = performance.now();
  const minLoadDuration = 1100; // ms to ensure smooth cinematic perception

  function completeLoading() {
    if (isLoaded) return;
    isLoaded = true;

    if (preBarFill) preBarFill.style.width = '100%';
    if (preCounter) preCounter.textContent = '100%';

    setTimeout(() => {
      document.body.classList.remove('loading-state');
      document.body.classList.add('loaded');

      // Dismiss preloader overlay
      setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
      }, 750);
    }, 200);
  }

  function stepPreloader(now) {
    if (isLoaded) return;
    const elapsed = now - startTime;
    const timeProgress = Math.min(100, (elapsed / minLoadDuration) * 100);
    const assetProgress = (loadedImagesCount / criticalImages.length) * 100;
    
    // Smooth weighted progress
    const targetProgress = Math.min(100, Math.max(timeProgress, assetProgress));
    progress += (targetProgress - progress) * 0.14;

    if (preBarFill) preBarFill.style.width = `${progress.toFixed(1)}%`;
    if (preCounter) preCounter.textContent = `${Math.round(progress)}%`;

    if (progress < 99.5 || elapsed < minLoadDuration) {
      requestAnimationFrame(stepPreloader);
    } else {
      completeLoading();
    }
  }

  requestAnimationFrame(stepPreloader);

  // Safety fallback: Ensure page ALWAYS unlocks within 2.2s even on slow connections
  setTimeout(() => {
    completeLoading();
  }, 2200);

  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* =========================================================================
     3. HERO 3D MOUSE PARALLAX & DUAL-LAYER SCROLL-SWAP INTERACTION
     ========================================================================= */
  const heroStage = document.getElementById('hero-interactive-stage');
  const hero3DWrapper = document.getElementById('hero-3d-wrapper');
  const heroGrillz = document.getElementById('hero-layer-grillz');
  const heroWatch = document.getElementById('hero-layer-watch');
  const heroGlint = document.getElementById('watch-glint');

  let normX = 0, normY = 0;
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  let isDraggingHero = false;
  let dragStartX = 0;
  let dragRotation = 0;

  // Scroll tracking for swapping Grillz and Watch positions
  let targetScrollProg = 0;
  let currentScrollProg = 0;

  function onScrollHero() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const heroH = window.innerHeight || 800;
    // Swap positions smoothly over the first 75% of the viewport scroll
    targetScrollProg = Math.max(0, Math.min(1, scrollY / (heroH * 0.75)));
  }
  window.addEventListener('scroll', onScrollHero, { passive: true });
  onScrollHero();

  if (heroStage) {
    if (!isTouchDevice) {
      // Mouse movement parallax
      window.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        normX = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
        normY = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));

        targetRotY = normX * 16 + dragRotation;
        targetRotX = -normY * 12;
      });
    }

    // 360 Drag rotation
    heroStage.addEventListener('mousedown', (e) => {
      isDraggingHero = true;
      dragStartX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDraggingHero = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingHero) return;
      const deltaX = e.clientX - dragStartX;
      dragRotation += deltaX * 0.35;
      targetRotY = normX * 16 + dragRotation;
      dragStartX = e.clientX;
    });

    // Touch support for mobile/tablet
    heroStage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDraggingHero = true;
        dragStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDraggingHero = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingHero || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      dragRotation += deltaX * 0.35;
      targetRotY = dragRotation;
      dragStartX = e.touches[0].clientX;
    }, { passive: true });

    // Damped 60fps render loop for Hero 3D Stage + Scroll Swap
    function updateHero3D() {
      currentRotX += (targetRotX - currentRotX) * 0.085;
      currentRotY += (targetRotY - currentRotY) * 0.085;

      // Smooth interpolation for scroll swap
      currentScrollProg += (targetScrollProg - currentScrollProg) * 0.08;
      const t = currentScrollProg * currentScrollProg * (3 - 2 * currentScrollProg);
      const sinArc = Math.sin(Math.PI * t);

      // Trajectories:
      // Grillz starts at top-right (70%, 26%) -> swaps to bottom-left (30%, 68%)
      const grillzX = 70 + (30 - 70) * t + 12 * sinArc;
      const grillzY = 26 + (68 - 26) * t + 8 * sinArc;
      const grillzZ = -15 - 35 * sinArc;
      const grillzRot = -8 + (6 - (-8)) * t - 8 * sinArc;

      // Watch starts at bottom-left (30%, 68%) -> swaps to top-right (70%, 26%)
      const watchX = 30 + (70 - 30) * t - 12 * sinArc;
      const watchY = 68 + (26 - 68) * t - 8 * sinArc;
      const watchZ = 45 + 45 * sinArc;
      const watchRot = 6 + (-8 - 6) * t + 8 * sinArc;

      if (hero3DWrapper) {
        hero3DWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      // Parallax offsets + scroll swap positioning
      if (heroGrillz) {
        const grillzOffX = -currentRotY * 0.7;
        const grillzOffY = currentRotX * 0.5;
        heroGrillz.style.left = `${grillzX.toFixed(2)}%`;
        heroGrillz.style.top = `${grillzY.toFixed(2)}%`;
        heroGrillz.style.transform = `translate3d(calc(-50% + ${grillzOffX.toFixed(1)}px), calc(-50% + ${grillzOffY.toFixed(1)}px), ${grillzZ.toFixed(1)}px) rotate(${grillzRot.toFixed(2)}deg)`;
      }

      if (heroWatch) {
        const watchOffX = currentRotY * 0.9;
        const watchOffY = -currentRotX * 0.7;
        heroWatch.style.left = `${watchX.toFixed(2)}%`;
        heroWatch.style.top = `${watchY.toFixed(2)}%`;
        heroWatch.style.transform = `translate3d(calc(-50% + ${watchOffX.toFixed(1)}px), calc(-50% + ${watchOffY.toFixed(1)}px), ${watchZ.toFixed(1)}px) rotate(${watchRot.toFixed(2)}deg)`;
      }

      // Dynamic glint sweep across watch face
      if (heroGlint) {
        const glintX = normX * 35;
        const glintY = normY * 25;
        heroGlint.style.transform = `translate(${glintX.toFixed(1)}px, ${glintY.toFixed(1)}px) scale(${1 + Math.abs(normX) * 0.25})`;
      }

      requestAnimationFrame(updateHero3D);
    }
    requestAnimationFrame(updateHero3D);
  }

  /* =========================================================================
     4. 3D CARD TILT ON HOVER (CATALOG GRID)
     ========================================================================= */
  if (!isTouchDevice) {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normCardX = (x / rect.width - 0.5) * 2;
        const normCardY = (y / rect.height - 0.5) * 2;

        const tiltX = -normCardY * 12;
        const tiltY = normCardX * 14;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      });
    });
  }

  /* =========================================================================
     5. ANALOG CLOCK ANIMATION (HOUSTON CST LIVE TIME & CENTER TOURBILLON)
     ========================================================================= */
  const handHour = document.getElementById('clock-hand-hour');
  const handMin  = document.getElementById('clock-hand-min');
  const handSec  = document.getElementById('clock-hand-sec');
  const liveClockText = document.getElementById('live-clock-text');
  const clockCup = document.getElementById('clock-cup-mount');

  function updateClock() {
    const now = new Date();
    
    // Houston CST / CDT via Intl formatter
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    let hours = 0, minutes = 0, seconds = 0;
    parts.forEach(p => {
      if (p.type === 'hour') hours = parseInt(p.value, 10);
      if (p.type === 'minute') minutes = parseInt(p.value, 10);
      if (p.type === 'second') seconds = parseInt(p.value, 10);
    });

    const millis = now.getMilliseconds();
    const secAngle = ((seconds + millis / 1000) / 60) * 360;
    const minAngle = ((minutes + seconds / 60) / 60) * 360;
    const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

    if (handSec)  handSec.setAttribute('transform', `rotate(${secAngle} 500 500)`);
    if (handMin)  handMin.setAttribute('transform', `rotate(${minAngle} 500 500)`);
    if (handHour) handHour.setAttribute('transform', `rotate(${hourAngle} 500 500)`);

    if (liveClockText) {
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');
      liveClockText.textContent = `${hStr}:${mStr}:${sStr} CST`;
    }

    requestAnimationFrame(updateClock);
  }
  requestAnimationFrame(updateClock);

  // Centerpiece Tourbillon interactive rotation on drag or click
  if (clockCup) {
    let watchAngle = 0;
    let watchDragging = false;
    let watchStartX = 0;

    clockCup.addEventListener('mousedown', (e) => {
      watchDragging = true;
      watchStartX = e.clientX;
    });

    window.addEventListener('mouseup', () => { watchDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!watchDragging) return;
      const delta = e.clientX - watchStartX;
      watchAngle += delta * 0.6;
      clockCup.style.transform = `rotate(${watchAngle}deg) scale(1.06)`;
      watchStartX = e.clientX;
    });

    clockCup.addEventListener('click', () => {
      watchAngle += 60;
      clockCup.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      clockCup.style.transform = `rotate(${watchAngle}deg) scale(1.12)`;
      setTimeout(() => {
        clockCup.style.transform = `rotate(${watchAngle}deg) scale(1)`;
      }, 400);
    });
  }

  /* =========================================================================
     6. VAULT & BESPOKE COMMISSION RECEIPT
     ========================================================================= */
  const vaultItems = [];
  const bagCountEl = document.getElementById('bag-count');
  const receiptItemsList = document.getElementById('receipt-items-list');
  const vaultStatusText = document.getElementById('vault-status-text');

  function renderVault() {
    if (!receiptItemsList) return;
    if (vaultItems.length === 0) {
      receiptItemsList.innerHTML = `
        <div class="vault-empty-state">
          <p>YOUR VAULT IS CURRENTLY EMPTY</p>
          <span>Click "+ COMMISSION" on pieces in our collection to add them to your inquiry.</span>
        </div>
      `;
      if (vaultStatusText) vaultStatusText.textContent = 'NO PIECES';
    } else {
      receiptItemsList.innerHTML = vaultItems.map((item, idx) => `
        <div class="r-item">
          <span>1x ${item.name.toUpperCase()}</span>
          <div style="display:flex;align-items:center;">
            <span>${item.price}</span>
            <button type="button" class="r-item-del" data-idx="${idx}" title="Remove piece">✕</button>
          </div>
        </div>
      `).join('');

      receiptItemsList.querySelectorAll('.r-item-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          vaultItems.splice(idx, 1);
          updateVaultUI();
        });
      });

      if (vaultStatusText) vaultStatusText.textContent = `${vaultItems.length} BESPOKE ${vaultItems.length === 1 ? 'PIECE' : 'PIECES'}`;
    }
  }

  function updateVaultUI() {
    if (bagCountEl) {
      bagCountEl.textContent = vaultItems.length;
      bagCountEl.style.transform = 'scale(1.4)';
      setTimeout(() => { bagCountEl.style.transform = 'scale(1)'; }, 200);
    }
    renderVault();
  }

  function addToVault(productName, price = 'CONSULTAR') {
    vaultItems.push({ name: productName, price });
    updateVaultUI();
  }

  // Initialize vault display
  renderVault();

  document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.getAttribute('data-product') || 'Bespoke Piece';
      addToVault(name, 'CONSULTAR');
      btn.textContent = 'ADDED TO VAULT ✓';
      setTimeout(() => { btn.textContent = '+ COMMISSION'; }, 1400);
    });
  });

  /* =========================================================================
     7. BESPOKE COMMISSION CERTIFICATE MODAL (WITH ESC & SCROLL LOCK)
     ========================================================================= */
  const receiptTrigger = document.getElementById('mini-receipt-trigger');
  const receiptModal = document.getElementById('receipt-modal');
  const receiptClose = document.getElementById('receipt-close-btn');
  const bagBtn = document.getElementById('bag-btn');

  function openReceiptModal() {
    if (receiptModal) {
      receiptModal.classList.add('open');
      receiptModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeReceiptModal() {
    if (receiptModal) {
      receiptModal.classList.remove('open');
      receiptModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (bagBtn) bagBtn.addEventListener('click', openReceiptModal);
  if (receiptTrigger) receiptTrigger.addEventListener('click', openReceiptModal);
  if (receiptClose) receiptClose.addEventListener('click', closeReceiptModal);

  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) closeReceiptModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeReceiptModal();
  });

  /* =========================================================================
     8. CATALOG CATEGORY FILTERING
     ========================================================================= */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCat = tab.getAttribute('data-cat');
      productCards.forEach((c, idx) => {
        const cardCat = c.getAttribute('data-category');
        const show = targetCat === 'all' || cardCat === targetCat;
        if (show) {
          c.style.display = '';
          c.style.opacity = '0.4';
          c.style.transform = 'scale(0.97)';
          setTimeout(() => {
            c.style.opacity = '1';
            c.style.transform = 'scale(1)';
          }, 60 + idx * 25);
        } else {
          c.style.display = 'none';
        }
      });
    });
  });

});
