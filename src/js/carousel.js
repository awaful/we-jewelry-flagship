/**
 * WE JEWELRY & CO. — EXACT AWWWARDS SOTD 3D ORBITAL CAROUSEL
 * Replicating the physical behavior of the video (Agrumea Farm by Studio K95)
 */

document.addEventListener('DOMContentLoaded', () => {

  const productsData = [
    {
      index: 0,
      title: "Miami Cuban Chain",
      subtitle: "8MM PAVE SETTING",
      category: "[01 / CHAINS]",
      alloy: "14K SOLID YELLOW GOLD",
      stones: "VVS1 MOISSANITE / AAA",
      desc: "Handcrafted 14K solid yellow gold interlocking Miami Cuban links, pavé-set with brilliant-cut VVS stones and secured with a signature Houston triple-lock box clasp.",
      link: "https://wa.me/18326886688?text=Hello%20WE%20Jewelry,%20I%20am%20interested%20in%20the%20Miami%20Cuban%20Chain"
    },
    {
      index: 1,
      title: "Custom Bust Pendant",
      subtitle: "3D CAD CUSTOM SCULPTURE",
      category: "[02 / PENDANTS]",
      alloy: "14K WHITE GOLD / PLATINUM",
      stones: "4.80 TCW VVS DIAMONDS",
      desc: "Custom anatomical bust pendant engineered in 3D CAD, cast in solid white gold, and encrusted with 4.80 TCW handset round brilliant VVS diamonds.",
      link: "https://wa.me/18326886688?text=Hello%20WE%20Jewelry,%20I%20am%20interested%20in%20a%20Custom%20Bust%20Pendant"
    },
    {
      index: 2,
      title: "Deep Cut Dental Grillz",
      subtitle: "6-TOOTH MIRROR POLISH",
      category: "[03 / GRILLZ]",
      alloy: "18K SOLID GOLD",
      stones: "OPEN FACE / SOLID",
      desc: "Tailored dental grillz fabricated from exact silicone impression molds in 18K yellow gold with deep-cut gum separations and high-specular mirror finish.",
      link: "https://wa.me/18326886688?text=Hello%20WE%20Jewelry,%20I%20am%20interested%20in%20Custom%20Dental%20Grillz"
    },
    {
      index: 3,
      title: "Luminous Timepiece",
      subtitle: "AUTOMATIC ICED BEZEL",
      category: "[04 / TIMEPIECES]",
      alloy: "316L STEEL & GOLD ACCENTS",
      stones: "MOISSANITE ICED BEZEL",
      desc: "Signature Houston automatic timepiece featuring a dual-tier iced moissanite bezel, exhibition sapphire back, and hand-finished steel link bracelet.",
      link: "https://wa.me/18326886688?text=Hello%20WE%20Jewelry,%20I%20am%20interested%20in%20the%20Luminous%20Timepiece"
    },
    {
      index: 4,
      title: "Baguette Master Ring",
      subtitle: "TWO-TONE PRONG SUITE",
      category: "[05 / RINGS]",
      alloy: "14K TWO-TONE GOLD",
      stones: "STEP-CUT BAGUETTE VVS",
      desc: "Two-tone 14K yellow and white gold architectural signet ring channel-set with step-cut baguette stones and surrounded by a micropavé diamond halo.",
      link: "https://wa.me/18326886688?text=Hello%20WE%20Jewelry,%20I%20am%20interested%20in%20the%20Baguette%20Master%20Ring"
    }
  ];

  const cards = document.querySelectorAll('.jewelry-card-3d');
  const viewport = document.getElementById('carousel-viewport');
  const rotatingText = document.querySelector('.arch-rotating-text');
  const tooltip = document.getElementById('active-product-tooltip');
  const tooltipText = document.getElementById('tooltip-text');
  const discoverBtn = document.getElementById('discover-btn');

  // Drawer elements
  const drawer = document.getElementById('detail-drawer');
  const closeDrawer = document.getElementById('close-drawer');
  const drawerCategory = document.getElementById('drawer-category');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerDesc = document.getElementById('drawer-description');
  const drawerAlloy = document.getElementById('drawer-alloy');
  const drawerStones = document.getElementById('drawer-stones');
  const drawerWhatsApp = document.getElementById('drawer-whatsapp');

  const N = cards.length;
  let currentAngle = 0;
  let targetAngle = 0;
  let activeIndex = 0;

  let isDragging = false;
  let dragStartX = 0;

  // Responsive radii
  function getRadii() {
    const w = window.innerWidth;
    if (w <= 768) {
      return { rx: w * 0.38, rz: 180 };
    }
    return { rx: Math.min(w * 0.32, 460), rz: 280 };
  }

  // Mouse wheel / trackpad scroll with inertia
  window.addEventListener('wheel', (e) => {
    targetAngle += e.deltaY * 0.0022;
  }, { passive: true });

  // Mouse and Touch Drag
  if (viewport) {
    viewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientX - dragStartX;
      targetAngle -= delta * 0.005;
      dragStartX = e.clientX;
    });

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const delta = e.touches[0].clientX - dragStartX;
      targetAngle -= delta * 0.005;
      dragStartX = e.touches[0].clientX;
    }, { passive: true });
  }

  // Drawer Interactions
  function openDrawer(idx) {
    const data = productsData[idx];
    drawerCategory.textContent = data.category;
    drawerTitle.textContent = data.title;
    drawerDesc.textContent = data.desc;
    drawerAlloy.textContent = data.alloy;
    drawerStones.textContent = data.stones;
    drawerWhatsApp.href = data.link;
    drawer.classList.add('active');
  }

  if (closeDrawer) {
    closeDrawer.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer(activeIndex);
    });
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (idx === activeIndex) {
        openDrawer(idx);
      } else {
        // Snap this card to center
        const targetCardAngle = -((idx / N) * Math.PI * 2);
        targetAngle = targetCardAngle;
      }
    });
  });

  // 3D Animation Loop
  function updateCarousel() {
    // Smooth inertial lerp
    currentAngle += (targetAngle - currentAngle) * 0.085;

    // Rotate background curved path typography
    if (rotatingText) {
      rotatingText.style.transform = `rotate(${-currentAngle * 26}deg)`;
    }

    const { rx, rz } = getRadii();
    let minDiff = Infinity;
    let closestIndex = 0;

    cards.forEach((card, i) => {
      const baseTheta = (i / N) * Math.PI * 2;
      let diff = (baseTheta + currentAngle) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;

      const absDiff = Math.abs(diff);
      if (absDiff < minDiff) {
        minDiff = absDiff;
        closestIndex = i;
      }

      // Orbital Position
      const x = Math.sin(diff) * rx;
      const z = (Math.cos(diff) - 1.0) * rz;
      const y = (Math.cos(diff) - 1.0) * 36;

      // 3D Tilts matching video:
      // When at center (diff = 0): perfectly upright (yaw 0, pitch 0, roll 0)
      // When to the left (diff < 0): rolls right, tilts forward showing top lid/bail!
      // When to the right (diff > 0): tilts symmetrically
      const rotY = -Math.sin(diff) * 34; // degrees
      const rotX = 14 - Math.cos(diff) * 14; // tilts forward when angled
      const rotZ = -Math.sin(diff) * 16;
      const scale = 0.72 + (Math.cos(diff) * 0.5 + 0.5) * 0.42;
      const opacity = Math.cos(diff) > -0.25 ? 1.0 : Math.max(0, 1.0 + (Math.cos(diff) + 0.25) * 4);
      const zIndex = Math.round((Math.cos(diff) + 1.0) * 50);

      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.pointerEvents = absDiff < 0.35 ? 'auto' : 'none';
    });

    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      const activeData = productsData[activeIndex];
      if (tooltipText) {
        tooltipText.textContent = `DISCOVER: ${activeData.title.toUpperCase()}`;
      }
    }

    requestAnimationFrame(updateCarousel);
  }

  requestAnimationFrame(updateCarousel);

});
