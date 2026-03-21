/* ============================================================
   HERO IMAGE CAROUSEL
   ============================================================ */
const heroImages = [
  "https://www.figma.com/api/mcp/asset/17ad64bd-4dc3-439b-9d2e-78514d583bbd",
  "assets/images/hero-carousel-01-industrial-piping-570.jpg",
  "assets/images/hero-carousel-02-manufacturing-floor-570.jpg",
  "assets/images/hero-carousel-03-pipe-coils-570.jpg",
  "assets/images/hero-carousel-04-construction-site-570.jpg",
  "assets/images/hero-carousel-05-engineering-lab-570.jpg",
];

let heroIndex = 0;
const heroImg = document.getElementById('heroImg');
const thumbContainer = document.getElementById('heroThumbs');
const thumbs = thumbContainer ? thumbContainer.querySelectorAll('.hero-thumb') : [];

thumbs.forEach((thumb, i) => {
  if (heroImages[i]) {
    thumb.style.backgroundImage = `url('${heroImages[i]}')`;
  }
  thumb.addEventListener('click', () => setHero(i));
});

function setHero(idx) {
  heroIndex = (idx + heroImages.length) % heroImages.length;
  if (heroImg) heroImg.src = heroImages[heroIndex];
  thumbs.forEach((t, i) => t.classList.toggle('active', i === heroIndex));
}

const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
if (heroPrev) heroPrev.addEventListener('click', () => setHero(heroIndex - 1));
if (heroNext) heroNext.addEventListener('click', () => setHero(heroIndex + 1));

// Auto-cycle hero every 4 seconds
let heroTimer = setInterval(() => setHero(heroIndex + 1), 4000);
if (heroPrev) heroPrev.addEventListener('click', () => { clearInterval(heroTimer); heroTimer = setInterval(() => setHero(heroIndex + 1), 4000); });
if (heroNext) heroNext.addEventListener('click', () => { clearInterval(heroTimer); heroTimer = setInterval(() => setHero(heroIndex + 1), 4000); });


/* ============================================================
   FAQ ACCORDION
   ============================================================ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    faqItems.forEach(i => i.classList.remove('active'));
    if (!isOpen) item.classList.add('active');
  });
});


/* ============================================================
   APPLICATIONS CAROUSEL
   ============================================================ */
const appsCarousel = document.getElementById('appsCarousel');
const appsCards = appsCarousel ? appsCarousel.querySelectorAll('.app-card') : [];
const cardStep = 424; // 400px card + 24px gap
let appsIdx = 0;
const maxAppsIdx = Math.max(0, appsCards.length - 3);

function updateApps() {
  if (!appsCarousel) return;
  appsCarousel.style.transform = `translateX(-${appsIdx * cardStep}px)`;
  const prevBtn = document.getElementById('appsPrev');
  const nextBtn = document.getElementById('appsNext');
  if (prevBtn) prevBtn.disabled = appsIdx === 0;
  if (nextBtn) nextBtn.disabled = appsIdx >= maxAppsIdx;
}

const appsPrevBtn = document.getElementById('appsPrev');
const appsNextBtn = document.getElementById('appsNext');
if (appsPrevBtn) appsPrevBtn.addEventListener('click', () => { appsIdx = Math.max(0, appsIdx - 1); updateApps(); });
if (appsNextBtn) appsNextBtn.addEventListener('click', () => { appsIdx = Math.min(maxAppsIdx, appsIdx + 1); updateApps(); });
updateApps();


/* ============================================================
   MANUFACTURING PROCESS TABS
   ============================================================ */
const processSteps = document.querySelectorAll('.process-step');
const processPanels = document.querySelectorAll('.process-panel');

processSteps.forEach(step => {
  step.addEventListener('click', () => {
    const idx = step.dataset.step;

    processSteps.forEach(s => s.classList.remove('active'));
    processPanels.forEach(p => p.classList.remove('active'));

    step.classList.add('active');
    const panel = document.querySelector(`.process-panel[data-panel="${idx}"]`);
    if (panel) panel.classList.add('active');
  });
});


/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
const testimonialsEl = document.getElementById('testimonialsCarousel');
const testimonialCards = testimonialsEl ? testimonialsEl.querySelectorAll('.testimonial-card') : [];
const totalTestimonialGroups = Math.ceil(testimonialCards.length / 3);
let testimonialsIdx = 0;
const dots = document.querySelectorAll('.testimonials-dots .dot');

function getCardWidth() {
  if (testimonialCards.length === 0) return 408;
  return testimonialCards[0].offsetWidth + 24;
}

function updateTestimonials() {
  if (!testimonialsEl) return;
  const stride = getCardWidth() * 3;
  testimonialsEl.style.transform = `translateX(-${testimonialsIdx * stride}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === testimonialsIdx));
}

window.addEventListener('resize', () => {
  updateTestimonials();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    testimonialsIdx = parseInt(dot.dataset.idx, 10);
    updateTestimonials();
  });
});

// Auto-cycle testimonials every 5 seconds
let testimonialsTimer = setInterval(() => {
  testimonialsIdx = (testimonialsIdx + 1) % totalTestimonialGroups;
  updateTestimonials();
}, 5000);

dots.forEach(dot => {
  dot.addEventListener('click', () => {
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
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,.10)';
  } else {
    navbar.style.boxShadow = '0 4px 16px rgba(88,92,95,.06)';
  }
}, { passive: true });


/* ============================================================
   SMOOTH SCROLL FOR NAV BUTTONS
   ============================================================ */
document.querySelectorAll('button.nav-btn, button.nav-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const text = btn.textContent.trim().toLowerCase();
    const map = {
      'about us': null,
      'products': '#products',
      'contact us': '#contact',
    };
    const target = map[text];
    if (target) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ============================================================
   DOWNLOAD BUTTON — prevent default navigation
   ============================================================ */
document.querySelectorAll('.resource-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const name = link.closest('.resource-row')?.querySelector('span')?.textContent || 'document';
    alert(`Downloading: ${name}\n(This is a demo — no actual file is attached.)`);
  });
});
