/**
 * HERO CONTROLLER (Spec 6 & 7: A-1, A-2, A-3, A-4, A-5)
 * 15-frame DOM image stack, formula-based frame selection, pointer tilt parallax,
 * drag inspection, object-hover badge swap (0.14s crossfade), pinned 160vh scrub
 */

export function initHero() {
  const chainBox = document.querySelector('.hero-chain-box');
  const pendantBox = document.querySelector('.hero-pendant-box');
  const badgeTitle = document.getElementById('badge-name');
  const badgeMeta = document.getElementById('badge-meta');
  const badgePrice = document.getElementById('badge-price');

  if (!chainBox || !pendantBox) return;

  const chainImgs = chainBox.querySelectorAll('.frame-stack img');
  const pendantImgs = pendantBox.querySelectorAll('.frame-stack img');

  let pointerX = 0;
  let targetPointerX = 0;
  let lastPointerMoveTime = performance.now();

  let chainCurrentShiftX = 0;
  let pendantCurrentShiftX = 0;

  // Active dragging state
  let isDragging = false;
  let dragPiece = null;
  let dragStartX = 0;
  let dragFrameOffset = 0;

  // 1. Mouse & Pointer Tracking
  window.addEventListener('mousemove', (e) => {
    targetPointerX = (e.clientX / window.innerWidth) * 2 - 1;
    lastPointerMoveTime = performance.now();
  });

  // Drag on pieces (1 frame per 14px, snap back 0.6s)
  function setupDrag(el, pieceName) {
    el.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragPiece = pieceName;
      dragStartX = e.clientX;
      dragFrameOffset = 0;
    });

    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragPiece = pieceName;
        dragStartX = e.touches[0].clientX;
        dragFrameOffset = 0;
      }
    }, { passive: true });
  }

  setupDrag(chainBox, 'chain');
  setupDrag(pendantBox, 'pendant');

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      if (window.gsap) {
        window.gsap.to({ val: dragFrameOffset }, {
          val: 0,
          duration: 0.6,
          ease: 'power3.out',
          onUpdate: function() {
            dragFrameOffset = this.targets()[0].val;
          }
        });
      } else {
        dragFrameOffset = 0;
      }
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
    dragFrameOffset = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    dragFrameOffset = Math.round(delta / 14);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const delta = e.touches[0].clientX - dragStartX;
    dragFrameOffset = Math.round(delta / 14);
  }, { passive: true });

  // 2. Object Hover Badge Swapping (Spec A-3, 0.14s crossfade overlap)
  let currentBadgeMode = 'chain';

  function swapBadge(toPendant) {
    const newMode = toPendant ? 'pendant' : 'chain';
    if (newMode === currentBadgeMode) return;
    currentBadgeMode = newMode;

    const floatingBadge = document.querySelector('.hero-floating-badge');
    if (!floatingBadge || !window.gsap) return;

    window.gsap.to(floatingBadge, {
      opacity: 0.4,
      duration: 0.07,
      onComplete: () => {
        if (toPendant) {
          if (badgeTitle) badgeTitle.textContent = 'CUSTOM BUST PENDANT';
          if (badgeMeta) badgeMeta.textContent = 'VVS1 DIAMOND · BESPOKE CAD';
          if (badgePrice) badgePrice.textContent = 'CONSULTAR';
        } else {
          if (badgeTitle) badgeTitle.textContent = '8MM PAVE MIAMI CUBAN';
          if (badgeMeta) badgeMeta.textContent = '14K SOLID · VVS1 MOISSANITE';
          if (badgePrice) badgePrice.textContent = 'CONSULTAR';
        }
        window.gsap.to(floatingBadge, { opacity: 1, duration: 0.07 });
      }
    });
  }

  pendantBox.addEventListener('mouseenter', () => swapBadge(true));
  chainBox.addEventListener('mouseenter', () => swapBadge(false));

  // 3. Animation Loop for Idle & Frame Selection
  function renderLoop(time) {
    const t = time * 0.001;

    // Pointer lerp 0.08
    pointerX += (targetPointerX - pointerX) * 0.08;

    // If quiet for 3s, pointer influence fades out, leaving pure sine wave
    const isQuiet = (performance.now() - lastPointerMoveTime) > 3000;
    const activePointer = isQuiet ? 0 : Math.min(Math.max(pointerX, -1), 1);

    // Frame selection formula: idx = 7 + clamp(pointerX, -1, 1) * 5 + sin(t * 2π / 6) * 1.5
    const sineVal = Math.sin(t * (Math.PI * 2) / 6) * 1.5;
    let computedIndex = Math.round(7 + (activePointer * 5) + sineVal);

    if (isDragging) {
      computedIndex = Math.min(Math.max(computedIndex + dragFrameOffset, 0), 14);
    } else {
      computedIndex = Math.min(Math.max(computedIndex, 0), 14);
    }

    // Apply active frame class
    chainImgs.forEach((img, i) => {
      img.classList.toggle('active-frame', i === computedIndex);
    });

    pendantImgs.forEach((img, i) => {
      img.classList.toggle('active-frame', i === computedIndex);
    });

    // Layer shift parallax: chain ±0.6vw, pendant ±1.1vw in X (lerp 0.06)
    const targetChainShift = activePointer * 0.6;
    const targetPendantShift = activePointer * 1.1;

    chainCurrentShiftX += (targetChainShift - chainCurrentShiftX) * 0.06;
    pendantCurrentShiftX += (targetPendantShift - pendantCurrentShiftX) * 0.06;

    chainBox.style.transform = `translateX(${chainCurrentShiftX}vw)`;
    pendantBox.style.transform = `translateX(${pendantCurrentShiftX}vw)`;

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  // 4. Hero Entrance Timeline
  if (window.gsap) {
    const enterTl = window.gsap.timeline({ defaults: { ease: 'expo.out' } });

    enterTl.from('.hero-chain-box', {
      opacity: 0,
      y: 40,
      duration: 1.1
    })
    .from('.hero-pendant-box', {
      opacity: 0,
      y: 40,
      duration: 1.1
    }, '-=0.98')
    .from('.hero-h1 .h1-line', {
      y: 24,
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.06,
      duration: 0.45,
      ease: 'power2.out'
    }, '-=0.6')
    .from('.hero-script, .hero-kicker, .hero-desc, .hero-cta', {
      opacity: 0,
      y: 12,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-floating-badge', {
      opacity: 0,
      duration: 0.4
    }, '-=0.2');
  }

  // 5. Pinned 160vh Scroll Scrub (A-4, A-5)
  if (window.ScrollTrigger && window.gsap) {
    const heroPinTrigger = window.ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: '+=160vh',
      pin: true,
      pinSpacing: false
    });

    // 0 -> 60vh scrub
    const exitTimeline = window.gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=60vh',
        scrub: true
      }
    });

    exitTimeline
      .to('.hero-text-block', {
        yPercent: -160,
        ease: 'power2.in'
      }, 0)
      .to('.hero-pendant-box', {
        y: '-48vh',
        rotation: 7,
        ease: 'none'
      }, 0)
      .to('.hero-chain-box', {
        y: '-32vh',
        ease: 'none'
      }, 0)
      .to('.hero-floating-badge', {
        y: '-32vh',
        ease: 'none'
      }, 0)
      .to('.hero-bottom-bar', {
        opacity: 1,
        y: 0,
        ease: 'none'
      }, 0.05);
  }
}
