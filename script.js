/* ============================================================
   HERO IMAGE CAROUSEL
   ============================================================ */
const heroImages = [
  "assets/images/hero-carousel-00.png",
  "assets/images/hero-carousel-01.jpg",
  "assets/images/hero-carousel-02.jpg",
  "assets/images/hero-carousel-03.jpg",
  "assets/images/hero-carousel-04.jpg",
  "assets/images/hero-carousel-05.jpg",
];

let heroIndex = 0;
const heroImg = document.getElementById("heroImg");
const thumbContainer = document.getElementById("heroThumbs");
const thumbs = thumbContainer
  ? thumbContainer.querySelectorAll(".hero-thumb")
  : [];

thumbs.forEach((thumb, i) => {
  if (heroImages[i]) {
    thumb.style.backgroundImage = `url('${heroImages[i]}')`;
  }
  thumb.addEventListener("click", () => setHero(i));
});

function setHero(idx) {
  heroIndex = (idx + heroImages.length) % heroImages.length;
  if (heroImg) heroImg.src = heroImages[heroIndex];
  thumbs.forEach((t, i) => t.classList.toggle("active", i === heroIndex));
}

const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
if (heroPrev) heroPrev.addEventListener("click", () => setHero(heroIndex - 1));
if (heroNext) heroNext.addEventListener("click", () => setHero(heroIndex + 1));

// Auto-cycle hero every 4 seconds
let heroTimer = setInterval(() => setHero(heroIndex + 1), 4000);
if (heroPrev)
  heroPrev.addEventListener("click", () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => setHero(heroIndex + 1), 4000);
  });
if (heroNext)
  heroNext.addEventListener("click", () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => setHero(heroIndex + 1), 4000);
  });

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const btn = item.querySelector(".faq-question");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");
    faqItems.forEach((i) => i.classList.remove("active"));
    if (!isOpen) item.classList.add("active");
  });
});

/* ============================================================
   APPLICATIONS CAROUSEL (infinite loop, starts at middle)
   ============================================================ */
const appsCarousel = document.getElementById("appsCarousel");
const APPS_TRANSITION_MS = 400;

/** One logical slide; repeated APPLICATION_LOOP times, then tripled in DOM for infinite scroll */
const APPLICATION_SLIDE = {
  image: "assets/images/application-fishnet.jpg",
  title: "Fishnet Manufacturing",
  description:
    "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.",
};

const APPLICATION_LOOP = 6;

const applicationBaseSlides = Array.from({ length: APPLICATION_LOOP }, () => ({
  ...APPLICATION_SLIDE,
}));

let applicationBaseCount = 0;
let appsCarouselIndex = 0;
let appsCarouselBusy = false;

function createApplicationCard(slide) {
  const card = document.createElement("div");
  card.className = "app-card";
  const img = document.createElement("img");
  img.className = "app-card-bg";
  img.src = slide.image;
  img.alt = slide.title;
  const overlay = document.createElement("div");
  overlay.className = "app-card-overlay";
  const text = document.createElement("div");
  text.className = "app-card-text";
  const h3 = document.createElement("h3");
  h3.textContent = slide.title;
  const p = document.createElement("p");
  p.textContent = slide.description;
  text.append(h3, p);
  card.append(img, overlay, text);
  return card;
}

function getAppsStep() {
  if (!appsCarousel) return 436;
  const first = appsCarousel.querySelector(".app-card");
  if (!first) return 436;
  const gap = parseFloat(getComputedStyle(appsCarousel).columnGap || "0");
  return first.offsetWidth + gap;
}

function applyAppsTranslate(instant) {
  if (!appsCarousel) return;
  const step = getAppsStep();
  const x = appsCarouselIndex * step;
  if (instant) {
    appsCarousel.style.transition = "none";
  } else {
    appsCarousel.style.transition = "";
  }
  appsCarousel.style.transform = `translateX(-${x}px)`;
  if (instant) {
    void appsCarousel.offsetHeight;
    appsCarousel.style.transition = "";
  }
}

function finishAppsMove(onComplete) {
  if (!appsCarousel) return;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    onComplete();
  };
  const t = window.setTimeout(run, APPS_TRANSITION_MS + 80);
  function onEnd(e) {
    if (e.propertyName !== "transform") return;
    appsCarousel.removeEventListener("transitionend", onEnd);
    window.clearTimeout(t);
    run();
  }
  appsCarousel.addEventListener("transitionend", onEnd);
}

function initApplicationsCarousel() {
  if (!appsCarousel) return;
  applicationBaseCount = applicationBaseSlides.length;
  if (applicationBaseCount === 0) return;

  const tripled = [
    ...applicationBaseSlides,
    ...applicationBaseSlides,
    ...applicationBaseSlides,
  ];
  appsCarousel.replaceChildren();
  tripled.forEach((slide) =>
    appsCarousel.appendChild(createApplicationCard(slide)),
  );

  appsCarouselIndex = applicationBaseCount;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => applyAppsTranslate(true));
  });
}

function goAppsPrev() {
  if (appsCarouselBusy || !appsCarousel || applicationBaseCount === 0) return;
  const n = applicationBaseCount;
  appsCarouselBusy = true;
  appsCarouselIndex -= 1;
  applyAppsTranslate(false);
  finishAppsMove(() => {
    if (appsCarouselIndex < n) {
      appsCarouselIndex += n;
      applyAppsTranslate(true);
    }
    appsCarouselBusy = false;
  });
}

function goAppsNext() {
  if (appsCarouselBusy || !appsCarousel || applicationBaseCount === 0) return;
  const n = applicationBaseCount;
  appsCarouselBusy = true;
  appsCarouselIndex += 1;
  applyAppsTranslate(false);
  finishAppsMove(() => {
    if (appsCarouselIndex >= 2 * n) {
      appsCarouselIndex -= n;
      applyAppsTranslate(true);
    }
    appsCarouselBusy = false;
  });
}

initApplicationsCarousel();

const appsPrevBtn = document.getElementById("appsPrev");
const appsNextBtn = document.getElementById("appsNext");
if (appsPrevBtn) {
  appsPrevBtn.disabled = false;
  appsPrevBtn.addEventListener("click", goAppsPrev);
}
if (appsNextBtn) {
  appsNextBtn.disabled = false;
  appsNextBtn.addEventListener("click", goAppsNext);
}
window.addEventListener("resize", () => {
  if (!appsCarousel || applicationBaseCount === 0) return;
  appsCarouselBusy = false;
  applyAppsTranslate(true);
});

/* ============================================================
   MANUFACTURING PROCESS TABS
   ============================================================ */
const processSteps = document.querySelectorAll(".process-step");
const processPanels = document.querySelectorAll(".process-panel");

function setProcessStep(stepIndex) {
  const idx = Number(stepIndex);
  if (Number.isNaN(idx)) return;

  processSteps.forEach((s) =>
    s.classList.toggle("active", Number(s.dataset.step) === idx),
  );
  processPanels.forEach((p) =>
    p.classList.toggle("active", Number(p.dataset.panel) === idx),
  );
}

processSteps.forEach((step) => {
  step.addEventListener("click", () => {
    setProcessStep(step.dataset.step);
  });
});

const totalProcessSteps = processSteps.length;
const processArrowIcon = "assets/svgs/arrow.svg";

processPanels.forEach((panel) => {
  const panelImage = panel.querySelector(".panel-image");
  if (!panelImage || panelImage.querySelector(".process-image-nav")) return;

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "process-image-nav process-image-nav-prev";
  prevBtn.setAttribute("aria-label", "Previous process step");
  prevBtn.dataset.direction = "-1";
  prevBtn.innerHTML = `<img src="${processArrowIcon}" alt="" aria-hidden="true" />`;

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "process-image-nav process-image-nav-next";
  nextBtn.setAttribute("aria-label", "Next process step");
  nextBtn.dataset.direction = "1";
  nextBtn.innerHTML = `<img src="${processArrowIcon}" alt="" aria-hidden="true" />`;

  panelImage.append(prevBtn, nextBtn);
});

document.querySelectorAll(".process-image-nav").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (totalProcessSteps === 0) return;
    const current = document.querySelector(".process-step.active");
    const currentIndex = Number(current?.dataset.step || "0");
    const direction = Number(btn.dataset.direction || "0");
    const nextIndex =
      (currentIndex + direction + totalProcessSteps) % totalProcessSteps;
    setProcessStep(nextIndex);
  });
});

/** Connector line: only between centers of first and last pills (no overhang). */
function updateProcessStepsConnectorLine() {
  const row = document.getElementById("processSteps");
  const line = row?.querySelector(".process-line-bg");
  const steps = row?.querySelectorAll(".process-step");
  if (!row || !line || !steps || steps.length < 2) return;
  const first = steps[0];
  const last = steps[steps.length - 1];
  const start = first.offsetLeft + first.offsetWidth / 2;
  const end = last.offsetLeft + last.offsetWidth / 2;
  line.style.left = `${start}px`;
  line.style.width = `${Math.max(0, end - start)}px`;
}

updateProcessStepsConnectorLine();
requestAnimationFrame(() => updateProcessStepsConnectorLine());
window.addEventListener("resize", updateProcessStepsConnectorLine);
if (document.fonts?.ready) {
  document.fonts.ready.then(() => updateProcessStepsConnectorLine());
}

/* ============================================================
   TESTIMONIALS — infinite carousel, auto-advance only (3s)
   ============================================================ */
(function initTestimonialsCarousel() {
  const testimonialsEl = document.getElementById("testimonialsCarousel");
  const testimonialsWrap = document.getElementById("testimonialsWrap");
  if (!testimonialsEl || !testimonialsWrap) return;

  const originals = Array.from(
    testimonialsEl.querySelectorAll(".testimonial-card"),
  );
  const count = originals.length;
  if (count === 0) return;

  const prependFrag = document.createDocumentFragment();
  originals.forEach((card) => {
    prependFrag.appendChild(card.cloneNode(true));
  });
  testimonialsEl.prepend(prependFrag);

  const appendFrag = document.createDocumentFragment();
  originals.forEach((card) => {
    appendFrag.appendChild(card.cloneNode(true));
  });
  testimonialsEl.appendChild(appendFrag);

  const cards = () => testimonialsEl.querySelectorAll(".testimonial-card");
  const middleSetStart = count;

  function getSetWidth() {
    const c = cards();
    if (c.length < middleSetStart + 1) return 0;
    return c[middleSetStart].offsetLeft - c[0].offsetLeft;
  }

  function getStride() {
    const c = cards();
    if (!c.length) return 408;
    const gap = parseFloat(getComputedStyle(testimonialsEl).gap) || 24;
    return c[0].offsetWidth + gap;
  }

  function normalizeScroll() {
    const setWidth = getSetWidth();
    if (setWidth <= 0) return;
    const min = setWidth * 0.5;
    const max = setWidth * 1.5;
    if (testimonialsWrap.scrollLeft < min) {
      testimonialsWrap.scrollLeft += setWidth;
    } else if (testimonialsWrap.scrollLeft > max) {
      testimonialsWrap.scrollLeft -= setWidth;
    }
  }

  function centerInitialCard() {
    const c = cards();
    if (!c.length) return;
    const card = c[middleSetStart + Math.floor(count / 2)];
    testimonialsWrap.scrollLeft =
      card.offsetLeft + card.offsetWidth / 2 - testimonialsWrap.clientWidth / 2;
  }

  function advanceTestimonials() {
    testimonialsWrap.scrollBy({ left: getStride(), behavior: "smooth" });
  }

  const testimonialsTimer = setInterval(advanceTestimonials, 3000);

  testimonialsWrap.addEventListener(
    "scroll",
    () => {
      normalizeScroll();
    },
    { passive: true },
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      centerInitialCard();
      normalizeScroll();
    });
  });

  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        centerInitialCard();
        normalizeScroll();
      }, 120);
    },
    { passive: true },
  );
})();

/* ============================================================
   NAVBAR SCROLL SHADOW
   ============================================================ */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    if (!navbar) return;
    if (window.scrollY > 10) {
      navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,.10)";
    } else {
      navbar.style.boxShadow = "0 4px 16px rgba(88,92,95,.06)";
    }
  },
  { passive: true },
);

/* ============================================================
   SMOOTH SCROLL FOR NAV BUTTONS
   ============================================================ */
document.querySelectorAll("button.nav-btn, button.nav-cta").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const text = btn.textContent.trim().toLowerCase();
    const map = {
      "about us": null,
      products: "#products",
      "contact us": "#contact",
    };
    const target = map[text];
    if (target) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ============================================================
   DATASHEET MODAL
   ============================================================ */
const datasheetModal = document.getElementById("datasheetModal");
const openDatasheetModalBtn = document.getElementById("openDatasheetModalBtn");
const closeDatasheetModalBtn = document.getElementById("closeDatasheetModalBtn");
const datasheetEmailInput = document.getElementById("datasheetEmail");
const datasheetModalForm = datasheetModal?.querySelector(".datasheet-modal-form");
const datasheetSubmitBtn = datasheetModalForm?.querySelector('button[type="submit"]');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function syncDatasheetSubmitState() {
  if (!datasheetSubmitBtn || !datasheetEmailInput) return;
  datasheetSubmitBtn.disabled = !isValidEmail(datasheetEmailInput.value);
}

function openDatasheetModal() {
  if (!datasheetModal) return;
  datasheetModal.classList.add("is-open");
  datasheetModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  syncDatasheetSubmitState();
  window.setTimeout(() => datasheetEmailInput?.focus(), 50);
}

function closeDatasheetModal() {
  if (!datasheetModal) return;
  datasheetModal.classList.remove("is-open");
  datasheetModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (openDatasheetModalBtn) {
  openDatasheetModalBtn.addEventListener("click", openDatasheetModal);
}

if (closeDatasheetModalBtn) {
  closeDatasheetModalBtn.addEventListener("click", closeDatasheetModal);
}

if (datasheetModal) {
  datasheetModal.addEventListener("click", (e) => {
    if (e.target === datasheetModal) {
      closeDatasheetModal();
    }
  });
}

if (datasheetEmailInput) {
  datasheetEmailInput.addEventListener("input", syncDatasheetSubmitState);
}

if (datasheetModalForm) {
  datasheetModalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    closeDatasheetModal();
  });
}

/* ============================================================
   REQUEST CALLBACK MODAL (Request a Quote)
   ============================================================ */
const callbackModal = document.getElementById("callbackModal");
const openCallbackModalBtn = document.getElementById("openCallbackModalBtn");
const closeCallbackModalBtn = document.getElementById("closeCallbackModalBtn");
const callbackModalForm = document.getElementById("callbackModalForm");
const callbackFullNameInput = document.getElementById("callbackFullName");

function openCallbackModal() {
  if (!callbackModal) return;
  callbackModal.classList.add("is-open");
  callbackModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => callbackFullNameInput?.focus(), 50);
}

function closeCallbackModal() {
  if (!callbackModal) return;
  callbackModal.classList.remove("is-open");
  callbackModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (openCallbackModalBtn) {
  openCallbackModalBtn.addEventListener("click", openCallbackModal);
}

if (closeCallbackModalBtn) {
  closeCallbackModalBtn.addEventListener("click", closeCallbackModal);
}

if (callbackModal) {
  callbackModal.addEventListener("click", (e) => {
    if (e.target === callbackModal) {
      closeCallbackModal();
    }
  });
}

if (callbackModalForm) {
  callbackModalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    closeCallbackModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (callbackModal?.classList.contains("is-open")) {
    closeCallbackModal();
    return;
  }
  if (datasheetModal?.classList.contains("is-open")) {
    closeDatasheetModal();
  }
});

/* ============================================================
   DOWNLOAD BUTTON — prevent default navigation
   ============================================================ */
document.querySelectorAll(".resource-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const name =
      link.closest(".resource-row")?.querySelector("span")?.textContent ||
      "document";
    alert(
      `Downloading: ${name}\n(This is a demo — no actual file is attached.)`,
    );
  });
});
