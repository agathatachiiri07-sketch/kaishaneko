const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const brandLink = document.querySelector(".brand");

if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign(`${window.location.pathname}${window.location.search}`);
  });
}


const hero = document.querySelector(".hero");
const heroImage = hero?.querySelector(".hero-visual img");

if (hero && heroImage) {
  let heroReady = false;
  const markHeroReady = () => {
    if (heroReady) return;
    heroReady = true;
    window.requestAnimationFrame(() => hero.classList.add("is-ready"));
  };

  const decodeHeroImage = () => {
    if (typeof heroImage.decode === "function") {
      heroImage.decode().catch(() => {}).then(markHeroReady);
      return;
    }
    markHeroReady();
  };

  if (heroImage.complete && heroImage.naturalWidth > 0) {
    decodeHeroImage();
  } else {
    heroImage.addEventListener("load", decodeHeroImage, { once: true });
    heroImage.addEventListener("error", markHeroReady, { once: true });
    window.setTimeout(markHeroReady, 1200);
  }
} else if (hero) {
  hero.classList.add("is-ready");
}

const revealTargets = [
  ".hero-copy",
  ".collections-editorial",
  ".concept-sheet-section",
  ".pricing-wrap",
  ".size-wrap",
  ".origin-grid",
  ".faq-wrap",
  ".care-note-wrap",
  ".site-footer",
  ".hero-copy > *",
  ".collections-item",
  ".process-columns > .process-card",
  ".pricing-row",
  ".faq-item",
  ".origin-copy > *",
  ".origin-map-wrap",
  ".care-note-wrap > *",
].flatMap((selector) => Array.from(document.querySelectorAll(selector)));

const uniqueRevealTargets = Array.from(new Set(revealTargets));

const applyStagger = (selector, stepMs) => {
  const elements = Array.from(document.querySelectorAll(selector));
  elements.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${index * stepMs}ms`);
  });
};

applyStagger(".hero-copy > *", 110);
applyStagger(".collections-item", 90);
applyStagger(".process-columns > .process-card", 95);
applyStagger(".pricing-row", 70);
applyStagger(".faq-item", 90);
applyStagger(".origin-copy > *", 85);
applyStagger(".care-note-wrap > *", 120);

if (uniqueRevealTargets.length > 0) {
  uniqueRevealTargets.forEach((el) => {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    uniqueRevealTargets.forEach((el) => observer.observe(el));
  } else {
    uniqueRevealTargets.forEach((el) => el.classList.add("is-visible"));
  }
}
