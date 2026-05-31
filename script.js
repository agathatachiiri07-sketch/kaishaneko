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

const collectionsTrack = document.querySelector("#collections .collections-track");

if (collectionsTrack) {
  const trackImages = Array.from(collectionsTrack.querySelectorAll("img"));
  let hasStarted = false;

  const startCarousel = () => {
    if (hasStarted) {
      return;
    }
    hasStarted = true;
    collectionsTrack.classList.add("is-animating");
  };

  // Fallback so the infinite loop still starts even if some load events never fire.
  const forceStartTimer = window.setTimeout(startCarousel, 2200);
  const finishCarouselSetup = () => {
    window.clearTimeout(forceStartTimer);
    startCarousel();
  };

  if (trackImages.length === 0) {
    finishCarouselSetup();
  } else {
    let pending = 0;

    trackImages.forEach((img) => {
      if (!img.complete) {
        pending += 1;
      }
    });

    if (pending === 0) {
      finishCarouselSetup();
    } else {
      const onReady = () => {
        pending -= 1;
        if (pending <= 0) {
          finishCarouselSetup();
        }
      };

      trackImages.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", onReady, { once: true });
          img.addEventListener("error", onReady, { once: true });
        }
      });
    }
  }
}

const revealTargets = [
  ".hero-copy",
  ".concept-sheet-section",
  ".pricing-wrap",
  ".size-wrap",
  ".origin-grid",
  ".faq-wrap",
  ".care-note-wrap",
  "#contact .contact-wrap",
  ".site-footer",
  ".hero-copy > *",
  ".process-columns > *",
  ".pricing-row",
  ".size-row",
  ".faq-item",
  ".origin-copy > *",
  ".origin-map-wrap",
  ".care-note-wrap > *",
  "#contact .contact-wrap > *",
].flatMap((selector) => Array.from(document.querySelectorAll(selector)));

const uniqueRevealTargets = Array.from(new Set(revealTargets));

const applyStagger = (selector, stepMs) => {
  const elements = Array.from(document.querySelectorAll(selector));
  elements.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${index * stepMs}ms`);
  });
};

applyStagger(".hero-copy > *", 110);
applyStagger(".process-columns > *", 95);
applyStagger(".pricing-row", 70);
applyStagger(".size-row", 70);
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
