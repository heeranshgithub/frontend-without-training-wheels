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
  tripled.forEach((slide) => appsCarousel.appendChild(createApplicationCard(slide)));

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

  processSteps.forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === idx));
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
    const nextIndex = (currentIndex + direction + totalProcessSteps) % totalProcessSteps;
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
   TESTIMONIALS CAROUSEL
   ============================================================ */
const testimonialsEl = document.getElementById("testimonialsCarousel");
const testimonialCards = testimonialsEl
  ? testimonialsEl.querySelectorAll(".testimonial-card")
  : [];
const totalTestimonialGroups = Math.ceil(testimonialCards.length / 3);
let testimonialsIdx = 0;
const dots = document.querySelectorAll(".testimonials-dots .dot");

function getCardWidth() {
  if (testimonialCards.length === 0) return 408;
  return testimonialCards[0].offsetWidth + 24;
}

function updateTestimonials() {
  if (!testimonialsEl) return;
  const stride = getCardWidth() * 3;
  testimonialsEl.style.transform = `translateX(-${testimonialsIdx * stride}px)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === testimonialsIdx));
}

window.addEventListener("resize", () => {
  updateTestimonials();
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    testimonialsIdx = parseInt(dot.dataset.idx, 10);
    updateTestimonials();
  });
});

// Auto-cycle testimonials every 5 seconds
let testimonialsTimer = setInterval(() => {
  testimonialsIdx = (testimonialsIdx + 1) % totalTestimonialGroups;
  updateTestimonials();
}, 5000);

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    clearInterval(testimonialsTimer);
    testimonialsTimer = setInterval(() => {
      testimonialsIdx = (testimonialsIdx + 1) % totalTestimonialGroups;
      updateTestimonials();
    }, 5000);
  });
});

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
