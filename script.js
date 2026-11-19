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
  initPortfolioFilter();
  initProjectDetailModal();
  initLightbox();
  initTextRotator();
  initMotherboardEffect();
});

// =============================================
// NAVBAR - scroll effect
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
// THEME TOGGLE - light / dark
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
  if (!menuToggle || !navLinks) return;

  function setMenuOpen(isOpen) {
    menuToggle.classList.toggle('active', isOpen);
    navLinks.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = !navLinks.classList.contains('open');
    setMenuOpen(isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}

// =============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// =============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

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
// ACTIVE NAV LINK - highlight on scroll
// =============================================
function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.navbar__links a');
  if (!sections.length || !links.length) return;

  const setActiveById = (id) => {
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  const onScroll = () => {
    const scrollY = window.scrollY + 140;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
      const lastSection = sections[sections.length - 1];
      setActiveById(lastSection.getAttribute('id'));
      return;
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        setActiveById(id);
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================
// CONTACT FORM - validation + WhatsApp handoff
// =============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('contactFormStatus');
  const submitBtn = form.querySelector('.contact__submit');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const waNumber = '6282131270114';

  function showStatus(type, text, fallbackUrl) {
    if (!statusEl) return;
    statusEl.className = `form-status form-status--${type}`;
    statusEl.textContent = text;
    if (fallbackUrl) {
      statusEl.appendChild(document.createTextNode(' '));
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Buka WhatsApp secara manual.';
      link.style.textDecoration = 'underline';
      link.style.fontWeight = '700';
      statusEl.appendChild(link);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [
      { input: nameInput, label: 'Nama Lengkap' },
      { input: emailInput, label: 'Email / Instansi' },
      { input: subjectInput, label: 'Subjek' },
      { input: messageInput, label: 'Pesan' }
    ];

    const missing = fields.find(f => !f.input || !f.input.value.trim());
    if (missing) {
      showStatus('error', `Mohon lengkapi kolom ${missing.label} terlebih dahulu sebelum mengirim pesan.`);
      if (missing.input) missing.input.focus();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    const waText = `Halo Edward, saya ${name} (${email}).\n\nKeperluan: ${subject}\nPesan:\n${message}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    const originalMarkup = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Membuka WhatsApp...
    `;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showStatus('success', 'Pesan berhasil disiapkan dan diarahkan ke WhatsApp 082131270114.', waUrl);
    form.reset();

    setTimeout(() => {
      submitBtn.innerHTML = originalMarkup;
      submitBtn.disabled = false;
    }, 1200);
  });
}

// =============================================
// PORTFOLIO FILTER & SEARCH
// =============================================
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const searchInput = document.getElementById('projectSearchInput');
  const projectCards = document.querySelectorAll('#projects .project-card');
  const emptyState = document.getElementById('projectsEmptyState');
  const resetBtn = document.getElementById('resetPortfolioFilterBtn');

  if (!filterBtns.length || !projectCards.length) return;

  let activeFilter = 'all';

  function applyFilter() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
      const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);

      const title = (card.querySelector('.project-card__title')?.textContent || '').toLowerCase();
      const badge = (card.querySelector('.project-card__badge')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-card__desc')?.textContent || '').toLowerCase();
      const tags = (card.querySelector('.project-card__tags')?.textContent || '').toLowerCase();
      const matchesQuery = !query || title.includes(query) || badge.includes(query) || desc.includes(query) || tags.includes(query);

      const isMatch = matchesCategory && matchesQuery;
      card.hidden = !isMatch;
      if (isMatch) {
        card.classList.add('visible');
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach(b => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      });
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeFilter = 'all';
      if (searchInput) searchInput.value = '';
      filterBtns.forEach(b => {
        const isAll = (b.getAttribute('data-filter') === 'all');
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
      applyFilter();
      if (searchInput) searchInput.focus();
    });
  }
}

// Add spin animation for loading
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

// =============================================
// LIGHTBOX - ZOOM GAMBAR PROJECT
// =============================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const projectCards = document.querySelectorAll('.project-card__img');

  if (!lightbox || !lightboxImg || !lightboxClose) return;

  let lastFocusedTrigger = null;

  function openLightbox(img, triggerEl) {
    if (!img || !img.src) return;
    openLightboxBySrc(img.src, img.alt || 'Pratinjau proyek', triggerEl);
  }

  function openLightboxBySrc(src, alt, triggerEl) {
    if (!src) return;
    lastFocusedTrigger = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Pratinjau proyek';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  window.openProjectLightbox = openLightboxBySrc;

  function closeLightbox() {
    lightbox.classList.remove('active');
    const projectModal = document.getElementById('projectDetailModal');
    const galleryPopup = document.getElementById('galleryPopup');
    const otherModalOpen = (projectModal && projectModal.classList.contains('active')) ||
      (galleryPopup && galleryPopup.classList.contains('active'));
    document.body.style.overflow = otherModalOpen ? 'hidden' : '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightboxImg.src = '';
      }
    }, 300);
  }

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
      e.stopImmediatePropagation();
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  // Reset status aktif dan aria-expanded semua tombol
  document.querySelectorAll('button.project-card__tag')
    .forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });

  // Buka gallery yang diklik jika sebelumnya tertutup & aktifkan tombolnya
  if (!isOpen) {
    gallery.classList.add('active');
    const targetBtn = document.querySelector(`button.project-card__tag[aria-controls="${id}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
      targetBtn.setAttribute('aria-expanded', 'true');
    }
  }
}

// =============================================
// CERTIFICATE PDF MODAL
// =============================================
// Gallery popup state
let galleryImages = [];
let galleryIndex = 0;
let galleryLastTrigger = null;

function openGalleryPopup(title, images, startIndex) {
  galleryImages = Array.isArray(images) ? images : [];
  if (galleryImages.length === 0) return;

  galleryLastTrigger = document.activeElement;

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
    const closeBtn = popup.querySelector('.gallery-popup__close');
    if (closeBtn) closeBtn.focus();
  }
}

function closeGalleryPopup() {
  const popup = document.getElementById('galleryPopup');
  if (!popup) return;
  popup.classList.remove('active');
  document.body.style.overflow = '';
  if (galleryLastTrigger && typeof galleryLastTrigger.focus === 'function') {
    galleryLastTrigger.focus();
    galleryLastTrigger = null;
  }
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

  // 3. Pendidikan & Pengalaman (same circuit background as Portofolio)
  createCircuitCanvas('educationCanvas', 'pendidikan', {
    topClearY: 15,
    traceCountTarget: 26,
    densityFactor: 18,
    isProjects: true
  });
  createCircuitCanvas('experienceCanvas', 'pengalaman', {
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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (prefersReducedMotion) {
      draw(true);
    }
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

  function draw(staticOnly = false) {
    if (!staticOnly && !isVisible) {
      animId = requestAnimationFrame(() => draw(false));
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
    if (!staticOnly && !prefersReducedMotion) {
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

      animId = requestAnimationFrame(() => draw(false));
    }
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
  if (prefersReducedMotion) {
    draw(true);
  } else {
    animId = requestAnimationFrame(() => draw(false));
  }
}

// =============================================
// PROJECT DETAIL POPUP MODAL
// =============================================
const PROJECT_DETAILS = {
  famotion: {
    title: 'Mobile App Famotion',
    badge: 'Skripsi/TA',
    role: 'Mobile & Machine Learning Developer',
    image: 'assets/img/project1.png',
    imageAlt: 'Dokumentasi antarmuka aplikasi Mobile App Famotion',
    caption: 'Dokumentasi 5 layar utama aplikasi: Beranda pencarian musik, kamera Deteksi Wajah Aktif, proses analisis AI, rincian skor emosi (Neutral, Sad, Angry, Happy), dan halaman statistik Mood Tracker 7 hari terakhir.',
    overview: 'Famotion (Face Mood Emotion Detection) adalah aplikasi mobile Tugas Akhir Program Studi D3 Manajemen Informatika Politeknik Negeri Jember. Aplikasi ini dirancang untuk membantu pengguna mengenali suasana hati mereka melalui tangkapan ekspresi wajah pada kamera smartphone, lalu menyarankan musik yang selaras dengan kondisi emosi tersebut.',
    features: [
      {
        title: 'Deteksi Emosi Wajah (ResNet50 & K-NN)',
        desc: 'Mengenali 4 ekspresi emosi wajah (Happy, Sad, Angry, Neutral) secara real-time dengan mengekstraksi fitur citra menggunakan model ResNet50 dan mengklasifikasikannya dengan algoritma K-Nearest Neighbors (K-NN).'
      },
      {
        title: 'Rekomendasi Musik Multi-Sumber',
        desc: 'Menyajikan daftar lagu, artis, dan genre berdasarkan hasil deteksi emosi beserta confidence score, mendukung pemutaran langsung lewat integrasi YouTube Music maupun file musik lokal (Local Music) di perangkat.'
      },
      {
        title: 'Mood Tracker & Statistik Mingguan',
        desc: 'Merekam riwayat deteksi ekspresi wajah selama 7 hari terakhir untuk menampilkan mood dominan dan grafik distribusi persentase emosi pengguna.'
      },
      {
        title: 'Arsitektur Client-Server Terpisah',
        desc: 'Aplikasi mobile dibangun menggunakan Flutter dan Dart, berkomunikasi dengan layanan REST API Node.js dan MongoDB untuk manajemen data pengguna serta server Python Flask untuk inferensi model AI.'
      }
    ],
    extUrl: 'https://github.com/Epangssss/Famotion',
    extLabel: 'Buka Repositori GitHub'
  },
  bieplus: {
    title: 'Brilliant English+',
    badge: 'Magang',
    role: 'IT Support & Web Developer',
    image: 'assets/img/project2.png',
    imageAlt: 'Dokumentasi antarmuka website Brilliant English+',
    caption: 'Dokumentasi halaman utama Brilliant International Education Plus (BIEPLUS) yang menampilkan navigasi Program, Galeri, informasi fasilitas Camp/asrama, dan tombol Tracking Transaksi.',
    overview: 'Brilliant English+ (BIEPLUS) adalah platform web pendaftaran kursus Bahasa Inggris dan sistem manajemen hunian asrama (occupancy) di Kampung Inggris Pare. Sistem ini membantu calon siswa menelusuri program belajar, memeriksa ketersediaan camp, dan memantau transaksi pendaftaran secara daring.',
    features: [
      {
        title: 'Manajemen Hunian & Asrama (Occupancy System)',
        desc: 'Mengelola data ketersediaan kamar camp, penempatan peserta kursus, serta informasi fasilitas tempat tinggal siswa secara terpusat.'
      },
      {
        title: 'Pendaftaran Program & Self-Service Tracking',
        desc: 'Memfasilitasi pendaftaran kursus Bahasa Inggris secara daring dilengkapi fitur Tracking Transaksi agar calon siswa dapat mengecek status pembayaran dan verifikasi secara mandiri.'
      },
      {
        title: 'Perancangan Ulang Alur Kerja & Keamanan Data',
        desc: 'Menyusun ulang workflow pengelolaan data pendaftaran dan siswa pada sistem backend guna memperkuat keamanan akses serta meminimalkan risiko kebocoran data (data breach).'
      },
      {
        title: 'Pengelolaan Konten Program & Galeri',
        desc: 'Menyediakan modul informasi kurikulum, pilihan paket belajar, dan dokumentasi fasilitas kampus berbasis Laravel, Bootstrap, dan MySQL.'
      }
    ],
    extUrl: 'https://occupancy.bieplus.com/',
    extLabel: 'Buka Live Demo'
  },
  'brilliant-pare': {
    title: 'Brilliant English Pare',
    badge: 'Freelance',
    role: 'Full-Stack Web Developer',
    image: 'assets/img/project3.png',
    imageAlt: 'Dokumentasi antarmuka website Brilliant English Pare',
    caption: 'Dokumentasi halaman depan Brilliant English Pare dengan navigasi Tentang Kami, Program, Camp, Galeri, Status Transaksi, serta widget konsultasi CS WhatsApp.',
    overview: 'Brilliant English Pare adalah portal web resmi lembaga kursus Bahasa Inggris di Kampung Inggris Pare, Kabupaten Kediri. Website ini dirancang untuk menyajikan katalog program kursus, fasilitas tempat tinggal (camp), pelacakan transaksi pendaftaran, serta kanal konsultasi langsung bagi calon siswa.',
    features: [
      {
        title: 'Katalog Program Kursus & Fasilitas Camp',
        desc: 'Menampilkan rincian paket belajar Bahasa Inggris, durasi program, fasilitas asrama, dan galeri aktivitas siswa dengan tata letak yang mudah dijelajahi.'
      },
      {
        title: 'Pengecekan Status Transaksi Pendaftaran',
        desc: 'Fitur Status Transaksi pada navigasi utama yang memudahkan pendaftar memverifikasi progres administrasi dan pembayaran kursus.'
      },
      {
        title: 'Integrasi Konsultasi Customer Service',
        desc: 'Dilengkapi tombol interaktif WhatsApp CS untuk membantu calon siswa berkonsultasi mengenai pilihan program dan ketersediaan camp secara langsung.'
      },
      {
        title: 'Antarmuka Responsif Lintas Perangkat',
        desc: 'Dikembangkan menggunakan Laravel, CSS, JavaScript, Bootstrap, dan MySQL dengan performa pemuatan halaman yang ringan di perangkat mobile maupun desktop.'
      }
    ],
    extUrl: 'https://brilliantenglishpare.com/',
    extLabel: 'Buka Live Demo'
  },
  'brilliant-jerman': {
    title: 'Brilliant Kampung Inggris Jerman',
    badge: 'Magang',
    role: 'Web Developer',
    image: 'assets/img/project4.png',
    imageAlt: 'Dokumentasi antarmuka website Brilliant Kampung Inggris Jerman',
    caption: 'Dokumentasi portal Brilliant Deutsche Sprache (BIEPLUS) yang menampilkan halaman program Bahasa Jerman, menu Camp dan Galeri, serta fitur Tracking Transaksi.',
    overview: 'Brilliant Kampung Inggris Jerman (Deutsch Sprache) adalah platform web khusus program kursus Bahasa Jerman di bawah jaringan Brilliant International Education Plus. Platform ini menjembatani kebutuhan siswa yang ingin menguasai bahasa Jerman melalui kelas tatap muka di Pare maupun kelas virtual.',
    features: [
      {
        title: 'Program Belajar Kelas Offline & Online',
        desc: 'Menyediakan informasi terstruktur mengenai pilihan program Bahasa Jerman tatap muka (offline) dengan fasilitas asrama maupun kelas virtual (online).'
      },
      {
        title: 'Tracking Transaksi & Administrasi Siswa',
        desc: 'Terintegrasi dengan fitur pelacakan transaksi pendaftaran sehingga peserta dapat memantau status registrasi program Bahasa Jerman secara transparan.'
      },
      {
        title: 'Standarisasi Keamanan Alur Data',
        desc: 'Menerapkan perbaikan workflow pengelolaan data siswa pada ekosistem website BIEPLUS untuk menjaga integritas data pendaftaran.'
      },
      {
        title: 'Desain Terpadu Berbasis Laravel & MySQL',
        desc: 'Dibangun di atas arsitektur Laravel, Bootstrap, dan MySQL yang konsisten dengan identitas visual program Deutsch Sprache.'
      }
    ],
    extUrl: 'https://biepluskampunginggris.com/program/bahasa/jerman',
    extLabel: 'Buka Live Demo'
  }
};

function initProjectDetailModal() {
  const modal = document.getElementById('projectDetailModal');
  if (!modal) return;

  const badgeEl = document.getElementById('projectModalBadge');
  const roleEl = document.getElementById('projectModalRole');
  const titleEl = document.getElementById('projectModalTitle');
  const imgEl = document.getElementById('projectModalImg');
  const captionEl = document.getElementById('projectModalCaption');
  const overviewEl = document.getElementById('projectModalOverview');
  const featuresEl = document.getElementById('projectModalFeatures');
  const tagsEl = document.getElementById('projectModalTags');
  const extLinkEl = document.getElementById('projectModalExtLink');
  const extLabelEl = document.getElementById('projectModalExtLabel');
  const closeBtn = document.getElementById('projectModalClose');
  const zoomBtn = document.getElementById('projectModalZoomBtn');
  const containerEl = modal.querySelector('.project-modal__body');

  let lastTrigger = null;

  function openProjectModal(projectId, triggerEl) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    lastTrigger = triggerEl || document.activeElement;

    if (badgeEl) badgeEl.textContent = data.badge;
    if (roleEl) roleEl.textContent = data.role;
    if (titleEl) titleEl.textContent = data.title;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.imageAlt;
    }
    if (captionEl) captionEl.textContent = data.caption;
    if (overviewEl) overviewEl.textContent = data.overview;

    if (featuresEl) {
      featuresEl.innerHTML = '';
      data.features.forEach((feat) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = feat.title;
        const span = document.createElement('span');
        span.textContent = feat.desc;
        li.appendChild(strong);
        li.appendChild(span);
        featuresEl.appendChild(li);
      });
    }

    if (tagsEl) {
      const sourceCard = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
      const sourceTags = sourceCard ? sourceCard.querySelector('.project-card__tags') : null;
      tagsEl.innerHTML = sourceTags ? sourceTags.innerHTML : '';
    }

    if (extLinkEl) extLinkEl.href = data.extUrl;
    if (extLabelEl) extLabelEl.textContent = data.extLabel;
    if (containerEl) containerEl.scrollTop = 0;

    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    if (closeBtn) closeBtn.focus();
  }

  function closeProjectModal() {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.hidden = true;
      }
    }, 300);

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  // Klik atau Enter/Spasi pada card proyek untuk membuka modal detail
  const cards = document.querySelectorAll('.project-card[data-project-id]');
  cards.forEach((card) => {
    const projectId = card.getAttribute('data-project-id');
    if (!projectId) return;

    card.addEventListener('click', (e) => {
      // Jika yang diklik adalah link (GitHub / Live Demo), biarkan link terbuka tanpa membuka popup
      if (e.target.closest('a')) return;
      openProjectModal(projectId, card);
    });

    card.addEventListener('keydown', (e) => {
      // Enter atau Spasi saat fokus berada di card utama
      if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
        e.preventDefault();
        openProjectModal(projectId, card);
      }
    });
  });

  modal.querySelectorAll('[data-close-project-modal]').forEach((el) => {
    el.addEventListener('click', closeProjectModal);
  });

  if (zoomBtn && imgEl) {
    zoomBtn.addEventListener('click', () => {
      if (typeof window.openProjectLightbox === 'function') {
        window.openProjectLightbox(imgEl.src, imgEl.alt, zoomBtn);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) return;
    if (modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}


