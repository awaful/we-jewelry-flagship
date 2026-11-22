/**
 * PRELOADER CONTROLLER (Spec 5: B-1, B-2, B-3)
 * Fullscreen #070709, tabular-nums counter with superindex %, progress line scaleX
 * Robust asset & font tracking with guaranteed completion
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
  const minDisplayTime = 800; // Minimum 0.8s display per spec

  let imagesProgress = 0;
  let fontsProgress = 0;
  let realProgress = 10; // Start at 10%
  let displayedProgress = 0;
  let isDone = false;

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
      imagesProgress = (loadedCount / criticalAssets.length) * 70;
      realProgress = Math.max(realProgress, imagesProgress + fontsProgress);
    };
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      fontsProgress = 30;
      realProgress = Math.max(realProgress, imagesProgress + fontsProgress);
    }).catch(() => {
      fontsProgress = 30;
      realProgress = Math.max(realProgress, imagesProgress + fontsProgress);
    });
  } else {
    fontsProgress = 30;
    realProgress = Math.max(realProgress, imagesProgress + fontsProgress);
  }

  // Safety fallback: ensure 100% after 1.2s regardless of network delays
  setTimeout(() => {
    realProgress = 100;
  }, 1200);

  window.addEventListener('load', () => {
    realProgress = 100;
  });

  function updateLoop() {
    displayedProgress += (realProgress - displayedProgress) * 0.14;

    const elapsed = performance.now() - startTime;
    if (elapsed >= minDisplayTime && realProgress >= 95) {
      displayedProgress = 100;
    }

    const currentVal = Math.min(Math.floor(displayedProgress), 100);
    numberEl.innerHTML = `${currentVal}<sup>%</sup>`;
    barEl.style.transform = `scaleX(${currentVal / 100})`;

    if (displayedProgress >= 99.2 && elapsed >= minDisplayTime && !isDone) {
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
      }, 80);
      return;
    }

    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);
}
