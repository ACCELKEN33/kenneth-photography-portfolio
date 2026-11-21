// ===== Helper =====
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// ===== Tahun footer otomatis =====
$("#year").textContent = new Date().getFullYear();

// ===== Menu HP =====
const menuToggle = $("#menuToggle");
const nav = $("#nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
}
menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach((link) => link.addEventListener("click", () => setMenu(false)));

// ===== Header + progress bar saat scroll =====
const header = $("#siteHeader");
const progress = $("#progress");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", y > 20);
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Menu aktif sesuai bagian yang sedang dilihat =====
const navLinks = $$(".nav-link").filter((link) => !link.classList.contains("nav-contact"));
const sections = navLinks.map((link) => $(link.getAttribute("href"))).filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

// ===== Animasi muncul saat scroll =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + "ms";
  revealObserver.observe(el);
});

// ===== Angka statistik berhitung naik =====
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 900, 1);
      el.textContent = String(Math.round(target * t)).padStart(2, "0");
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => countObserver.observe(el));

// ===== Galeri: filter kategori =====
const filterButtons = $$(".filter-button");
const galleryCards = $$(".gallery-card");
const emptyNote = $("#emptyNote");

// Hitung jumlah foto per kategori otomatis
filterButtons.forEach((button) => {
  const key = button.dataset.filter;
  const total = key === "all"
    ? galleryCards.length
    : galleryCards.filter((card) => card.dataset.category === key).length;
  $(".count", button).textContent = String(total).padStart(2, "0");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    const selected = button.dataset.filter;
    let visible = 0;
    galleryCards.forEach((card) => {
      const show = selected === "all" || card.dataset.category === selected;
      card.hidden = !show;
      if (show) visible++;
    });
    emptyNote.hidden = visible > 0;
  });
});

// ===== Lightbox dengan navigasi =====
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxTitle = $("#lightboxTitle");
const lightboxCategory = $("#lightboxCategory");
const lightboxCaption = $("#lightboxCaption");
const lightboxCounter = $("#lightboxCounter");
const lightboxClose = $("#lightboxClose");

let currentList = [];
let currentIndex = 0;
let lastFocused = null;

const visibleButtons = () =>
  galleryCards.filter((card) => !card.hidden).map((card) => $(".image-button", card));

function showImage(index) {
  currentIndex = (index + currentList.length) % currentList.length;
  const btn = currentList[currentIndex];
  lightboxImage.src = btn.dataset.full;
  lightboxImage.alt = btn.dataset.title;
  lightboxTitle.textContent = btn.dataset.title;
  lightboxCategory.textContent = btn.dataset.categoryLabel;
  lightboxCaption.textContent = btn.dataset.caption || "";
  lightboxCounter.textContent =
    String(currentIndex + 1).padStart(2, "0") + " / " + String(currentList.length).padStart(2, "0");
}

function openLightbox(button) {
  currentList = visibleButtons();
  lastFocused = button;
  showImage(currentList.indexOf(button));
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

$$(".image-button").forEach((button) => button.addEventListener("click", () => openLightbox(button)));
lightboxClose.addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", () => showImage(currentIndex - 1));
$("#lightboxNext").addEventListener("click", () => showImage(currentIndex + 1));

// Tutup saat area gelap diklik
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard: Esc tutup, panah kiri/kanan pindah foto
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentIndex - 1);
  if (event.key === "ArrowRight") showImage(currentIndex + 1);
});

// Swipe di layar sentuh
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showImage(currentIndex + (dx < 0 ? 1 : -1));
}, { passive: true });

// ===== Form kontak: buka aplikasi email dengan pesan terisi =====
const contactForm = $("#contactForm");
const formError = $("#formError");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#cName").value.trim();
  const type = $("#cType").value;
  const message = $("#cMsg").value.trim();

  if (!name || !message) {
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  const subject = encodeURIComponent("Project " + type + " — " + name);
  const body = encodeURIComponent("Halo Kenneth,\n\n" + message + "\n\nJenis project: " + type + "\nSalam,\n" + name);
  window.location.href = "mailto:kennethfredericckkk3@gmail.com?subject=" + subject + "&body=" + body;
});
