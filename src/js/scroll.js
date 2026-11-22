/**
 * SCROLL CONTROLLER
 * Single master loop in gsap.ticker with Lenis inertial smoothing
 * Spec: lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, syncTouch: false, autoRaf: false
 */

let lenis = null;

export function initScroll() {
  if (typeof window.Lenis === 'undefined') {
    console.warn('Lenis not available, falling back to native scroll');
    return null;
  }

  lenis = new window.Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false,
    autoRaf: false
  });

  // Sync with ScrollTrigger
  if (window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
  }

  // Master single loop in gsap.ticker
  window.gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  window.gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}
