// =============================================
// Initialize Lucide Icons
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initNavbar();
  initThemeToggle();
  initMobileMenu();
  initScrollAnimations();
  initActiveLink();
  initContactForm();
  initLightbox();
  initTextRotator();
  initMotherboardEffect();
});

// =============================================
// NAVBAR — scroll effect
// =============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================
// THEME TOGGLE — light / dark
// =============================================
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');

  if (stored) {
    html.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  updateToggleIcon();

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon();
    // Trigger slide overlay animation
    document.body.classList.add('slide');
    setTimeout(() => {
      document.body.classList.remove('slide');
    }, 600);
  });
}

function updateToggleIcon() {
  const toggle = document.getElementById('themeToggle');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.innerHTML = isDark
    ? '<i data-lucide="sun" width="18" height="18"></i>'
    : '<i data-lucide="moon" width="18" height="18"></i>';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// =============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// =============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

// =============================================
// ACTIVE NAV LINK — highlight on scroll
// =============================================
function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.navbar__links a');

  const onScroll = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// =============================================
// CONTACT FORM — simple validation + feedback
// =============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.contact__submit');
    const originalText = btn.innerHTML;

    // Simulate send
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Sending...
    `;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Message sent!
      `;
      btn.style.background = '#22c55e';
      btn.style.boxShadow = '0 4px 16px rgba(34,197,94,.3)';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.boxShadow = '';
        form.reset();
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 2500);
    }, 1500);
  });
}

// Add spin animation for loading
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

// =============================================
// LIGHTBOX — ZOOM GAMBAR PROJECT
// =============================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const projectCards = document.querySelectorAll('.project-card__img');

  if (!lightbox || !lightboxImg || !lightboxClose) return;

  function openLightbox(img) {
    if (!img || !img.src) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Project Preview';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightboxImg.src = '';
      }
    }, 300);
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      openLightbox(img);
    });
  });

  // Tombol X versi biasa untuk tutup
  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Klik di luar gambar (area backdrop) untuk tutup
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Tombol Escape di keyboard untuk tutup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// =============================================
// HERO TEXT ROTATOR (Typewriter Effect)
// =============================================
function initTextRotator() {
  const rotatorEl = document.getElementById('heroRotator');
  if (!rotatorEl) return;

  const words = [
    'High-Performance IT Tech',
    'IT Support',
    'Data Analyst',
    'Web Development',
    'Mobile Development',
    'Backend Developer',
    'Networking',
    'Augmented Intelligence & Machine Learning',
    'IoT (Internet of Things)',
    'Design UI / UX'
  ];

  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      rotatorEl.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      rotatorEl.textContent = currentWord.substring(0, charIndex);
    }

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 2200; // Pause after word is fully typed
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400; // Pause before typing next word
    }

    setTimeout(type, speed);
  }

  // Initial pause before deleting first word
  setTimeout(type, 2200);
}

//ABOUT


function toggleGallery(id) {
  const gallery = document.getElementById(id);
  if (!gallery) return;
  const isOpen = gallery.classList.contains('active');

  // Tutup semua gallery
  document.querySelectorAll('.documentation-gallery')
    .forEach(item => item.classList.remove('active'));

  // Reset status aktif semua tombol
  document.querySelectorAll('button.project-card__tag')
    .forEach(btn => btn.classList.remove('active'));

  // Buka gallery yang diklik jika sebelumnya tertutup & aktifkan tombolnya
  if (!isOpen) {
    gallery.classList.add('active');
    const targetBtn = document.querySelector(`button.project-card__tag[onclick*="'${id}'"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }
  }
}

// =============================================
// CERTIFICATE PDF MODAL
// =============================================
// Gallery popup state
let galleryImages = [];
let galleryIndex = 0;

function openGalleryPopup(title, images, startIndex) {
  galleryImages = Array.isArray(images) ? images : [];
  if (galleryImages.length === 0) return;

  let idx = typeof startIndex === 'number' ? startIndex : 0;
  if (idx < 0 || idx >= galleryImages.length) {
    idx = 0;
  }
  galleryIndex = idx;

  const popup = document.getElementById('galleryPopup');
  const titleEl = document.getElementById('galleryPopupTitle');

  if (titleEl) titleEl.textContent = title;
  updateGalleryImage();

  if (popup) {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeGalleryPopup() {
  const popup = document.getElementById('galleryPopup');
  popup.classList.remove('active');
  document.body.style.overflow = '';
}

function galleryNav(direction) {
  galleryIndex += direction;

  // Wrap around
  if (galleryIndex < 0) galleryIndex = galleryImages.length - 1;
  if (galleryIndex >= galleryImages.length) galleryIndex = 0;

  updateGalleryImage();
}

function updateGalleryImage() {
  const img = document.getElementById('galleryPopupImg');
  const counter = document.getElementById('galleryCounter');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  img.src = galleryImages[galleryIndex];
  img.alt = `Gambar ${galleryIndex + 1} dari ${galleryImages.length}`;
  counter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;

  // Show/hide nav buttons based on image count
  const hasMultiple = galleryImages.length > 1;
  prevBtn.style.display = hasMultiple ? '' : 'none';
  nextBtn.style.display = hasMultiple ? '' : 'none';
  counter.style.display = hasMultiple ? '' : 'none';
}

// Keyboard controls for gallery popup
document.addEventListener('keydown', (e) => {
  const popup = document.getElementById('galleryPopup');
  if (!popup || !popup.classList.contains('active')) return;

  if (e.key === 'Escape') closeGalleryPopup();
  if (e.key === 'ArrowLeft') galleryNav(-1);
  if (e.key === 'ArrowRight') galleryNav(1);
});

// Swipe support for mobile
(function () {
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    const popup = document.getElementById('galleryPopup');
    if (popup && popup.classList.contains('active')) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const popup = document.getElementById('galleryPopup');
    if (popup && popup.classList.contains('active')) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        galleryNav(diff > 0 ? 1 : -1);
      }
    }
  }, { passive: true });
})();


// =============================================
// MOTHERBOARD / CIRCUIT BOARD CANVAS EFFECT
// =============================================
function initMotherboardEffect() {
  // 1. Hero Section (with safe zone for top navbar)
  createCircuitCanvas('motherboardCanvas', 'hero', {
    topClearY: 95,
    traceCountTarget: 24,
    densityFactor: 24
  });

  // 2. Projects Section (smartly distributed around & behind project cards)
  createCircuitCanvas('projectsCanvas', 'projects', {
    topClearY: 15,
    traceCountTarget: 58,
    densityFactor: 18,
    isProjects: true
  });
}

function createCircuitCanvas(canvasId, containerId, options = {}) {
  const canvas = document.getElementById(canvasId);
  const container = document.getElementById(containerId);
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let isVisible = false;

  const GRID = 32;
  const TOP_CLEAR_Y = options.topClearY || 0;
  const TARGET_TRACES = options.traceCountTarget || 26;
  const isProjects = options.isProjects || false;

  let traces = [];
  let pulses = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let lastWidth = 0;
  let lastHeight = 0;
  let resizeTimer = null;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function resize(force = false) {
    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;

    if (newWidth === 0 || newHeight === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Guard: Once built, never rebuild/refresh circuit traces on minor height shifts
    // (such as hero typewriter text wrapping or deleting/typing words)
    if (!force && traces.length > 0) {
      const widthDiff = Math.abs(newWidth - lastWidth);
      const heightDiff = Math.abs(newHeight - lastHeight);

      // Hero only rebuilds on true viewport width change (window resize)
      if (!isProjects && widthDiff < 25) {
        return;
      }

      // Projects only rebuilds if width changes or height changes massively (> 250px)
      if (isProjects && widthDiff < 25 && heightDiff < 250) {
        return;
      }
    }

    width = newWidth;
    height = newHeight;
    lastWidth = newWidth;
    lastHeight = newHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    buildCircuit();
  }

  function debouncedResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
    }, 150);
  }

  function buildCircuit() {
    traces = [];
    pulses = [];

    const cols = Math.floor(width / GRID);
    const rows = Math.floor(height / GRID);
    const minRow = Math.ceil(TOP_CLEAR_Y / GRID);
    if (cols < 4 || rows <= minRow) return;

    // Calculate trace count based on container height
    const availableRows = rows - minRow;
    const count = Math.min(
      TARGET_TRACES,
      Math.max(16, Math.floor((availableRows * cols) / (options.densityFactor || 22)))
    );

    const rowStep = Math.max(1, (availableRows - 2) / count);

    for (let i = 0; i < count; i++) {
      let startCol;
      if (isProjects) {
        // Smart distribution: gutters, center lane between cards, header & footer
        const zone = Math.random();
        if (zone < 0.35) {
          // Left gutter
          startCol = Math.floor(Math.random() * Math.min(8, Math.max(2, Math.floor(cols * 0.22)))) + 1;
        } else if (zone < 0.70) {
          // Right gutter
          const rightStart = Math.max(cols - 8, Math.floor(cols * 0.78));
          startCol = Math.floor(Math.random() * (cols - rightStart - 1)) + rightStart;
        } else if (zone < 0.85) {
          // Center lane between project card columns
          const mid = Math.floor(cols / 2);
          startCol = mid + Math.floor((Math.random() - 0.5) * 6);
        } else {
          // General field
          startCol = Math.floor(Math.random() * (cols - 4)) + 2;
        }
      } else {
        startCol = Math.floor(Math.random() * (cols - 4)) + 2;
      }

      startCol = clamp(startCol, 1, cols - 2);

      // Even vertical distribution across entire section height
      const baseRow = minRow + Math.floor(i * rowStep);
      const jitter = Math.floor((Math.random() - 0.5) * Math.max(1, rowStep * 0.8));
      const startRow = clamp(baseRow + jitter, minRow, rows - 2);

      createCircuitTrace(startCol * GRID, startRow * GRID, cols, rows, minRow);
    }

    // Delicate electric data pulses
    traces.forEach((trace, idx) => {
      const pCount = Math.random() < 0.65 ? 1 : 2;
      for (let p = 0; p < pCount; p++) {
        pulses.push({
          traceIdx: idx,
          dist: Math.random() * trace.totalLength,
          speed: 0.55 + Math.random() * 0.75,
          tail: 14 + Math.random() * 14
        });
      }
    });
  }

  function createCircuitTrace(startX, startY, maxCols, maxRows, minRow) {
    const points = [{ x: startX, y: startY }];
    let curX = startX;
    let curY = startY;

    const horizontal = Math.random() < 0.5;
    const signX = Math.random() < 0.5 ? 1 : -1;
    const signY = Math.random() < 0.5 ? 1 : -1;

    // Segment 1
    const len1 = (Math.floor(Math.random() * 3) + 2) * GRID;
    if (horizontal) curX += signX * len1;
    else curY += signY * len1;
    curX = clamp(curX, GRID, (maxCols - 1) * GRID);
    curY = clamp(curY, minRow * GRID, (maxRows - 1) * GRID);
    points.push({ x: curX, y: curY });

    // 45-degree chamfer bend
    curX = clamp(curX + signX * GRID, GRID, (maxCols - 1) * GRID);
    curY = clamp(curY + signY * GRID, minRow * GRID, (maxRows - 1) * GRID);
    points.push({ x: curX, y: curY });

    // Segment 2
    const len2 = (Math.floor(Math.random() * 3) + 2) * GRID;
    if (horizontal) curY += signY * len2;
    else curX += signX * len2;
    curX = clamp(curX, GRID, (maxCols - 1) * GRID);
    curY = clamp(curY, minRow * GRID, (maxRows - 1) * GRID);
    points.push({ x: curX, y: curY });

    // Optional 3rd segment for longer graceful traces
    if (Math.random() < 0.4) {
      curX = clamp(curX + signX * GRID, GRID, (maxCols - 1) * GRID);
      curY = clamp(curY + signY * GRID, minRow * GRID, (maxRows - 1) * GRID);
      points.push({ x: curX, y: curY });

      const len3 = (Math.floor(Math.random() * 2) + 2) * GRID;
      if (horizontal) curX += signX * len3;
      else curY += signY * len3;
      curX = clamp(curX, GRID, (maxCols - 1) * GRID);
      curY = clamp(curY, minRow * GRID, (maxRows - 1) * GRID);
      points.push({ x: curX, y: curY });
    }

    registerTrace(points);
  }

  function registerTrace(points) {
    if (points.length < 2) return;

    const segments = [];
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (len > 0) {
        segments.push({ p1, p2, len, startDist: totalLength });
        totalLength += len;
      }
    }

    if (totalLength > 24) {
      traces.push({
        points,
        segments,
        totalLength,
        endFlash: 0
      });
    }
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function getPointAtDist(segments, targetDist) {
    if (segments.length === 0) return { x: 0, y: 0 };
    if (targetDist <= 0) return { x: segments[0].p1.x, y: segments[0].p1.y };
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      if (targetDist <= s.startDist + s.len) {
        const t = (targetDist - s.startDist) / s.len;
        return {
          x: s.p1.x + (s.p2.x - s.p1.x) * t,
          y: s.p1.y + (s.p2.y - s.p1.y) * t
        };
      }
    }
    const last = segments[segments.length - 1];
    return { x: last.p2.x, y: last.p2.y };
  }

  function draw() {
    if (!isVisible) {
      animId = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const dark = isDark();

    // Ultra-fine, subtle, luxury palette (hairline 0.35px)
    const traceBaseColor = dark ? 'rgba(59, 130, 246, 0.045)' : 'rgba(37, 99, 235, 0.050)';
    const viaBorderColor = dark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.13)';
    const viaFillColor = dark ? 'rgba(10, 10, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)';

    // 1. Draw static traces (ultra-thin hairline: 0.35px)
    ctx.lineWidth = 0.35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    traces.forEach(trace => {
      let nearMouse = false;
      if (mouse.active && mouse.y >= TOP_CLEAR_Y) {
        for (let pt of trace.points) {
          if (Math.hypot(pt.x - mouse.x, pt.y - mouse.y) < 100) {
            nearMouse = true;
            break;
          }
        }
      }

      ctx.strokeStyle = nearMouse
        ? (dark ? 'rgba(96, 165, 250, 0.20)' : 'rgba(37, 99, 235, 0.18)')
        : traceBaseColor;

      ctx.beginPath();
      ctx.moveTo(trace.points[0].x, trace.points[0].y);
      for (let i = 1; i < trace.points.length; i++) {
        ctx.lineTo(trace.points[i].x, trace.points[i].y);
      }
      ctx.stroke();

      // Start VIA pad (delicate microscopic pinhole: 0.8px)
      drawVia(trace.points[0].x, trace.points[0].y, viaBorderColor, viaFillColor, 0.8);

      // End VIA pad
      const last = trace.points[trace.points.length - 1];
      if (trace.endFlash > 0.05) {
        ctx.save();
        ctx.shadowBlur = 3;
        ctx.shadowColor = dark ? '#38bdf8' : '#2563eb';
        drawVia(last.x, last.y, dark ? '#60a5fa' : '#2563eb', dark ? '#ffffff' : '#3b82f6', 1.1);
        ctx.restore();
        trace.endFlash *= 0.88;
      } else {
        drawVia(last.x, last.y, viaBorderColor, viaFillColor, 0.8);
      }
    });

    // 2. Draw Electric Pulses (ultra-sleek hairline pulse: 0.55px)
    pulses.forEach(pulse => {
      const trace = traces[pulse.traceIdx];
      if (!trace) return;

      let speedMult = 1;
      const head = getPointAtDist(trace.segments, pulse.dist);
      if (mouse.active && mouse.y >= TOP_CLEAR_Y && Math.hypot(head.x - mouse.x, head.y - mouse.y) < 100) {
        speedMult = 1.35;
      }

      pulse.dist += pulse.speed * speedMult;

      if (pulse.dist >= trace.totalLength) {
        pulse.dist = 0;
        trace.endFlash = 1.0;
      }

      const tailStartDist = Math.max(0, pulse.dist - pulse.tail);
      const tailHead = head;
      const tailTail = getPointAtDist(trace.segments, tailStartDist);

      ctx.save();
      const grad = ctx.createLinearGradient(tailTail.x, tailTail.y, tailHead.x, tailHead.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.7, dark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(37, 99, 235, 0.10)');
      grad.addColorStop(1, dark ? 'rgba(96, 165, 250, 0.60)' : 'rgba(37, 99, 235, 0.50)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.55;
      ctx.lineCap = 'round';

      drawPathSegment(ctx, trace.segments, tailStartDist, pulse.dist);
      ctx.stroke();

      // Glowing head spark (microscopic pinhead dot: 0.65px)
      ctx.shadowBlur = dark ? 3 : 2;
      ctx.shadowColor = dark ? '#38bdf8' : '#2563eb';
      ctx.fillStyle = dark ? '#ffffff' : '#2563eb';
      ctx.beginPath();
      ctx.arc(head.x, head.y, 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Subtle Interactive Mouse Aura (whisper-soft)
    if (mouse.active && mouse.y >= TOP_CLEAR_Y) {
      ctx.save();
      const aura = ctx.createRadialGradient(mouse.x, mouse.y, 4, mouse.x, mouse.y, 75);
      aura.addColorStop(0, dark ? 'rgba(56, 189, 248, 0.03)' : 'rgba(37, 99, 235, 0.02)');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(draw);
  }

  function drawPathSegment(ctx, segments, distA, distB) {
    ctx.beginPath();
    const pStart = getPointAtDist(segments, distA);
    ctx.moveTo(pStart.x, pStart.y);

    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      const segEnd = s.startDist + s.len;
      if (segEnd > distA && s.startDist < distB) {
        if (s.startDist >= distA) {
          ctx.lineTo(s.p1.x, s.p1.y);
        }
        if (segEnd <= distB) {
          ctx.lineTo(s.p2.x, s.p2.y);
        }
      }
    }
    const pEnd = getPointAtDist(segments, distB);
    ctx.lineTo(pEnd.x, pEnd.y);
  }

  function drawVia(x, y, strokeColor, fillColor, r = 0.8) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  }

  // Responsive observation: window resize with debounce
  window.addEventListener('resize', debouncedResize, { passive: true });
  window.addEventListener('load', () => resize(true), { passive: true });

  // Only use ResizeObserver on projects section to adapt to late image loading
  if (isProjects && window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      debouncedResize();
    });
    ro.observe(container);
  }

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  container.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  } else {
    isVisible = true;
  }

  resize();
  animId = requestAnimationFrame(draw);
}

