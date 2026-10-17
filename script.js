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
