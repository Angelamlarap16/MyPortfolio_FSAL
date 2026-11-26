/* ==========================================================================
   Inicialización principal del portafolio
   Se ejecuta tras cargar el DOM gracias al atributo defer en index.html
   ========================================================================== */

(function () {
  "use strict";

  const THEME_STORAGE_KEY = "portfolio-theme";
  const MOBILE_BREAKPOINT = 860;

  const THEME_ICONS = {
    dark: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path></svg>',
    light: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
  };

  /**
   * Obtiene los datos centralizados del portafolio si están disponibles.
   * @returns {object|null}
   */
  function getPortfolioData() {
    if (typeof window.PORTFOLIO_DATA === "object" && window.PORTFOLIO_DATA !== null) {
      return window.PORTFOLIO_DATA;
    }
    return null;
  }

  /**
   * Lee una preferencia de tema guardada sin interrumpir el sitio si localStorage falla.
   * @returns {"dark"|"light"}
   */
  function readStoredTheme() {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (error) {
      // Se ignora el error en entornos con almacenamiento restringido
    }
    return "dark";
  }

  /**
   * Guarda el tema elegido en localStorage de forma segura.
   * @param {"dark"|"light"} theme
   */
  function saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Se continúa operando en memoria aunque falle el almacenamiento
    }
  }

  /**
   * Aplica el tema al documento y actualiza el icono y etiqueta accesible del botón.
   * @param {"dark"|"light"} theme
   * @param {HTMLButtonElement|null} toggleButton
   */
  function applyTheme(theme, toggleButton) {
    const isLight = theme === "light";
    document.documentElement.setAttribute("data-theme", theme);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", isLight ? "#F7F4ED" : "#161A18");
    }

    if (!toggleButton) {
      return;
    }

    const nextActionLabel = isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
    toggleButton.setAttribute("aria-label", nextActionLabel);
    toggleButton.setAttribute("title", nextActionLabel);

    const iconContainer = toggleButton.querySelector(".theme-icon");
    if (iconContainer) {
      iconContainer.innerHTML = isLight ? THEME_ICONS.light : THEME_ICONS.dark;
    }
  }

  /**
   * Inicializa el selector de tema claro/oscuro.
   */
  function initThemeToggle() {
    const toggleButton = document.getElementById("theme-toggle");
    let currentTheme = readStoredTheme();

    applyTheme(currentTheme, toggleButton);

    if (!toggleButton) {
      return;
    }

    toggleButton.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme, toggleButton);
      saveTheme(currentTheme);
    });
  }

  /**
   * Inicializa el menú móvil con accesibilidad por teclado y cierre controlado.
   */
  function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-principal");

    if (!menuToggle || !nav) {
      return;
    }

    const navLinks = nav.querySelectorAll(".nav-link");

    function setMenuState(isOpen, restoreFocus) {
      nav.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );

      if (!isOpen && restoreFocus) {
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isExpanded, false);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          setMenuState(false, false);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenuState(false, true);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT && nav.classList.contains("is-open")) {
        setMenuState(false, false);
      }
    });
  }

  /**
   * Marca en la navegación la sección visible actualmente.
   */
  function initActiveSectionIndicator() {
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    if (navLinks.length === 0) {
      return;
    }

    const sectionEntries = navLinks
      .map(function (link) {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) {
          return null;
        }
        const section = document.getElementById(href.slice(1));
        return section ? { link: link, section: section } : null;
      })
      .filter(Boolean);

    if (sectionEntries.length === 0) {
      return;
    }

    function setActiveLink(activeId) {
      sectionEntries.forEach(function (entry) {
        const isMatch = entry.section.id === activeId;
        entry.link.classList.toggle("is-active", isMatch);
        if (isMatch) {
          entry.link.setAttribute("aria-current", "location");
        } else {
          entry.link.removeAttribute("aria-current");
        }
      });
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        const visibleEntries = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visibleEntries.length > 0) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6]
      }
    );

    sectionEntries.forEach(function (entry) {
      observer.observe(entry.section);
    });
  }

  /**
   * Muestra la fotografía de portada si existe y es válida;
   * en caso contrario mantiene la composición tipográfica con iniciales.
   * @param {object|null} data
   */
  function initHeroMedia(data) {
    const frame = document.getElementById("hero-frame");
    const monogram = document.getElementById("hero-monogram");
    const imagePath = data && data.profile && data.profile.heroImage;

    if (!frame || !monogram || !imagePath) {
      return;
    }

    const probeImage = new Image();
    probeImage.alt = data.profile.fullName
      ? "Fotografía de " + data.profile.fullName
      : "Fotografía de portada";
    probeImage.className = "hero-photo";

    probeImage.addEventListener("load", function () {
      if (probeImage.naturalWidth > 0) {
        monogram.hidden = true;
        frame.insertBefore(probeImage, frame.querySelector(".hero-location-tag"));
      }
    });

    probeImage.addEventListener("error", function () {
      monogram.hidden = false;
    });

    probeImage.src = imagePath;
  }

  /**
   * Punto de entrada para inicializar la interfaz del portafolio.
   */
  function initPortfolio() {
    initThemeToggle();
    initMobileMenu();
    initActiveSectionIndicator();

    const data = getPortfolioData();
    initHeroMedia(data);
  }

  document.addEventListener("DOMContentLoaded", initPortfolio);
})();
