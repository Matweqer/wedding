const weddingDate = new Date("2026-08-09T17:00:00");

const countdownNodes = {
  days: {
    value: document.querySelector('[data-countdown="days"]'),
    label: document.querySelector('[data-countdown="days"]').nextElementSibling,
    forms: ["день", "дня", "дней"],
  },
  hours: {
    value: document.querySelector('[data-countdown="hours"]'),
    label: document.querySelector('[data-countdown="hours"]').nextElementSibling,
    forms: ["час", "часа", "часов"],
  },
  minutes: {
    value: document.querySelector('[data-countdown="minutes"]'),
    label: document.querySelector('[data-countdown="minutes"]').nextElementSibling,
    forms: ["минута", "минуты", "минут"],
  },
  seconds: {
    value: document.querySelector('[data-countdown="seconds"]'),
    label: document.querySelector('[data-countdown="seconds"]').nextElementSibling,
    forms: ["секунда", "секунды", "секунд"],
  },
};

function getPluralForm(value, forms) {
  const lastTwoDigits = Math.abs(value) % 100;
  const lastDigit = Math.abs(value) % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }

  return forms[2];
}

function setCountdownItem(name, value, shouldPad = true) {
  const node = countdownNodes[name];
  node.value.textContent = shouldPad ? String(value).padStart(2, "0") : value;
  node.label.textContent = getPluralForm(value, node.forms);
}

function updateCountdown() {
  const now = new Date();
  const distance = Math.max(weddingDate.getTime() - now.getTime(), 0);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  setCountdownItem("days", days, false);
  setCountdownItem("hours", hours);
  setCountdownItem("minutes", minutes);
  setCountdownItem("seconds", seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const hero = document.querySelector(".hero");

function updateHeroParallax() {
  if (!hero) return;
  const offset = Math.min(window.scrollY * 0.18, 90);
  hero.style.setProperty("--hero-offset", `${offset}px`);
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });

const galleryImages = Array.from(document.querySelectorAll(".gallery-card img")).map(
  (image) => ({
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  })
);

const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector(".modal__image");
const modalClose = document.querySelector(".modal__close");
const modalPrev = document.querySelector(".modal__nav--prev");
const modalNext = document.querySelector(".modal__nav--next");
let activeGalleryIndex = 0;

function renderModalImage() {
  const image = galleryImages[activeGalleryIndex];
  modalImage.src = image.src;
  modalImage.alt = image.alt;
}

function openModal(index) {
  activeGalleryIndex = index;
  renderModalImage();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  modalImage.src = "";
  document.body.style.overflow = "";
}

function showNextImage() {
  activeGalleryIndex = (activeGalleryIndex + 1) % galleryImages.length;
  renderModalImage();
}

function showPrevImage() {
  activeGalleryIndex =
    (activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  renderModalImage();
}

document.querySelectorAll(".gallery-card").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(Number(button.dataset.galleryIndex));
  });
});

modalClose.addEventListener("click", closeModal);
modalNext.addEventListener("click", showNextImage);
modalPrev.addEventListener("click", showPrevImage);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;

  if (event.key === "Escape") {
    closeModal();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "ArrowLeft") {
    showPrevImage();
  }
});
