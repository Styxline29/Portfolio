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

const updateThemeIcon = () => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  const isDark = document.documentElement.classList.contains('dark');

  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
};

const setTheme = (mode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  updateThemeIcon();
};

setTheme('dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}

const chips = document.querySelectorAll('.chip');
const projectItems = document.querySelectorAll('.project-item');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });

    chip.classList.add('active');
    chip.setAttribute('aria-selected', 'true');

    const filter = chip.dataset.filter;

    projectItems.forEach((item) => {
      const tags = item.dataset.tags.split(',');
      const match = filter === 'all' || tags.includes(filter);
      item.style.display = match ? '' : 'none';
    });
  });
});

const skillChips = document.querySelectorAll('.skill-chip');
const skillItems = document.querySelectorAll('.skill-item');

skillChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    skillChips.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });

    chip.classList.add('active');
    chip.setAttribute('aria-selected', 'true');

    const filter = chip.dataset.skillFilter;

    skillItems.forEach((item) => {
      const tags = item.dataset.skillTags.split(',');
      const match = filter === 'all' || tags.includes(filter);
      item.style.display = match ? '' : 'none';
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

const customModal = document.getElementById('customModal');
const customModalTitle = document.getElementById('customModalTitle');
const customModalMessage = document.getElementById('customModalMessage');
const customModalConfirm = document.getElementById('customModalConfirm');
const customModalCancel = document.getElementById('customModalCancel');
const customModalClose = document.getElementById('customModalClose');
const demoUnavailableButtons = document.querySelectorAll('.demo-unavailable');

let modalResolver = null;

const openCustomModal = ({
  title = 'Information importante',
  message = '',
  confirmText = 'Continuer',
  cancelText = 'Annuler',
  showCancel = true
}) => {
  return new Promise((resolve) => {
    modalResolver = resolve;

    customModalTitle.textContent = title;
    customModalMessage.textContent = message;
    customModalConfirm.textContent = confirmText;
    customModalCancel.textContent = cancelText;
    customModalCancel.style.display = showCancel ? 'inline-flex' : 'inline-flex';

    customModal.classList.add('is-open');
    customModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (!showCancel) {
      customModalCancel.style.display = 'none';
    }
  });
};

const closeCustomModal = (result = false) => {
  customModal.classList.remove('is-open');
  customModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (modalResolver) {
    modalResolver(result);
    modalResolver = null;
  }
};

customModalConfirm?.addEventListener('click', () => closeCustomModal(true));
customModalCancel?.addEventListener('click', () => closeCustomModal(false));
customModalClose?.addEventListener('click', () => closeCustomModal(false));

customModal?.addEventListener('click', (event) => {
  if (event.target.hasAttribute('data-close-modal')) {
    closeCustomModal(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && customModal?.classList.contains('is-open')) {
    closeCustomModal(false);
  }
});

demoUnavailableButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    await openCustomModal({
      title: 'Démo en cours de déploiement',
      message:
        "La version démo est actuellement en déploiement. Merci de contacter l’administrateur du site web afin d’obtenir davantage d’informations.",
      confirmText: 'Compris',
      showCancel: false
    });

    const shouldRedirect = await openCustomModal({
      title: 'Accès au dépôt GitHub',
      message:
        "Souhaitez-vous être redirigé vers le GitHub du projet pour consulter davantage d’informations ?",
      confirmText: 'Oui, ouvrir GitHub',
      cancelText: 'Non, rester ici',
      showCancel: true
    });

    if (shouldRedirect) {
      const githubUrl = button.dataset.githubUrl || 'https://github.com/Styxline29/';
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  });
});

const modalButtons = document.querySelectorAll('.modal-btn');

modalButtons.forEach((button) => {
  if (!button.querySelector('span')) {
    button.innerHTML = `<span>${button.innerHTML}</span>`;
  }

  if (window.innerWidth > 992) {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  }

  button.addEventListener('click', (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.className = 'modal-btn-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
});

const skillsTimeline = document.getElementById('skillsTimeline');
const skillsTimelineProgress = document.getElementById('skillsTimelineProgress');
const skillsTimelineItems = document.querySelectorAll('.skills-timeline-item');

const updateSkillsTimelineProgress = () => {
  if (!skillsTimeline || !skillsTimelineProgress) return;

  const rect = skillsTimeline.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const visibleDistance = Math.min(Math.max(viewportHeight - rect.top, 0), rect.height);
  const progress = rect.height > 0 ? visibleDistance / rect.height : 0;

  skillsTimelineProgress.style.height = `${Math.max(0, Math.min(progress, 1)) * 100}%`;
};

const skillsTimelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  }
);

skillsTimelineItems.forEach((item) => skillsTimelineObserver.observe(item));

window.addEventListener('scroll', updateSkillsTimelineProgress, { passive: true });
window.addEventListener('resize', updateSkillsTimelineProgress);
window.addEventListener('load', updateSkillsTimelineProgress);
updateSkillsTimelineProgress();