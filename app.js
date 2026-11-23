/**
 * WE JEWELRY & CO. — HOUSTON BESPOKE FINE JEWELRY ATELIER
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
  const criticalImages = [
    'public/img/luxury/baguette-watch.png',
    'public/img/luxury/miami-cuban-chain.png',
    'public/img/luxury/custom-bust-pendant.png',
    'public/img/luxury/diamond-grillz.png'
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
  const minLoadDuration = 1200; // ms to ensure smooth cinematic perception

  function stepPreloader(now) {
    const elapsed = now - startTime;
    const timeProgress = Math.min(100, (elapsed / minLoadDuration) * 100);
    const assetProgress = (loadedImagesCount / criticalImages.length) * 100;
    
    // Smooth weighted progress
    const targetProgress = Math.min(100, Math.max(timeProgress, assetProgress));
    progress += (targetProgress - progress) * 0.12;

    if (preBarFill) preBarFill.style.width = `${progress.toFixed(1)}%`;
    if (preCounter) preCounter.textContent = `${Math.round(progress)}%`;

    if (progress < 99.5 || elapsed < minLoadDuration) {
      requestAnimationFrame(stepPreloader);
    } else {
      // 100% Reached: Trigger Object Load Sequence!
      if (preBarFill) preBarFill.style.width = '100%';
      if (preCounter) preCounter.textContent = '100%';

      setTimeout(() => {
        document.body.classList.remove('loading-state');
        document.body.classList.add('loaded');

        // Dismiss preloader overlay
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 800);
      }, 250);
    }
  }

  requestAnimationFrame(stepPreloader);

  /* =========================================================================
     2. CUSTOM INTERACTIVE MOUSE CURSOR
     ========================================================================= */
  const cursor = document.getElementById('custom-cursor');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isCursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isCursorVisible) {
      isCursorVisible = true;
      ringX = mouseX;
      ringY = mouseY;
    }
  });

  // 60fps lerp loop for ultra-smooth trailing ring
  function updateCursor() {
    if (cursor && isCursorVisible) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      const dot = cursor.querySelector('.cursor-dot');
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
    }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Hover states for links, buttons & interactive cards
  const hoverTargets = document.querySelectorAll('a, button, input, .product-card, .loc-card, .menu-receipt-mini');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('cursor-hover');
    });
  });

  /* =========================================================================
     3. HERO 3D MOUSE PARALLAX & DUAL-LAYER DEPTH INTERACTION
     ========================================================================= */
  const heroStage = document.getElementById('hero-interactive-stage');
  const hero3DWrapper = document.getElementById('hero-3d-wrapper');
  const heroChain = document.getElementById('hero-layer-chain');
  const heroWatch = document.getElementById('hero-layer-watch');
  const heroCard = document.getElementById('hero-floating-card');
  const heroGlint = document.getElementById('watch-glint');

  let normX = 0, normY = 0;
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  let isDraggingHero = false;
  let dragStartX = 0;
  let dragRotation = 0;

  // Hero cursor state changes
  if (heroStage) {
    heroStage.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.classList.add('cursor-hero');
        if (cursorLabel) cursorLabel.textContent = '360° DRAG';
      }
    });

    heroStage.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.classList.remove('cursor-hero');
        cursor.classList.remove('cursor-grabbing');
      }
      isDraggingHero = false;
    });

    // Mouse movement parallax
    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      normX = (e.clientX / innerWidth - 0.5) * 2;
      normY = (e.clientY / innerHeight - 0.5) * 2;

      targetRotY = normX * 16 + dragRotation;
      targetRotX = -normY * 12;
    });

    // 360 Drag rotation
    heroStage.addEventListener('mousedown', (e) => {
      isDraggingHero = true;
      dragStartX = e.clientX;
      if (cursor) cursor.classList.add('cursor-grabbing');
    });

    window.addEventListener('mouseup', () => {
      isDraggingHero = false;
      if (cursor) cursor.classList.remove('cursor-grabbing');
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

    // Damped 60fps render loop for Hero 3D Stage
    function updateHero3D() {
      currentRotX += (targetRotX - currentRotX) * 0.085;
      currentRotY += (targetRotY - currentRotY) * 0.085;

      if (hero3DWrapper) {
        hero3DWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      // Dual-Depth Parallax offsets between background chain & foreground watch
      if (heroChain) {
        const chainOffX = -currentRotY * 0.8;
        const chainOffY = currentRotX * 0.6;
        heroChain.style.transform = `translate3d(calc(-50% + ${chainOffX.toFixed(1)}px), calc(-50% + ${chainOffY.toFixed(1)}px), -35px) scale(0.98)`;
      }

      if (heroWatch) {
        const watchOffX = currentRotY * 1.4;
        const watchOffY = -currentRotX * 1.1;
        heroWatch.style.transform = `translate3d(calc(-50% + ${watchOffX.toFixed(1)}px), calc(-50% + ${watchOffY.toFixed(1)}px), 50px) scale(1)`;
      }

      // Floating Certificate Card independent parallax
      if (heroCard) {
        const cardOffX = currentRotY * 2.2;
        const cardOffY = -currentRotX * 1.8;
        heroCard.style.transform = `translate3d(${cardOffX.toFixed(1)}px, ${cardOffY.toFixed(1)}px, 65px)`;
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
  let vaultCount = 0;
  const bagCountEl = document.getElementById('bag-count');
  const receiptItemsList = document.getElementById('receipt-items-list');

  function addToVault(productName, category) {
    vaultCount++;
    if (bagCountEl) {
      bagCountEl.textContent = vaultCount;
      bagCountEl.style.transform = 'scale(1.4)';
      setTimeout(() => { bagCountEl.style.transform = 'scale(1)'; }, 200);
    }

    if (receiptItemsList) {
      const itemRow = document.createElement('div');
      itemRow.className = 'r-item';
      itemRow.innerHTML = `<span>1x ${productName.toUpperCase()}</span><span>CONSULTAR</span>`;
      receiptItemsList.prepend(itemRow);
    }
  }

  document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.getAttribute('data-product') || 'Bespoke Piece';
      addToVault(name, 'VAULT COMMISSION');
      btn.textContent = 'ADDED TO VAULT ✓';
      setTimeout(() => { btn.textContent = '+ COMMISSION'; }, 1400);
    });
  });

  const heroQuickAdd = document.getElementById('hero-quick-add-btn');
  if (heroQuickAdd) {
    heroQuickAdd.addEventListener('click', () => {
      addToVault('Baguette Tourbillon Watch', 'HOROLOGY');
      heroQuickAdd.textContent = 'COMMISSIONED ✓';
      setTimeout(() => { heroQuickAdd.textContent = '+ COMMISSION PIECE'; }, 1400);
    });
  }

  const bagBtn = document.getElementById('bag-btn');
  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      const modal = document.getElementById('receipt-modal');
      if (modal) modal.classList.add('open');
    });
  }

  /* =========================================================================
     7. BESPOKE COMMISSION CERTIFICATE MODAL
     ========================================================================= */
  const receiptTrigger = document.getElementById('mini-receipt-trigger');
  const receiptModal = document.getElementById('receipt-modal');
  const receiptClose = document.getElementById('receipt-close-btn');

  if (receiptTrigger && receiptModal) {
    receiptTrigger.addEventListener('click', () => {
      receiptModal.classList.add('open');
    });
  }

  if (receiptClose && receiptModal) {
    receiptClose.addEventListener('click', () => {
      receiptModal.classList.remove('open');
    });

    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) receiptModal.classList.remove('open');
    });
  }

  /* =========================================================================
     8. CATALOG CATEGORY FILTERING
     ========================================================================= */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-cat');
      // Subtle pulse on cards to simulate category filter
      productCards.forEach((c, idx) => {
        c.style.opacity = '0.4';
        c.style.transform = 'scale(0.97)';
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'scale(1)';
        }, 120 + idx * 40);
      });
    });
  });

  /* =========================================================================
     9. AMBIENT ATELIER SOUND TOGGLE
     ========================================================================= */
  const soundBtn = document.getElementById('sound-btn');
  let isPlayingSound = false;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isPlayingSound = !isPlayingSound;
      soundBtn.classList.toggle('playing', isPlayingSound);
      const bars = soundBtn.querySelectorAll('.sound-bars span');
      if (isPlayingSound) {
        bars.forEach((b, i) => {
          b.style.animation = `pulseDot ${0.4 + i * 0.2}s infinite alternate`;
        });
      } else {
        bars.forEach(b => {
          b.style.animation = 'none';
        });
      }
    });
  }

});
