/**
 * BREWNS — SPECIALTY COFFEE HOUSE
 * High-performance 3D Parallax, Curtain Scroll Transitions & Clock Mechanics
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. HERO 3D CURSOR PARALLAX & DRAG ROTATION
     ========================================================================= */
  const heroStage = document.getElementById('hero-interactive-stage');
  const hero3DWrapper = document.getElementById('hero-3d-wrapper');
  const heroCard = document.getElementById('hero-floating-card');

  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragRotation = 0;

  if (heroStage && hero3DWrapper) {
    // Mouse movement parallax
    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;

      targetRotY = mouseX * 18 + dragRotation;
      targetRotX = -mouseY * 12;
    });

    // Drag 360 exploration
    heroStage.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      dragRotation += deltaX * 0.25;
      targetRotY = mouseX * 18 + dragRotation;
      dragStartX = e.clientX;
    });

    // Touch support
    heroStage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      dragRotation += deltaX * 0.25;
      targetRotY = dragRotation;
      dragStartX = e.touches[0].clientX;
    }, { passive: true });

    // Render loop for smooth damping
    function updateHero3D() {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      hero3DWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

      // Floating card independent parallax
      if (heroCard) {
        const cardOffX = currentRotY * 1.8;
        const cardOffY = -currentRotX * 1.4;
        heroCard.style.transform = `translate3d(${cardOffX.toFixed(1)}px, ${cardOffY.toFixed(1)}px, 60px)`;
      }

      requestAnimationFrame(updateHero3D);
    }
    requestAnimationFrame(updateHero3D);
  }

  /* =========================================================================
     2. 3D CARD TILT ON HOVER (CATALOG GRID)
     ========================================================================= */
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      const tiltX = -normY * 12;
      const tiltY = normX * 14;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });
  });

  /* =========================================================================
     3. ANALOG CLOCK ANIMATION (SAN FRANCISCO LIVE TIME & ROTATING CUP)
     ========================================================================= */
  const handHour = document.getElementById('clock-hand-hour');
  const handMin  = document.getElementById('clock-hand-min');
  const handSec  = document.getElementById('clock-hand-sec');
  const liveClockText = document.getElementById('live-clock-text');
  const clockCup = document.getElementById('clock-cup-mount');

  function updateClock() {
    const now = new Date();
    
    // SF / Pacific Time
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const sfTime = new Date(utc - (3600000 * 8)); // UTC-8 (or current offset)

    const hours = sfTime.getHours();
    const minutes = sfTime.getMinutes();
    const seconds = sfTime.getSeconds();
    const millis = sfTime.getMilliseconds();

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
      liveClockText.textContent = `${hStr}:${mStr}:${sStr} PST`;
    }

    requestAnimationFrame(updateClock);
  }
  requestAnimationFrame(updateClock);

  // Clock Cup interactive swirl on drag or tap
  if (clockCup) {
    let cupAngle = 0;
    let cupDragging = false;
    let cupStartX = 0;

    clockCup.addEventListener('mousedown', (e) => {
      cupDragging = true;
      cupStartX = e.clientX;
    });

    window.addEventListener('mouseup', () => { cupDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!cupDragging) return;
      const delta = e.clientX - cupStartX;
      cupAngle += delta * 0.6;
      clockCup.style.transform = `rotate(${cupAngle}deg) scale(1.05)`;
      cupStartX = e.clientX;
    });

    clockCup.addEventListener('click', () => {
      cupAngle += 45;
      clockCup.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      clockCup.style.transform = `rotate(${cupAngle}deg) scale(1.1)`;
      setTimeout(() => {
        clockCup.style.transform = `rotate(${cupAngle}deg) scale(1)`;
      }, 400);
    });
  }

  /* =========================================================================
     4. BAG & CART INTERACTION
     ========================================================================= */
  let cartCount = 0;
  const bagCountEl = document.getElementById('bag-count');

  function addToBag(name, price) {
    cartCount++;
    if (bagCountEl) {
      bagCountEl.textContent = cartCount;
      bagCountEl.style.transform = 'scale(1.4)';
      setTimeout(() => { bagCountEl.style.transform = 'scale(1)'; }, 200);
    }
  }

  document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.getAttribute('data-product');
      const price = btn.getAttribute('data-price');
      addToBag(name, price);
      btn.textContent = 'ADDED ✓';
      setTimeout(() => { btn.textContent = '+ ADD TO BAG'; }, 1200);
    });
  });

  const heroQuickAdd = document.getElementById('hero-quick-add-btn');
  if (heroQuickAdd) {
    heroQuickAdd.addEventListener('click', () => {
      addToBag('House Latte', '6.20');
      heroQuickAdd.textContent = 'ADDED ✓';
      setTimeout(() => { heroQuickAdd.textContent = '+ QUICK ADD'; }, 1200);
    });
  }

  /* =========================================================================
     5. THERMAL RECEIPT MODAL
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
     6. CATALOG TABS FILTERING
     ========================================================================= */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* =========================================================================
     7. AMBIENT SOUND EQUALIZER TOGGLE
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
