/**
 * CLOCK SECTION CONTROLLER (Spec 9: A-9, A-10)
 * Pinned 220vh section, dial overshoot entry, rotation to -18deg,
 * high-velocity exit (watch to -70vh, 1.6x speed with 12deg rotation),
 * live scroll microtext telemetry
 */

export function initClock() {
  if (!window.ScrollTrigger || !window.gsap) return;

  const clockSection = document.getElementById('clock-section');
  const dialEl = document.querySelector('.clock-dial-svg');
  const watchImg = document.querySelector('.watch-hero-img');
  const timeTelemetry = document.getElementById('clock-time-val');
  const bandBottom = document.querySelector('.clock-bottom-band');

  if (!clockSection || !dialEl || !watchImg) return;

  // Master scrub across 220vh
  const clockTl = window.gsap.timeline({
    scrollTrigger: {
      trigger: '#clock-section',
      start: 'top top',
      end: '+=220vh',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Live microtext updates with scroll progress
        if (timeTelemetry) {
          const prog = self.progress;
          const hours = 10 + Math.floor(prog * 2);
          const minutes = Math.floor((prog * 60) % 60);
          timeTelemetry.textContent = `HOUSTON CST · ${hours}:${minutes < 10 ? '0' : ''}${minutes} · REF #LUM-${Math.floor(1000 + prog * 999)}`;
        }
      }
    }
  });

  // Phase 1 (0 -> 25%): Dial overshoot entry and watch focus
  clockTl
    .fromTo(dialEl, 
      { y: '100vh' },
      { y: '-2.5vh', duration: 0.22, ease: 'power2.out' },
      0
    )
    .to(dialEl, { y: '0vh', duration: 0.03, ease: 'power1.inOut' }, 0.22)
    .fromTo(watchImg,
      { y: '100vh', filter: 'brightness(0.5) blur(6px)' },
      { y: '0vh', filter: 'brightness(1) blur(0px)', duration: 0.25, ease: 'power2.out' },
      0
    );

  // Phase 2 (25 -> 55%): Dial rotation in rest
  clockTl.to(dialEl, {
    rotation: -18,
    duration: 0.30,
    ease: 'none'
  }, 0.25);

  // Phase 3 (55 -> 100%): Exit (watch flies to -70vh at 1.6x speed, rotates 12deg; dial to -45vh; bottom band enters)
  clockTl
    .to(watchImg, {
      y: '-70vh',
      rotation: 12,
      duration: 0.45,
      ease: 'power2.in'
    }, 0.55)
    .to(dialEl, {
      y: '-45vh',
      duration: 0.45,
      ease: 'power2.in'
    }, 0.55)
    .to(bandBottom, {
      y: '0%',
      duration: 0.45,
      ease: 'none'
    }, 0.55);
}
