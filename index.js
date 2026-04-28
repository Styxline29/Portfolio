window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");

  if (preloader) {
    requestAnimationFrame(() => preloader.classList.add("hidden"));
    setTimeout(() => preloader.remove(), 400);
  }
});

const navbar = document.querySelector(".main-navbar");
const backToTop = document.getElementById("backToTop");
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const yearSpan = document.getElementById("year");
const heroInteractive = document.getElementById("heroInteractive");
const heroSpotlight = document.getElementById("heroSpotlight");
const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const languageCurrentLabel = document.getElementById("languageCurrentLabel");
const languageOptions = document.querySelectorAll(
  ".language-option, .mobile-language-option",
);
const formLanguageInput = document.getElementById("formLanguage");

let currentTranslations = null;
let currentLanguage = "fr";

const onScroll = () => {
  const scrolled = window.scrollY > 6;
  navbar?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("show", window.scrollY > 400);
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", onScroll);

const updateNavbarActiveLink = () => {
  const sections = [
    { id: "top", selector: ".hero" },
    { id: "projets", selector: "#projets" },
    { id: "competences", selector: "#competences" },
    { id: "experience", selector: "#experience" },
    { id: "contact", selector: "#contact" },
  ];

  let current = "top";
  const offset = (navbar?.offsetHeight || 0) + 120;

  sections.forEach((section) => {
    const el = document.querySelector(section.selector);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY + offset >= top) current = section.id;
  });

  document.querySelectorAll(".portfolio-navbar__link").forEach((link) => {
    const href = link.getAttribute("href");
    const isActive = href === "#top" ? current === "top" : href === `#${current}`;
    link.classList.toggle("is-active", isActive);
  });
};

window.addEventListener("scroll", updateNavbarActiveLink, { passive: true });
window.addEventListener("load", updateNavbarActiveLink);

if (burgerBtn && navMenu) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = !navMenu.hasAttribute("hidden");

    if (isOpen) {
      navMenu.setAttribute("hidden", "");
      burgerBtn.setAttribute("aria-expanded", "false");
      burgerBtn.setAttribute(
        "aria-label",
        currentTranslations?.aria?.burgerOpen || "Open menu",
      );
    } else {
      navMenu.removeAttribute("hidden");
      burgerBtn.setAttribute("aria-expanded", "true");
      burgerBtn.setAttribute(
        "aria-label",
        currentTranslations?.aria?.burgerClose || "Close menu",
      );
    }
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024 && navMenu && burgerBtn) {
    navMenu.setAttribute("hidden", "");
    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.setAttribute(
      "aria-label",
      currentTranslations?.aria?.burgerOpen || "Open menu",
    );
  }
});

const updateThemeIcon = () => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  const isDark = document.documentElement.classList.contains("dark");

  if (icon) {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
};

const setTheme = (mode) => {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  updateThemeIcon();
};

setTheme("dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
}

const chips = document.querySelectorAll(".chip");
const projectItems = document.querySelectorAll(".project-item");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    chip.classList.add("active");
    chip.setAttribute("aria-selected", "true");

    const filter = chip.dataset.filter;

    projectItems.forEach((item) => {
      const tags = item.dataset.tags.split(",");
      const match = filter === "all" || tags.includes(filter);
      item.style.display = match ? "" : "none";
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
    smoothTouch: false,
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

  const header = document.querySelector(".site-header");
  const offset = header ? header.offsetHeight + 16 : 16;

  if (lenis) {
    lenis.scrollTo(target, {
      offset: -offset,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(href);

    if (navMenu && burgerBtn && !navMenu.hasAttribute("hidden")) {
      navMenu.setAttribute("hidden", "");
      burgerBtn.setAttribute("aria-expanded", "false");
      burgerBtn.setAttribute(
        "aria-label",
        currentTranslations?.aria?.burgerOpen || "Open menu",
      );
    }
  });
});

backToTop?.addEventListener("click", (event) => {
  event.preventDefault();

  if (lenis) {
    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

if (heroInteractive && heroSpotlight && window.innerWidth > 992) {
  const panel = heroInteractive.querySelector(".hero-panel");
  const text = heroInteractive.querySelector(".hero-text");

  heroInteractive.addEventListener("mousemove", (event) => {
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

  heroInteractive.addEventListener("mouseleave", () => {
    if (panel) panel.style.transform = "translate3d(0,0,0)";
    if (text) text.style.transform = "translate3d(0,0,0)";
  });
}

const scrollTargets = document.querySelectorAll(".scroll-animate");

const visibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
  },
);

scrollTargets.forEach((item) => visibilityObserver.observe(item));

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  if (window.innerWidth <= 992) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = ((centerY - y) / centerY) * 6;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

const magneticButtons = document.querySelectorAll(".magnetic-btn");

magneticButtons.forEach((button) => {
  if (window.innerWidth <= 992) return;

  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const LANGUAGE_STORAGE_KEY = "site-language";
const DEFAULT_LANGUAGE = "fr";
const LANGUAGE_CACHE_VERSION = "20260331-3";
let translationRefreshTimers = [];
let isLanguageSwitching = false;

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
};

const setHTML = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.innerHTML = value;
  }
};

const setAttr = (selector, attr, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.setAttribute(attr, value);
  }
};

const setAllText = (selector, values = []) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (typeof values[index] === "string") {
      element.textContent = values[index];
    }
  });
};

const setTextWithLeadingIcon = (element, text) => {
  if (!element || typeof text !== "string") return;
  const icon = element.querySelector("i");
  element.textContent = "";
  if (icon) {
    element.appendChild(icon);
    element.append(` ${text}`);
  } else {
    element.textContent = text;
  }
};

const setTimelineContent = (listElement, items = []) => {
  if (!listElement) return;

  const cards = listElement.querySelectorAll(".timeline-card");
  cards.forEach((card, index) => {
    const entry = items[index];
    if (!entry) return;

    const [tag, title, description] = entry;
    const tagEl = card.querySelector(".timeline-card-tag");
    const titleEl = card.querySelector("h3");
    const descEl = card.querySelector("p");

    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
  });
};

const setProjectContent = (items = []) => {
  const cards = document.querySelectorAll("#projectsGrid .project-item");
  cards.forEach((item, index) => {
    const content = items[index];
    if (!content) return;

    const img = item.querySelector(".project-image");
    const title = item.querySelector("h3");
    const desc = item.querySelector("p");
    const code = item.querySelector(".project-code");
    const demo = item.querySelector(".project-link");

    if (img) img.alt = content.imageAlt;
    if (title) title.textContent = content.title;
    if (desc) desc.textContent = content.description;
    if (code) setTextWithLeadingIcon(code, content.code);
    if (demo) demo.textContent = content.demo;
  });
};

const setExperienceContent = (translations) => {
  const cards = document.querySelectorAll(".experience-grid .experience-card");
  translations.cards.forEach((cardData, index) => {
    const card = cards[index];
    if (!card) return;

    const badge = card.querySelector(".experience-badge");
    const type = card.querySelector(".experience-type");
    const title = card.querySelector("h3");
    const desc = card.querySelector("p");
    const tags = card.querySelectorAll(".experience-tags span");

    if (badge) badge.textContent = cardData.badge;
    if (type) type.textContent = cardData.type;
    if (title) title.textContent = cardData.title;
    if (desc) desc.textContent = cardData.description;
    tags.forEach((tag, tagIndex) => {
      if (cardData.tags[tagIndex]) tag.textContent = cardData.tags[tagIndex];
    });
  });

  const highlights = document.querySelectorAll(
    ".experience-bottom-grid .experience-highlight-card",
  );
  translations.highlights.forEach((highlightData, index) => {
    const card = highlights[index];
    if (!card) return;
    const title = card.querySelector("h3");
    const desc = card.querySelector("p");
    if (title) title.textContent = highlightData.title;
    if (desc) desc.textContent = highlightData.description;
  });

  const contactCard = document.querySelector(".experience-contact-card");
  if (contactCard) {
    setText(".experience-contact-kicker", translations.contactCard.kicker);
    setText(".experience-contact-head h3", translations.contactCard.title);
    setText(".experience-contact-pill", translations.contactCard.pill);
    setText(
      ".experience-contact-card > p",
      translations.contactCard.description,
    );

    document
      .querySelectorAll(".experience-points span")
      .forEach((point, index) => {
        const icon = point.querySelector("i");
        point.textContent = "";
        if (icon) point.appendChild(icon);
        point.append(` ${translations.contactCard.points[index] || ""}`);
      });
  }
};

const updateLanguageButtons = (lang, label) => {
  if (languageCurrentLabel) {
    languageCurrentLabel.textContent = label;
  }

  languageOptions.forEach((option) => {
    option.classList.toggle("is-active", option.dataset.lang === lang);
  });
};

const renderFooter = (translations) => {
  const footerParagraph = document.querySelector(".footer p");
  if (!footerParagraph) return;

  footerParagraph.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> • Styxaether — <a href="https://github.com/Styxline29/" target="_blank" rel="noreferrer noopener">GitHub</a> • <a href="#top">${translations.footer.backToTop}</a>`;
};

const applyTranslations = (translations) => {
  if (!translations) return;

  currentTranslations = translations;
  document.documentElement.lang = translations.documentLang;
  document.title = translations.meta.title;

  setAttr('meta[name="description"]', "content", translations.meta.description);
  setAttr('meta[property="og:title"]', "content", translations.meta.ogTitle);
  setAttr(
    'meta[property="og:description"]',
    "content",
    translations.meta.ogDescription,
  );

  setAttr(".main-navbar", "aria-label", translations.aria.mainNav);
  setAttr(
    "#burgerBtn",
    "aria-label",
    navMenu?.hasAttribute("hidden")
      ? translations.aria.burgerOpen
      : translations.aria.burgerClose,
  );
  setAttr("#themeToggle", "aria-label", translations.aria.themeToggle);
  setAttr("#languageToggle", "aria-label", translations.aria.languageToggle);
  setAttr(".hero", "aria-label", translations.aria.heroSection);
  setAttr(".filters", "aria-label", translations.aria.projectsFilter);
  setAttr("#backToTop", "aria-label", translations.aria.backToTop);
  setAttr("#contactToastClose", "aria-label", translations.aria.toastClose);
  setAttr("#customModalClose", "aria-label", translations.aria.modalClose);

  setAllText(".nav-links.left span", [
    translations.nav.projects,
    translations.nav.skills,
  ]);
  setAllText(".nav-links.right span", [
    translations.nav.experience,
    translations.nav.contact,
  ]);
  setText(".cv-btn span", translations.nav.cv);
  setAllText("#navMenu > a", [
    translations.nav.projects,
    translations.nav.skills,
    translations.nav.experience,
    translations.nav.contactMobile,
  ]);
  setText(".mobile-language-title", translations.nav.language);

  setText(".hero-kicker", translations.hero.kicker);
  setHTML(".hero-text h1", translations.hero.titleHtml);
  setText(".hero-description", translations.hero.description);
  document
    .querySelectorAll(".hero-badges .interactive-chip")
    .forEach((chip, index) => {
      setTextWithLeadingIcon(chip, translations.hero.badges[index] || "");
    });
  document.querySelectorAll(".hero-cta a").forEach((link, index) => {
    setTextWithLeadingIcon(
      link,
      index === 0
        ? translations.hero.ctaProjects
        : translations.hero.ctaContact,
    );
  });
  setAttr(".hero-photo", "alt", translations.hero.photoAlt);
  document.querySelectorAll(".floating-card").forEach((button, index) => {
    const label = translations.hero.floating[index] || "";
    const icon = button.querySelector("i");
    button.textContent = "";
    if (icon) button.appendChild(icon);
    const span = document.createElement("span");
    span.textContent = label;
    button.appendChild(span);
  });

  setTextWithLeadingIcon(
    document.querySelector("#titre-projets"),
    translations.projects.title,
  );
  setText("#projets .section-header p", translations.projects.description);
  setAllText(".filters .chip", translations.projects.filters);
  setProjectContent(translations.projects.items);

  setTextWithLeadingIcon(
    document.querySelector("#titre-competences"),
    translations.skills.title,
  );
  setText("#competences .section-header p", translations.skills.description);
  document
    .querySelectorAll(".skills-group-title span")
    .forEach((span, index) => {
      setTextWithLeadingIcon(
        span,
        index === 0
          ? translations.skills.hardTitle
          : translations.skills.softTitle,
      );
    });
  const skillsLists = document.querySelectorAll(
    "#competences .skills-timeline-list",
  );
  setTimelineContent(skillsLists[0], translations.skills.hard);
  setTimelineContent(skillsLists[1], translations.skills.soft);

  setTextWithLeadingIcon(
    document.querySelector("#titre-experience"),
    translations.experience.title,
  );
  setText(".experience-kicker", translations.experience.kicker);
  setText(".experience-subtitle", translations.experience.subtitle);
  setExperienceContent(translations.experience);

  setTextWithLeadingIcon(
    document.querySelector("#titre-contact"),
    translations.contact.title,
  );
  setText("#contact .section-header p", translations.contact.description);
  setAllText("#contact .form-row label", [
    translations.contact.labels.name,
    translations.contact.labels.email,
    translations.contact.labels.message,
  ]);
  setAttr("#name", "placeholder", translations.contact.placeholders.name);
  setAttr("#email", "placeholder", translations.contact.placeholders.email);
  setAttr("#message", "placeholder", translations.contact.placeholders.message);
  if (!contactSubmitBtn?.classList.contains("loading")) {
    setText("#submitBtn span", translations.contact.submit);
  }
  if (formLanguageInput) {
    formLanguageInput.value = translations.contact.formspreeLang;
  }

  renderFooter(translations);

  setText(".custom-modal-badge span", translations.modal.badge);
  if (!customModal?.classList.contains("is-open")) {
    setText("#customModalTitle", translations.modal.defaultTitle);
  }
  setText("#customModalCancel span", translations.modal.cancel);
  setText("#customModalConfirm span", translations.modal.continue);

  setText(".toast-notification__eyebrow", translations.toast.eyebrow);
  setText(".toast-notification__content h4", translations.toast.title);
  setText(".toast-notification__content p", translations.toast.description);

  updateLanguageButtons(currentLanguage, translations.languageLabel);
};

const scheduleTranslationRefresh = () => {
  if (!currentTranslations) return;

  translationRefreshTimers.forEach((timer) => clearTimeout(timer));
  translationRefreshTimers = [];

  [0, 60, 180, 360].forEach((delay) => {
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        applyTranslations(currentTranslations);
      });
    }, delay);
    translationRefreshTimers.push(timer);
  });
};

const loadTranslations = async (lang) => {
  const response = await fetch(
    `./config/lang/${lang}.json?v=${LANGUAGE_CACHE_VERSION}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load language file: ${lang}`);
  }

  return response.json();
};

const setLanguage = async (lang) => {
  if (isLanguageSwitching) return;
  isLanguageSwitching = true;

  try {
    const normalizedLang = ["en", "fr", "es", "zh"].includes(lang)
      ? lang
      : DEFAULT_LANGUAGE;
    const translations = await loadTranslations(normalizedLang);
    currentLanguage = normalizedLang;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLang);
    applyTranslations(translations);
    scheduleTranslationRefresh();
  } catch (error) {
    console.error("Language loading error:", error);

    if (lang !== DEFAULT_LANGUAGE) {
      const fallbackTranslations = await loadTranslations(DEFAULT_LANGUAGE);
      currentLanguage = DEFAULT_LANGUAGE;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
      applyTranslations(fallbackTranslations);
      scheduleTranslationRefresh();
    }
  } finally {
    isLanguageSwitching = false;
  }
};

const closeLanguageMenu = () => {
  if (!languageMenu || !languageToggle) return;
  languageMenu.setAttribute("hidden", "");
  languageToggle.classList.remove("is-open");
  languageToggle.setAttribute("aria-expanded", "false");
};

const openLanguageMenu = () => {
  if (!languageMenu || !languageToggle) return;
  languageMenu.removeAttribute("hidden");
  languageToggle.classList.add("is-open");
  languageToggle.setAttribute("aria-expanded", "true");
};

languageToggle?.addEventListener("click", () => {
  const isOpen = !languageMenu.hasAttribute("hidden");
  if (isOpen) {
    closeLanguageMenu();
  } else {
    openLanguageMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!languageToggle || !languageMenu) return;
  if (!languageToggle.parentElement?.contains(event.target)) {
    closeLanguageMenu();
  }
});

languageOptions.forEach((option) => {
  option.addEventListener("click", async () => {
    const nextLang = option.dataset.lang || DEFAULT_LANGUAGE;
    await setLanguage(nextLang);
    closeLanguageMenu();
  });
});

window.addEventListener("pageshow", () => {
  if (currentTranslations) {
    scheduleTranslationRefresh();
  }
});

/* =========================
   MODALE PROJETS
   ========================= */
const customModal = document.getElementById("customModal");
const customModalTitle = document.getElementById("customModalTitle");
const customModalMessage = document.getElementById("customModalMessage");
const customModalConfirm = document.getElementById("customModalConfirm");
const customModalCancel = document.getElementById("customModalCancel");
const customModalClose = document.getElementById("customModalClose");
const demoUnavailableButtons = document.querySelectorAll(".demo-unavailable");

let modalResolver = null;
let modalIsTransitioning = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getButtonLabel = (button) => {
  if (!button) return null;

  let span = button.querySelector("span");

  if (!span) {
    span = document.createElement("span");
    span.textContent = button.textContent.trim();
    button.innerHTML = "";
    button.appendChild(span);
  }

  return span;
};

const resetModalButtonState = () => {
  [customModalConfirm, customModalCancel].forEach((button) => {
    if (!button) return;

    button.style.transform = "translate(0, 0)";
    button
      .querySelectorAll(".modal-btn-ripple")
      .forEach((ripple) => ripple.remove());
  });
};

const setModalButtonText = (button, text) => {
  const span = getButtonLabel(button);
  if (span) span.textContent = text;
};

const openCustomModal = async ({
  title,
  message = "",
  confirmText,
  cancelText,
  showCancel = true,
}) => {
  while (modalIsTransitioning) {
    await wait(20);
  }

  if (!customModal) return false;

  modalIsTransitioning = true;

  resetModalButtonState();

  customModalTitle.textContent =
    title ||
    currentTranslations?.modal?.defaultTitle ||
    "Important information";
  customModalMessage.textContent = message;

  setModalButtonText(
    customModalConfirm,
    confirmText || currentTranslations?.modal?.continue || "Continue",
  );
  setModalButtonText(
    customModalCancel,
    cancelText || currentTranslations?.modal?.cancel || "Cancel",
  );

  customModalCancel.style.display = showCancel ? "inline-flex" : "none";

  customModal.classList.remove("is-open");
  customModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  await wait(30);

  return new Promise((resolve) => {
    modalResolver = resolve;

    requestAnimationFrame(() => {
      customModal.classList.add("is-open");
      customModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      modalIsTransitioning = false;
    });
  });
};

const closeCustomModal = async (result = false) => {
  if (!customModal || modalIsTransitioning) return;

  modalIsTransitioning = true;

  customModal.classList.remove("is-open");
  customModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  resetModalButtonState();

  await wait(220);

  if (modalResolver) {
    modalResolver(result);
    modalResolver = null;
  }

  modalIsTransitioning = false;
};

customModalConfirm?.addEventListener("click", () => {
  closeCustomModal(true);
});

customModalCancel?.addEventListener("click", () => {
  closeCustomModal(false);
});

customModalClose?.addEventListener("click", () => {
  closeCustomModal(false);
});

customModal?.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeCustomModal(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && customModal?.classList.contains("is-open")) {
    closeCustomModal(false);
  }
});

demoUnavailableButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const firstStep = await openCustomModal({
      title: currentTranslations?.modal?.deployTitle,
      message: currentTranslations?.modal?.deployMessage || "",
      confirmText: currentTranslations?.modal?.deployConfirm,
      showCancel: false,
    });

    if (firstStep === false || firstStep === true) {
      await wait(80);
    }

    const shouldRedirect = await openCustomModal({
      title: currentTranslations?.modal?.githubTitle,
      message: currentTranslations?.modal?.githubMessage || "",
      confirmText: currentTranslations?.modal?.githubConfirm,
      cancelText: currentTranslations?.modal?.githubCancel,
      showCancel: true,
    });

    if (shouldRedirect) {
      const githubUrl =
        button.dataset.githubUrl || "https://github.com/Styxline29/";
      window.open(githubUrl, "_blank", "noopener,noreferrer");
    }
  });
});

const modalButtons = document.querySelectorAll(".modal-btn");

modalButtons.forEach((button) => {
  getButtonLabel(button);

  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.className = "modal-btn-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  });
});

/* =========================
   TIMELINE COMPÉTENCES
   ========================= */
const skillsTimelineSection = document.querySelector(
  ".skills-timeline-section",
);
const skillsTimelineFill = document.getElementById("skillsTimelineFill");

const updateSkillsTimelineFill = () => {
  if (!skillsTimelineSection || !skillsTimelineFill) return;

  const rect = skillsTimelineSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const start = viewportHeight * 0.18;
  const end = viewportHeight * 0.82;

  const rawProgress = (end - rect.top) / (rect.height + (end - start));
  const progress = Math.max(0, Math.min(1, rawProgress));

  skillsTimelineFill.style.height = `${progress * 100}%`;
};

window.addEventListener("scroll", updateSkillsTimelineFill, { passive: true });
window.addEventListener("resize", updateSkillsTimelineFill);
window.addEventListener("load", updateSkillsTimelineFill);
updateSkillsTimelineFill();

/* =========================
   FORMULAIRE CONTACT
   ========================= */
const contactForm = document.getElementById("contactForm");
const contactNameInput = document.getElementById("name");
const contactSubjectInput = document.getElementById("contactSubject");
const contactSubmitBtn = document.getElementById("submitBtn");
const contactToast = document.getElementById("contactToast");
const contactToastClose = document.getElementById("contactToastClose");

let contactToastTimer = null;

const showContactToast = () => {
  if (!contactToast) return;

  contactToast.classList.remove("show");

  if (contactToastTimer) {
    clearTimeout(contactToastTimer);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      contactToast.classList.add("show");
    });
  });

  contactToastTimer = setTimeout(() => {
    contactToast.classList.remove("show");
    contactToastTimer = null;
  }, 4200);
};

const hideContactToast = () => {
  if (!contactToast) return;

  contactToast.classList.remove("show");

  if (contactToastTimer) {
    clearTimeout(contactToastTimer);
    contactToastTimer = null;
  }
};

contactToastClose?.addEventListener("click", hideContactToast);

if (
  contactForm &&
  contactNameInput &&
  contactSubjectInput &&
  contactSubmitBtn
) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameValue = contactNameInput.value.trim();
    contactSubjectInput.value = nameValue
      ? `${currentTranslations?.contact?.subjectPrefix || "Contact request -"} ${nameValue}`
      : currentTranslations?.contact?.subjectFallback || "Contact request";

    contactSubmitBtn.classList.add("loading");
    contactSubmitBtn.disabled = true;

    const label = contactSubmitBtn.querySelector("span");

    if (label) {
      label.textContent = currentTranslations?.contact?.sending || "Sending...";
    }

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.reset();
        showContactToast();

        if (label) {
          label.textContent = currentTranslations?.contact?.sent || "Sent ✔️";
        }

        setTimeout(() => {
          contactSubmitBtn.classList.remove("loading");
          contactSubmitBtn.disabled = false;

          if (label) {
            label.textContent = currentTranslations?.contact?.submit || "Send";
          }
        }, 1200);
      } else {
        throw new Error("Formspree error");
      }
    } catch (error) {
      contactSubmitBtn.classList.remove("loading");
      contactSubmitBtn.disabled = false;

      if (label) {
        label.textContent = currentTranslations?.contact?.submit || "Send";
      }

      alert(
        currentTranslations?.contact?.error ||
          "An error occurred while sending. Please try again.",
      );
    }
  });
}

(async () => {
  const savedLanguage =
    localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
  await setLanguage(savedLanguage);
})();


/* =========================================================
   Background visible au scroll
   ========================================================= */
const updateBackgroundVisibility = () => {
  document.body.classList.toggle("background-faded", window.scrollY > 90);
};

window.addEventListener("scroll", updateBackgroundVisibility, { passive: true });
window.addEventListener("load", updateBackgroundVisibility);


/* =========================================================
   NAVBAR : DISPARAÎT PENDANT LE SCROLL, RÉAPPARAÎT À L'ARRÊT
   ========================================================= */

const siteHeaderAutoHide = document.querySelector(".site-header");
let navbarScrollTimer = null;

const hideNavbarWhileScrolling = () => {
  if (!siteHeaderAutoHide) return;

  siteHeaderAutoHide.classList.add("navbar-hidden-while-scroll");
  siteHeaderAutoHide.classList.remove("navbar-visible-after-scroll");

  clearTimeout(navbarScrollTimer);

  navbarScrollTimer = setTimeout(() => {
    siteHeaderAutoHide.classList.remove("navbar-hidden-while-scroll");
    siteHeaderAutoHide.classList.add("navbar-visible-after-scroll");
  }, 260);
};

window.addEventListener("scroll", hideNavbarWhileScrolling, { passive: true });
window.addEventListener("load", () => {
  siteHeaderAutoHide?.classList.add("navbar-visible-after-scroll");
});


/* Scroll to top when clicking logo */
document.querySelector(".logo")?.addEventListener("click", function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


/* =========================================================
   RETOUR COMPLET TOUT EN HAUT AU CLIC SUR STYXAETHER
   Utilise un listener en capture pour passer avant les autres
   scripts de navigation interne.
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {
    const logoLink = event.target.closest(".logo");

    if (!logoLink) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Enlève le hash éventuel pour éviter que le navigateur garde un offset.
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const scrollToAbsoluteTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToAbsoluteTop();

    // Sécurité : certains scripts de scroll smooth peuvent réappliquer un offset.
    setTimeout(scrollToAbsoluteTop, 120);
    setTimeout(scrollToAbsoluteTop, 320);
    setTimeout(scrollToAbsoluteTop, 650);
  },
  true
);


/* =========================================================
   FIX RÉEL : LOGO + FOOTER "HAUT DE PAGE" REMONTENT À 0
   ========================================================= */
(function () {
  const forceTop = () => {
    // Stoppe un éventuel hash offset
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    // Sécurités pour scripts smooth scroll / navigateur
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 180);

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 520);
  };

  document.addEventListener("click", function (event) {
    const target = event.target.closest(
      '.logo, [data-scroll-top="true"], a[href="#top"], a[href="#pageTop"], a[href="#"], .back-to-top'
    );

    if (!target) return;

    const text = (target.textContent || "").trim().toLowerCase();
    const isTopLink =
      target.classList.contains("logo") ||
      target.classList.contains("back-to-top") ||
      target.dataset.scrollTop === "true" ||
      target.getAttribute("href") === "#top" ||
      target.getAttribute("href") === "#pageTop" ||
      text.includes("haut de page");

    if (!isTopLink) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    forceTop();
  }, true);
})();




/* =========================================================
   MENU MOBILE CLEAN - SANS FERMETURE AU SCROLL
   ========================================================= */

const mobileMenuCloseClean = document.getElementById("mobileMenuClose");
const mobileThemeToggleClean = document.getElementById("mobileThemeToggle");

const closeMobileMenuClean = () => {
  const navMenu = document.getElementById("navMenu");
  const burgerBtn = document.getElementById("burgerBtn");

  if (navMenu && !navMenu.hasAttribute("hidden")) {
    navMenu.setAttribute("hidden", "");
    burgerBtn?.setAttribute("aria-expanded", "false");
  }
};

mobileMenuCloseClean?.addEventListener("click", closeMobileMenuClean);

mobileThemeToggleClean?.addEventListener("click", () => {
  document.getElementById("themeToggle")?.click();

  const icon = mobileThemeToggleClean.querySelector("i");
  const isDark = document.documentElement.classList.contains("dark");

  if (icon) {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
});

document.querySelectorAll(".mobile-language-option").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLang = button.dataset.lang;

    if (typeof setLanguage === "function") {
      setLanguage(selectedLang);
    } else if (typeof loadLanguage === "function") {
      loadLanguage(selectedLang);
    } else {
      localStorage.setItem("site-language", selectedLang);
      window.location.reload();
    }

    document.querySelectorAll(".mobile-language-option").forEach((option) => {
      option.classList.toggle("is-active", option.dataset.lang === selectedLang);
    });

    closeMobileMenuClean();
  });
});

/* On ferme le menu uniquement quand on clique sur un lien, PAS au scroll. */
document.querySelectorAll("#navMenu a[href^='#']").forEach((link) => {
  link.addEventListener("click", closeMobileMenuClean);
});

window.addEventListener("load", () => {
  const currentLang = localStorage.getItem("site-language") || "fr";

  document.querySelectorAll(".mobile-language-option").forEach((option) => {
    option.classList.toggle("is-active", option.dataset.lang === currentLang);
  });

  const icon = mobileThemeToggleClean?.querySelector("i");
  const isDark = document.documentElement.classList.contains("dark");

  if (icon) {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenuClean();
  }
});

/* Important : le burger reste ouvert pendant le scroll sur mobile/tablette. */
