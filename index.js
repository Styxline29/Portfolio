window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');

  if (preloader) {
    requestAnimationFrame(() => preloader.classList.add('hidden'));
    setTimeout(() => preloader.remove(), 400);
  }
});

const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const yearSpan = document.getElementById('year');
const heroInteractive = document.getElementById('heroInteractive');
const heroSpotlight = document.getElementById('heroSpotlight');

const onScroll = () => {
  const scrolled = window.scrollY > 6;
  navbar?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('show', window.scrollY > 400);
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

if (burgerBtn && navMenu) {
  burgerBtn.addEventListener('click', () => {
    const isOpen = !navMenu.hasAttribute('hidden');

    if (isOpen) {
      navMenu.setAttribute('hidden', '');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    } else {
      navMenu.removeAttribute('hidden');
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Fermer le menu');
    }
  });
}

const THEME_KEY = 'pref-theme';

const setTheme = (mode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(THEME_KEY, mode);
};

(() => {
  const saved = localStorage.getItem(THEME_KEY);

  if (saved) {
    setTheme(saved);
  } else {
    const preferDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(preferDark ? 'dark' : 'light');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}

const chips = document.querySelectorAll('.chip');
const projects = document.querySelectorAll('.project');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });

    chip.classList.add('active');
    chip.setAttribute('aria-selected', 'true');

    const filter = chip.dataset.filter;

    projects.forEach((card) => {
      const tags = card.dataset.tags.split(',');
      const match = filter === 'all' || tags.includes(filter);
      card.style.display = match ? '' : 'none';
    });
  });
});

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

let lenis = null;

if (window.Lenis) {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

const scrollToTarget = (selector) => {
  const target = document.querySelector(selector);
  if (!target) return;

  const header = document.querySelector('.site-header');
  const offset = header ? header.offsetHeight + 16 : 16;

  if (lenis) {
    lenis.scrollTo(target, {
      offset: -offset,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4)
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(href);

    if (navMenu && burgerBtn && !navMenu.hasAttribute('hidden')) {
      navMenu.setAttribute('hidden', '');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    }
  });
});

backToTop?.addEventListener('click', (event) => {
  event.preventDefault();

  if (lenis) {
    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4)
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

if (heroInteractive && heroSpotlight && window.innerWidth > 992) {
  const panel = heroInteractive.querySelector('.hero-panel');
  const text = heroInteractive.querySelector('.hero-text');

  heroInteractive.addEventListener('mousemove', (event) => {
    const rect = heroInteractive.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = (x - centerX) / centerX;
    const moveY = (y - centerY) / centerY;

    heroSpotlight.style.left = `${x}px`;
    heroSpotlight.style.top = `${y}px`;

    if (panel) {
      panel.style.transform = `translate3d(${moveX * 12}px, ${moveY * 12}px, 0)`;
    }

    if (text) {
      text.style.transform = `translate3d(${moveX * -8}px, ${moveY * -8}px, 0)`;
    }
  });

  heroInteractive.addEventListener('mouseleave', () => {
    if (panel) panel.style.transform = 'translate3d(0,0,0)';
    if (text) text.style.transform = 'translate3d(0,0,0)';
  });
}

const scrollTargets = document.querySelectorAll('.scroll-animate');

const visibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  },
  {
    threshold: 0.18
  }
);

scrollTargets.forEach((item) => visibilityObserver.observe(item));

const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  if (window.innerWidth <= 992) return;

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = ((centerY - y) / centerY) * 6;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach((button) => {
  if (window.innerWidth <= 992) return;

  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});