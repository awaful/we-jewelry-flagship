/**
 * VAULT CATALOG CONTROLLER (Spec 7 & 8: A-6, A-7, A-8)
 * Ascending cover curtain (straight edge, no border-radius, no shadow),
 * adaptive header toggle with start: 'top 6%',
 * 4-column hairline grid, exit scrub (cards -25%, title -40%)
 */

export function initVault() {
  if (!window.ScrollTrigger || !window.gsap) return;

  const header = document.getElementById('site-header');
  const vault = document.getElementById('vault');

  if (!vault) return;

  // 1. Ascending Cover Curtain (40vh -> 160vh)
  window.gsap.fromTo('#vault', 
    { y: '100vh' },
    {
      y: '0vh',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: '40vh top',
        end: '160vh top',
        scrub: true
      }
    }
  );

  // 2. Adaptive Navigation Header (Spec 7: start: 'top 6%')
  window.ScrollTrigger.create({
    trigger: '#vault',
    start: 'top 6%',
    endTrigger: '#clock-section',
    end: 'bottom 6%',
    onEnter: () => {
      if (header) header.setAttribute('data-theme', 'light');
    },
    onLeaveBack: () => {
      if (header) header.removeAttribute('data-theme');
    },
    onLeave: () => {
      // Clock section ends and particles begin (dark theme)
      if (header) header.removeAttribute('data-theme');
    },
    onEnterBack: () => {
      if (header) header.setAttribute('data-theme', 'light');
    }
  });

  // 3. Vault Exit Scrub (A-8) at 45% height
  const exitTl = window.gsap.timeline({
    scrollTrigger: {
      trigger: '#vault',
      start: '45% top',
      end: 'bottom top',
      scrub: true
    }
  });

  exitTl
    .to('.vault-cell', {
      yPercent: -25,
      ease: 'none',
      stagger: 0.02
    }, 0)
    .to('.vault-h2', {
      yPercent: -40,
      ease: 'none'
    }, 0);
}
