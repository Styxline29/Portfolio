window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    requestAnimationFrame(() => preloader.classList.add('hidden'));
    setTimeout(() => preloader.remove(), 400);
  }
});

const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');

const onScroll = () => {
  const scrolled = window.scrollY > 6;
  navbar?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('show', window.scrollY > 400);
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');

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

  navMenu.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      navMenu.setAttribute('hidden', '');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    }
  });
}

const THEME_KEY = 'pref-theme';
const themeToggle = document.getElementById('themeToggle');

const setTheme = (mode) => {
  const root = document.documentElement;

  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

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
    chips.forEach((c) => {
      c.classList.remove('active');
      c.setAttribute('aria-selected', 'false');
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

const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}