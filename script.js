
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


 // ==================================
 // 5. Contact form submission
 // ==================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.textContent = "Submitting your message...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      formStatus.textContent =
        "Thank you! Your message was submitted successfully.";
      contactForm.reset();
    } else {
      const result = await response.json().catch(() => ({}));
      formStatus.textContent =
        result.errors?.map((error) => error.message).join(" ") ||
        "Submission failed. Please check your form setup and try again.";
    }
  } catch (error) {
    formStatus.textContent =
      "Could not connect. Check your internet connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});
