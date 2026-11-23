"use strict";

const navigation = document.querySelector("#site-nav");
const menu = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const desktop = matchMedia("(min-width: 860px)");

function setMenu(open, focusToggle = false) {
  navigation.classList.toggle("is-open", open);
  navigation.inert = !desktop.matches && !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  if (open) navigation.querySelector("a").focus({ preventScroll: true });
  if (focusToggle) menu.focus();
}

menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") === "false"));
desktop.addEventListener("change", () => setMenu(false));
setMenu(false);
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || desktop.matches) return;
  setMenu(false);
  document.querySelector(link.hash)?.focus({ preventScroll: true });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    event.preventDefault();
    setMenu(false, true);
  }
});
document.addEventListener("pointerdown", (event) => {
  if (navigation.classList.contains("is-open") && !header.contains(event.target)) setMenu(false);
});

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("revealing");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, {threshold:0.06});
  for (const target of document.querySelectorAll("[data-reveal]")) {
    target.style.setProperty("--delay", (Number(target.dataset.revealDelay) || 0) + "ms");
    observer.observe(target);
  }
}

const hero = document.querySelector(".hero");
function updateHeader() {
  header.classList.toggle("scrolled", hero.getBoundingClientRect().bottom <= header.offsetHeight);
}
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);
updateHeader();
