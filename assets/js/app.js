// Contact form — AJAX submission (stay on page)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.value = "Sending…";

    const data = new FormData(contactForm);
    data.append("redirect", "false");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      let msg = document.getElementById("form-status");
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "form-status";
        msg.style.cssText = "margin-top:1rem;font-weight:500;font-size:clamp(0.85rem,1.1vw,1rem);";
        contactForm.after(msg);
      }

      if (json.success) {
        msg.style.color = "var(--secondary-color)";
        msg.textContent = "Thanks! Your message has been sent.";
        contactForm.reset();
      } else {
        msg.style.color = "#c0392b";
        msg.textContent = "Something went wrong. Please try again.";
      }
    } catch {
      const msg = document.getElementById("form-status") ?? (() => {
        const el = document.createElement("p");
        el.id = "form-status";
        el.style.cssText = "margin-top:1rem;font-weight:500;font-size:clamp(0.85rem,1.1vw,1rem);";
        contactForm.after(el);
        return el;
      })();
      msg.style.color = "#c0392b";
      msg.textContent = "Something went wrong. Please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.value = "Submit";
    }
  });
}

// Active nav + entrance animations
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const navMap = { "more-info": "about" };
const scrollWrapper = document.querySelector(".scroll-wrapper");

function getActiveSection() {
  const root = scrollWrapper || document.documentElement;
  const rootRect = root.getBoundingClientRect ? root.getBoundingClientRect() : { top: 0 };
  const rootMid = rootRect.top + root.clientHeight / 2;
  let active = sections[0];
  let closest = Infinity;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionMid = rect.top + rect.height / 2;
    const dist = Math.abs(sectionMid - rootMid);
    if (dist < closest) { closest = dist; active = section; }
  });
  return active;
}

function onScroll() {
  const active = getActiveSection();
  active.classList.add("visible");
  const id = navMap[active.id] ?? active.id;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

// Animate hero on load, listen for scroll on both containers
document.querySelector("#hero").classList.add("visible");
scrollWrapper.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Dynamic copyright year
document.getElementById("year").textContent = new Date().getFullYear();

// Burger menu toggle
const burgerMenu = document.getElementById("burger-menu");
const navMenu = document.querySelector(".navigation");

burgerMenu.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Close menu when a nav link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});
