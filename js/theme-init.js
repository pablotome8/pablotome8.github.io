(() => {
  let theme = null;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      theme = stored;
    }
  } catch {
    // localStorage no disponible en modo restringido
  }

  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  document.documentElement.dataset.theme = theme;
})();
