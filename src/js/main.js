/**
 * WE JEWELRY & CO. — MAIN APPLICATION ENTRY POINT
 * Master coordinator for reverse-engineered motion systems (Brewns + Helion)
 */

import { initScroll, getLenis } from './scroll.js';
import { initPreloader } from './preloader.js';
import { initHero } from './hero.js';
import { initVault } from './vault.js';
import { initClock } from './clock.js';
import { initParticles } from './particles.js';
import { initVelocity } from './velocity.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Smooth Inertial Scroll (Master Ticker Loop)
  const lenis = initScroll();

  // 2. Initialize Velocity Effects (blur + scaleY on scroll velocity)
  if (lenis) {
    initVelocity(lenis);
  }

  // 3. Initialize Preloader with Real Progress Tracking (B-1, B-2, B-3)
  initPreloader(() => {
    // 4. Initialize Hero and Sections once preloader dismisses
    initHero();
    initVault();
    initClock();
    initParticles();
  });
});
