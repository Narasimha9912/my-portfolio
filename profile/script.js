
"use strict";

// ==================================
// 1. Mobile navigation menu
// ==================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after clicking a navigation link.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// ==================================
// 2. Reveal sections while scrolling
// ==================================

const revealElements = document.querySelectorAll(".reveal");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Fallback for older browsers and reduced-motion preferences.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// ==================================
// 3. Back-to-top button
// ==================================

const backToTop = document.getElementById("back-to-top");

function updateBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });
});

// ==================================
// 4. Automatically update footer year
// ==================================

document.getElementById("year").textContent =
  new Date().getFullYear();

// ==================================
// 5. Contact form opens email application
// ==================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// IMPORTANT: Replace this with your actual email address.
const portfolioEmail = "your.email@example.com";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const senderEmail = document
    .getElementById("visitor-email")
    .value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !senderEmail || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  if (portfolioEmail === "your.email@example.com") {
    formStatus.textContent =
      "Please replace the placeholder email in script.js " +
      "with your real email address before using the contact form.";
    return;
  }

  const subject = `Portfolio contact from ${name}`;

  const body =
    `Name: ${name}\n` +
    `Email: ${senderEmail}\n\n` +
    `Message:\n${message}`;

  const mailtoUrl =
    `mailto:${portfolioEmail}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  formStatus.textContent =
    "Opening your email application. Please send the message there.";

  window.location.href = mailtoUrl;
});
