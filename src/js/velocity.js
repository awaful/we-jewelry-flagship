/**
 * VELOCITY CONTROLLER (Spec 11: A-4, A-8, A-10)
 * vN = clamp(|lenis.velocity| / 40, 0, 1)
 * Headline: blur(3px * vN), scaleY(1 + 0.03 * vN)
 * Product images: blur(6px * vN), scaleY(1 + 0.08 * vN)
 * Applied via gsap.quickTo with 0.25s duration
 */

export function initVelocity(lenis) {
  if (!lenis || !window.gsap) return;

  const isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth <= 768;

  const headline = document.querySelector('.hero-h1');
  const products = document.querySelectorAll('.vault-product-img, .watch-hero-img, .hero-chain-box, .hero-pendant-box');

  if (!headline) return;

  const quickScaleHeadline = window.gsap.quickTo(headline, 'scaleY', { duration: 0.25, ease: 'power3.out' });
  const quickBlurHeadline = !isLowPower ? window.gsap.quickTo(headline, 'filter', { duration: 0.25, ease: 'power3.out' }) : null;

  const productScaleAnimators = Array.from(products).map(el => window.gsap.quickTo(el, 'scaleY', { duration: 0.25, ease: 'power3.out' }));
  const productBlurAnimators = !isLowPower ? Array.from(products).map(el => window.gsap.quickTo(el, 'filter', { duration: 0.25, ease: 'power3.out' })) : [];

  let isScrolling = false;
  let scrollTimeout = null;

  window.gsap.ticker.add(() => {
    const vel = Math.abs(lenis.velocity || 0);
    const vN = Math.min(Math.max(vel / 40, 0), 1);

    if (vN > 0.02) {
      if (!isScrolling) {
        isScrolling = true;
        headline.style.willChange = 'transform, filter';
        products.forEach(p => { p.style.willChange = 'transform, filter'; });
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        headline.style.willChange = 'auto';
        products.forEach(p => { p.style.willChange = 'auto'; });
      }, 500);

      quickScaleHeadline(1 + 0.03 * vN);
      if (quickBlurHeadline) quickBlurHeadline(`blur(${3 * vN}px)`);

      productScaleAnimators.forEach(anim => anim(1 + 0.08 * vN));
      productBlurAnimators.forEach(anim => anim(`blur(${6 * vN}px)`));
    } else {
      quickScaleHeadline(1);
      if (quickBlurHeadline) quickBlurHeadline('blur(0px)');
      productScaleAnimators.forEach(anim => anim(1));
      productBlurAnimators.forEach(anim => anim('blur(0px)'));
    }
  });
}
