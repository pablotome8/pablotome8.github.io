/**
 * Gestiona el cambio manual entre modo claro y oscuro con persistencia
 * y sincronización automática con prefers-color-scheme si no hay preferencia guardada.
 */
const initThemeToggle = () => {
  const toggleBtn = document.querySelector(".theme-toggle");
  if (!toggleBtn) return;

  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  const getStoredTheme = () => {
    try {
      const stored = localStorage.getItem("theme");
      return stored === "light" || stored === "dark" ? stored : null;
    } catch {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignorar si el almacenamiento está bloqueado
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isLight = theme === "light";
    toggleBtn.setAttribute("aria-pressed", String(isLight));
    toggleBtn.setAttribute(
      "aria-label",
      isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro",
    );
    toggleBtn.setAttribute(
      "title",
      isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro",
    );
  };

  const initialTheme =
    root.dataset.theme === "light" || root.dataset.theme === "dark"
      ? root.dataset.theme
      : getStoredTheme() || (mediaQuery.matches ? "light" : "dark");

  applyTheme(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });

  mediaQuery.addEventListener("change", (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? "light" : "dark");
    }
  });
};

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

initThemeToggle();
initScrollSpy();
