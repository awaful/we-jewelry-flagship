/**
 * PRELOADER CONTROLLER (Spec 5: B-1, B-2, B-3)
 * Fullscreen #070709, tabular-nums counter with superindex %, progress line scaleX
 * Real progress calculation with minimum 0.8s display duration
 */

export function initPreloader(onCompleteCallback) {
  const preloader = document.getElementById('preloader');
  const numberEl = document.getElementById('preloader-num');
  const barEl = document.getElementById('preloader-bar');
  const sweepBand = document.querySelector('.preloader-sweep-band');

  if (!preloader || !numberEl || !barEl) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  // Light sweep band animation (B-2)
  if (sweepBand && window.gsap) {
    window.gsap.to(sweepBand, {
      opacity: 0.25,
      x: '25vw',
      y: '25vh',
      duration: 1.0,
      ease: 'power2.out'
    });
  }

  const startTime = performance.now();
  const minDuration = 800; // Minimum 0.8s display

  let realProgress = 0;
  let displayedProgress = 0;
  let isDone = false;

  // Track fonts and critical central frame 07
  const criticalAssets = [
    'public/img/hero-chain/hero-chain-07.svg',
    'public/img/hero-pendant/hero-pendant-07.svg',
    'public/img/watch-hero.svg'
  ];

  let loadedCount = 0;
  criticalAssets.forEach((url) => {
    const img = new Image();
    img.src = url;
    img.onload = img.onerror = () => {
      loadedCount++;
      realProgress = Math.min((loadedCount / criticalAssets.length) * 80, 80);
    };
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      realProgress += 20;
    });
  } else {
    realProgress += 20;
  }

  function updateLoop() {
    displayedProgress += (realProgress - displayedProgress) * 0.12;

    const elapsed = performance.now() - startTime;
    if (elapsed > minDuration && realProgress >= 99) {
      displayedProgress = 100;
    }

    const currentVal = Math.floor(displayedProgress);
    numberEl.innerHTML = `${currentVal}<sup>%</sup>`;
    barEl.style.transform = `scaleX(${displayedProgress / 100})`;

    if (displayedProgress >= 99.5 && elapsed >= minDuration && !isDone) {
      isDone = true;
      numberEl.innerHTML = `100<sup>%</sup>`;
      barEl.style.transform = 'scaleX(1)';

      setTimeout(() => {
        if (window.gsap) {
          window.gsap.to(preloader, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              preloader.style.display = 'none';
              if (onCompleteCallback) onCompleteCallback();
            }
          });
        } else {
          preloader.style.display = 'none';
          if (onCompleteCallback) onCompleteCallback();
        }
      }, 100);
      return;
    }

    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);
}
