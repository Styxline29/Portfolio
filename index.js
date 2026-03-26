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
const hero3d = document.getElementById('hero3d');

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

  navMenu.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navMenu.setAttribute('hidden', '');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
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

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (hero3d && window.innerWidth > 992) {
  const frontLayer = hero3d.querySelector('.hero-layer-front');
  const backLayer = hero3d.querySelector('.hero-layer-back');

  hero3d.addEventListener('mousemove', (event) => {
    const rect = hero3d.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = ((centerY - y) / centerY) * 5;

    hero3d.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    if (frontLayer) {
      frontLayer.style.transform = `translateZ(40px) translateX(${rotateY * 1.8}px) translateY(${rotateX * -1.8}px)`;
    }

    if (backLayer) {
      backLayer.style.transform = `translateZ(10px) translateX(${rotateY * 1.1}px) translateY(${rotateX * -1.1}px)`;
    }
  });

  hero3d.addEventListener('mouseleave', () => {
    hero3d.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';

    if (frontLayer) {
      frontLayer.style.transform = 'translateZ(40px)';
    }

    if (backLayer) {
      backLayer.style.transform = 'translateZ(10px)';
    }
  });
}

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