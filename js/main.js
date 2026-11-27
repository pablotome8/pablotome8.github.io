/**
 * Sincroniza `aria-current="location"` en la navegación según la sección visible.
 */
const initScrollSpy = () => {
  const headerEl = document.querySelector(".site-header");
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  const navLinks = new Map(
    Array.from(document.querySelectorAll('.nav-link[href^="#"]'), (link) => [
      link.getAttribute("href").slice(1),
      link,
    ]),
  );

  if (sections.length === 0 || navLinks.size === 0) return;

  const setCurrentSection = (id) => {
    navLinks.forEach((link, key) => {
      if (key === id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateCurrentSection = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 24
    ) {
      setCurrentSection(sections[sections.length - 1].id);
      return;
    }

    const headerHeight = headerEl ? headerEl.offsetHeight : 70;
    const thresholdY = headerHeight + 96;
    let activeId = sections[0].id;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= thresholdY) {
        activeId = section.id;
      }
    }

    setCurrentSection(activeId);
  };

  let ticking = false;
  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateCurrentSection();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  updateCurrentSection();
};

initScrollSpy();
