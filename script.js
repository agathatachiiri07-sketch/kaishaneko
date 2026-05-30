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

  const startCarousel = () => {
    collectionsTrack.classList.add("is-animating");
  };

  if (trackImages.length === 0) {
    startCarousel();
  } else {
    let pending = 0;

    trackImages.forEach((img) => {
      if (!img.complete) {
        pending += 1;
      }
    });

    if (pending === 0) {
      startCarousel();
    } else {
      const onReady = () => {
        pending -= 1;
        if (pending <= 0) {
          startCarousel();
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

const revealTargets = document.querySelectorAll(
  ".hero-copy, .concept-sheet-section, .section, .site-footer"
);

if (revealTargets.length > 0) {
  revealTargets.forEach((el) => {
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
        threshold: 0.08,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
}
