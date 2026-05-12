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
