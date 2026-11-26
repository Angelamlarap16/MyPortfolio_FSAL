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
   * Devuelve una ilustración SVG conceptual para proyectos sin captura real.
   * @param {string} conceptKey
   * @returns {string}
   */
  function getProjectConceptSvg(conceptKey) {
    const svgs = {
      tmv:
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="16" y="16" width="124" height="88" rx="8" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.4"/>' +
        '<rect x="28" y="28" width="44" height="28" rx="4" stroke="currentColor" stroke-opacity="0.45"/>' +
        '<rect x="82" y="28" width="44" height="28" rx="4" stroke="currentColor" stroke-opacity="0.45"/>' +
        '<rect x="28" y="66" width="98" height="24" rx="4" stroke="currentColor" stroke-opacity="0.25"/>' +
        '<rect x="152" y="16" width="72" height="88" rx="8" stroke="#F0AA72" stroke-opacity="0.55" stroke-width="1.4"/>' +
        '<line x1="164" y1="36" x2="212" y2="36" stroke="#F0AA72" stroke-opacity="0.6" stroke-width="2"/>' +
        '<line x1="164" y1="54" x2="202" y2="54" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
        '<line x1="164" y1="70" x2="196" y2="70" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
        '<rect x="164" y="82" width="48" height="12" rx="4" fill="#F0AA72" fill-opacity="0.35"/>' +
        "</svg>",
      "pet-task-planner":
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="16" y="18" width="64" height="84" rx="7" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.4"/>' +
        '<rect x="88" y="18" width="64" height="84" rx="7" stroke="#F0AA72" stroke-opacity="0.45" stroke-width="1.4"/>' +
        '<rect x="160" y="18" width="64" height="84" rx="7" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.4"/>' +
        '<rect x="24" y="34" width="48" height="18" rx="4" stroke="currentColor" stroke-opacity="0.4"/>' +
        '<rect x="24" y="60" width="48" height="18" rx="4" stroke="currentColor" stroke-opacity="0.25"/>' +
        '<rect x="96" y="34" width="48" height="22" rx="4" stroke="#F0AA72" stroke-opacity="0.55"/>' +
        '<path d="M172 44l6 6 12-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M172 72l6 6 12-12" stroke="currentColor" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>",
      "agenda-telefonica-mvc":
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="20" y="20" width="56" height="32" rx="6" stroke="#F0AA72" stroke-opacity="0.55" stroke-width="1.4"/>' +
        '<rect x="92" y="20" width="56" height="32" rx="6" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.4"/>' +
        '<rect x="164" y="20" width="56" height="32" rx="6" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.4"/>' +
        '<line x1="76" y1="36" x2="92" y2="36" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.4"/>' +
        '<line x1="148" y1="36" x2="164" y2="36" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.4"/>' +
        '<rect x="20" y="66" width="200" height="36" rx="6" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.3"/>' +
        '<line x1="34" y1="80" x2="132" y2="80" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>' +
        '<line x1="34" y1="92" x2="178" y2="92" stroke="currentColor" stroke-opacity="0.28" stroke-width="2"/>' +
        "</svg>",
      "qa-con-jest":
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="22" y="18" width="196" height="84" rx="8" stroke="currentColor" stroke-opacity="0.32" stroke-width="1.4"/>' +
        '<circle cx="48" cy="42" r="8" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M44 42l3 3 5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="68" y1="42" x2="166" y2="42" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>' +
        '<circle cx="48" cy="64" r="8" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M44 64l3 3 5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="68" y1="64" x2="188" y2="64" stroke="currentColor" stroke-opacity="0.45" stroke-width="2"/>' +
        '<circle cx="48" cy="86" r="8" stroke="#F0AA72" stroke-width="1.6"/>' +
        '<path d="M48 82v5M48 90h.01" stroke="#F0AA72" stroke-width="1.8" stroke-linecap="round"/>' +
        '<line x1="68" y1="86" x2="152" y2="86" stroke="#F0AA72" stroke-opacity="0.6" stroke-width="2"/>' +
        "</svg>"
    };

    return svgs[conceptKey] || svgs.tmv;
  }

  /**
   * Crea un elemento con clase y texto opcionales.
   * @param {string} tagName
   * @param {string} [className]
   * @param {string} [text]
   * @returns {HTMLElement}
   */
  function createEl(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string" && text.length > 0) {
      element.textContent = text;
    }
    return element;
  }

  /**
   * Construye el contenedor visual del proyecto: captura real o vista conceptual SVG.
   * @param {object} project
   * @returns {HTMLElement}
   */
  function buildProjectMedia(project) {
    const media = createEl("div", "project-media");

    function renderConceptFallback() {
      media.innerHTML = "";
      const concept = createEl("div", "project-concept");
      concept.innerHTML = getProjectConceptSvg(project.conceptKey);
      const badge = createEl("span", "concept-badge", "Vista conceptual");
      concept.appendChild(badge);
      media.appendChild(concept);
    }

    if (project.image) {
      const img = createEl("img", "project-screenshot");
      img.alt = project.imageAlt || "Captura de " + project.name;
      img.loading = "lazy";
      img.addEventListener("error", renderConceptFallback);
      img.src = project.image;
      media.appendChild(img);
    } else {
      renderConceptFallback();
    }

    return media;
  }

  /**
   * Construye una lista de tecnologías si el proyecto tiene tecnologías confirmadas.
   * @param {object} project
   * @returns {HTMLElement|null}
   */
  function buildTechBlock(project) {
    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      return null;
    }

    const wrapper = createEl("div", "project-tech-group");
    const label = createEl(
      "p",
      "project-block-label",
      project.technologiesLabel || "Tecnologías"
    );
    const list = createEl("ul", "project-tech-list");

    project.technologies.forEach(function (tech) {
      list.appendChild(createEl("li", "tag", tech));
    });

    wrapper.appendChild(label);
    wrapper.appendChild(list);
    return wrapper;
  }

  /**
   * Construye un enlace externo seguro para código o demo.
   * @param {string} label
   * @param {string} url
   * @param {string} buttonClass
   * @returns {HTMLAnchorElement}
   */
  function buildExternalLink(label, url, buttonClass) {
    const anchor = createEl("a", buttonClass, label);
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    return anchor;
  }

  /**
   * Construye una tarjeta de proyecto para la cuadrícula principal.
   * @param {object} project
   * @returns {HTMLElement}
   */
  function buildProjectCard(project) {
    const card = createEl("article", "card project-card");

    card.appendChild(buildProjectMedia(project));

    const meta = createEl("div", "project-meta");
    meta.appendChild(createEl("span", "tag", project.type));
    meta.appendChild(createEl("span", "tag tag-sage", project.status));
    card.appendChild(meta);

    card.appendChild(createEl("h3", "project-title", project.name));
    card.appendChild(createEl("p", "project-description", project.description));

    if (Array.isArray(project.contributions) && project.contributions.length > 0) {
      const contributionBox = createEl("div", "project-contribution");
      contributionBox.appendChild(
        createEl("p", "project-block-label", project.contributionTitle || "Mi aporte")
      );

      if (project.contributions.length === 1) {
        contributionBox.appendChild(createEl("p", "", project.contributions[0]));
      } else {
          const list = createEl("ul", "project-contribution-list");
          project.contributions.slice(0, 3).forEach(function (item) {
            list.appendChild(createEl("li", "", item));
          });
          contributionBox.appendChild(list);
        }

      card.appendChild(contributionBox);
      }

      const techBlock = buildTechBlock(project);
      if (techBlock) {
        card.appendChild(techBlock);
      }

      const actions = createEl("div", "project-actions");
      if (project.codeUrl) {
        actions.appendChild(
          buildExternalLink("Código", project.codeUrl, "button button-secondary button-sm")
        );
      }
      if (project.demoUrl) {
        actions.appendChild(
          buildExternalLink("Ver demo", project.demoUrl, "button button-primary button-sm")
        );
      }

      card.appendChild(actions);
      return card;
    }

    /**
     * Renderiza las tarjetas de proyectos desde PORTFOLIO_DATA.
     * @param {object|null} data
     */
    function renderProjects(data) {
      const container = document.querySelector('[data-section-container="projects"]');
      if (!container || !data || !Array.isArray(data.projects) || data.projects.length === 0) {
        return;
      }

      container.innerHTML = "";

      const grid = createEl("div", "projects-grid");

      data.projects.forEach(function (project) {
        grid.appendChild(buildProjectCard(project));
      });

      container.appendChild(grid);
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
      renderProjects(data);
    }

    document.addEventListener("DOMContentLoaded", initPortfolio);
  }) ();
