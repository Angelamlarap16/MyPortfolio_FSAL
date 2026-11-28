/* ==========================================================================
   Inicialización principal del portafolio
   Se ejecuta tras cargar el DOM gracias al atributo defer en index.html
   ========================================================================== */

(function () {
  "use strict";

  const app = window.PortfolioApp;
  if (!app) {
    return;
  }

  const createEl = app.dom.createEl;
  const buildExternalLink = app.dom.createExternalLink;

  const THEME_STORAGE_KEY = "portfolio-theme";
  const MOBILE_BREAKPOINT = 860;

  const THEME_ICONS = {
    dark: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path></svg>',
    light: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
  };

  /**
   * Lee una preferencia de tema guardada sin interrumpir el sitio si localStorage falla.
   * @returns {"dark"|"light"}
   */
  function readStoredTheme() {
    const saved = app.storage.get(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "dark";
  }

  /**
   * Guarda el tema elegido en localStorage de forma segura.
   * @param {"dark"|"light"} theme
   */
  function saveTheme(theme) {
    app.storage.set(THEME_STORAGE_KEY, theme);
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
      const computedBg = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--palette-bg")
        .trim();
      themeMeta.setAttribute("content", computedBg || (isLight ? "#F5F0FF" : "#1B1038"));
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

    sectionEntries.forEach(function (entry) {
      entry.link.addEventListener("click", function () {
        setActiveLink(entry.section.id);
      });
    });

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
        threshold: [0.01, 0.1, 0.35, 0.6]
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
        '<rect x="152" y="16" width="72" height="88" rx="8" stroke="var(--accent-link)" stroke-opacity="0.65" stroke-width="1.4"/>' +
        '<line x1="164" y1="36" x2="212" y2="36" stroke="var(--accent-link)" stroke-opacity="0.7" stroke-width="2"/>' +
        '<line x1="164" y1="54" x2="202" y2="54" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
        '<line x1="164" y1="70" x2="196" y2="70" stroke="currentColor" stroke-opacity="0.35" stroke-width="2"/>' +
        '<rect x="164" y="82" width="48" height="12" rx="4" fill="var(--accent-link)" fill-opacity="0.35"/>' +
        "</svg>",
      "pet-task-planner":
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="16" y="18" width="64" height="84" rx="7" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.4"/>' +
        '<rect x="88" y="18" width="64" height="84" rx="7" stroke="var(--accent-link)" stroke-opacity="0.55" stroke-width="1.4"/>' +
        '<rect x="160" y="18" width="64" height="84" rx="7" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.4"/>' +
        '<rect x="24" y="34" width="48" height="18" rx="4" stroke="currentColor" stroke-opacity="0.4"/>' +
        '<rect x="24" y="60" width="48" height="18" rx="4" stroke="currentColor" stroke-opacity="0.25"/>' +
        '<rect x="96" y="34" width="48" height="22" rx="4" stroke="var(--accent-link)" stroke-opacity="0.65"/>' +
        '<path d="M172 44l6 6 12-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M172 72l6 6 12-12" stroke="currentColor" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>",
      "agenda-telefonica-mvc":
        '<svg class="project-concept-svg" viewBox="0 0 240 120" fill="none" aria-hidden="true">' +
        '<rect x="20" y="20" width="56" height="32" rx="6" stroke="var(--accent-link)" stroke-opacity="0.65" stroke-width="1.4"/>' +
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
        '<circle cx="48" cy="86" r="8" stroke="var(--accent-link)" stroke-width="1.6"/>' +
        '<path d="M48 82v5M48 90h.01" stroke="var(--accent-link)" stroke-width="1.8" stroke-linecap="round"/>' +
        '<line x1="68" y1="86" x2="152" y2="86" stroke="var(--accent-link)" stroke-opacity="0.7" stroke-width="2"/>' +
        "</svg>"
    };

    return svgs[conceptKey] || svgs.tmv;
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
   * Construye una tarjeta tipo carátula de álbum con foto (o SVG conceptual) y nombre.
   * @param {object} project
   * @param {number} index
   * @returns {HTMLButtonElement}
   */
  function buildAlbumCard(project, index) {
    const button = createEl("button", "album-card");
    button.type = "button";
    button.id = "album-card-" + project.id;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "project-detail-panel");

    const coverWrap = createEl("span", "album-cover-wrap");
    coverWrap.setAttribute("aria-hidden", "true");

    const discMark = createEl("span", "album-disc-mark", String(index + 1).padStart(2, "0"));
    coverWrap.appendChild(discMark);

    const cover = createEl("span", "album-cover");

    function renderCoverFallback() {
      cover.innerHTML = getProjectConceptSvg(project.conceptKey);
    }

    if (project.image) {
      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.addEventListener("error", renderCoverFallback);
      img.src = project.image;
      cover.appendChild(img);
    } else {
      renderCoverFallback();
    }

    coverWrap.appendChild(cover);
    button.appendChild(coverWrap);
    button.appendChild(createEl("span", "album-title", project.name));
    return button;
  }

  /**
   * Crea un bloque de detalle dentro del panel común solo cuando existen datos disponibles.
   * @param {string} title
   * @param {string|string[]} content
   * @returns {HTMLElement|null}
   */
  function buildProjectDetailBlock(title, content) {
    if (!content || (Array.isArray(content) && content.length === 0)) {
      return null;
    }

    const block = createEl("section", "project-detail-block");
    block.appendChild(createEl("p", "project-block-label", title));

    if (Array.isArray(content)) {
      const list = createEl("ul", "project-detail-list");
      content.forEach(function (item) {
        list.appendChild(createEl("li", "", item));
      });
      block.appendChild(list);
    } else {
      block.appendChild(createEl("p", "", content));
    }

    return block;
  }

  /**
   * Actualiza el panel de ficha completa con el proyecto elegido y el botón de salida.
   * @param {HTMLElement} panelEl
   * @param {object} project
   * @param {Function} onClose
   */
  function renderProjectStage(panelEl, project, onClose) {
    panelEl.innerHTML = "";
    panelEl.setAttribute("aria-labelledby", "project-stage-title");

    const topBar = createEl("div", "project-stage-topbar");
    const meta = createEl("div", "project-meta");
    if (project.type) {
      meta.appendChild(createEl("span", "tag", project.type));
    }
    if (project.status) {
      meta.appendChild(createEl("span", "tag tag-sage", project.status));
    }
    topBar.appendChild(meta);

    const exitButton = createEl(
      "button",
      "button button-secondary button-sm",
      "Seguir explorando proyectos"
    );
    exitButton.type = "button";
    exitButton.addEventListener("click", onClose);
    topBar.appendChild(exitButton);
    panelEl.appendChild(topBar);

    const body = createEl("div", "project-stage-body");

    const aside = createEl("div", "project-stage-aside");
    aside.appendChild(buildProjectMedia(project));

    const techBlock = buildTechBlock(project);
    if (techBlock) {
      aside.appendChild(techBlock);
    }

    const actions = createEl("div", "project-actions");
    if (project.demoUrl) {
      actions.appendChild(
        buildExternalLink("Ver demo", project.demoUrl, "button button-primary button-sm")
      );
    }
    if (project.codeUrl) {
      actions.appendChild(
        buildExternalLink(
          "Código en GitHub",
          project.codeUrl,
          project.demoUrl ? "button button-secondary button-sm" : "button button-primary button-sm"
        )
      );
    }
    if (actions.children.length > 0) {
      aside.appendChild(actions);
    }

    const content = createEl("div", "project-stage-content");
    const titleEl = createEl("h3", "project-title", project.name);
    titleEl.id = "project-stage-title";
    content.appendChild(titleEl);
    content.appendChild(createEl("p", "project-description", project.description));

    const details = createEl("div", "project-stage-details");

    const contributionBlock = buildProjectDetailBlock(
      project.contributionTitle || "Mi contribución",
      project.contributions
    );
    if (contributionBlock) {
      details.appendChild(contributionBlock);
    }

    const featuresBlock = buildProjectDetailBlock(
      project.featuresTitle || "Funcionalidades",
      project.features
    );
    if (featuresBlock) {
      details.appendChild(featuresBlock);
    }

    const nextStepsBlock = buildProjectDetailBlock(
      "Próximos pasos conocidos",
      project.nextSteps
    );
    if (nextStepsBlock) {
      details.appendChild(nextStepsBlock);
    }

    if (details.children.length > 0) {
      content.appendChild(details);
    }

    body.appendChild(aside);
    body.appendChild(content);
    panelEl.appendChild(body);
  }

  /**
   * Renderiza el álbum compacto de proyectos y muestra la ficha completa solo al seleccionar uno.
   * @param {object|null} data
   */
  function renderProjects(data) {
    const container = document.querySelector('[data-section-container="projects"]');
    if (!container || !data || !Array.isArray(data.projects) || data.projects.length === 0) {
      return;
    }

    container.innerHTML = "";
    const projects = data.projects;
    let activeIndex = -1;

    const showcase = createEl("div", "projects-showcase");
    showcase.appendChild(
      createEl(
        "p",
        "projects-album-hint",
        "Explora el álbum de proyectos y selecciona el que quieras revisar en detalle."
      )
    );

    const albumTrack = createEl("div", "projects-album-track");
    albumTrack.setAttribute("role", "group");
    albumTrack.setAttribute("aria-label", "Álbum de proyectos");

    const stagePanel = createEl("article", "project-stage");
    stagePanel.id = "project-detail-panel";
    stagePanel.setAttribute("tabindex", "-1");
    stagePanel.hidden = true;

    const cards = projects.map(function (project, index) {
      return buildAlbumCard(project, index);
    });

    function closeProjectDetail(restoreFocus) {
      const previousIndex = activeIndex;
      activeIndex = -1;
      cards.forEach(function (card) {
        card.classList.remove("is-selected");
        card.setAttribute("aria-expanded", "false");
      });
      stagePanel.hidden = true;
      stagePanel.innerHTML = "";

      if (restoreFocus && previousIndex >= 0 && cards[previousIndex]) {
        cards[previousIndex].focus();
      }
    }

    function openProjectDetail(index) {
      if (activeIndex === index && !stagePanel.hidden) {
        closeProjectDetail(false);
        return;
      }

      activeIndex = index;
      cards.forEach(function (card, idx) {
        const isCurrent = idx === activeIndex;
        card.classList.toggle("is-selected", isCurrent);
        card.setAttribute("aria-expanded", String(isCurrent));
      });

      renderProjectStage(stagePanel, projects[activeIndex], function () {
        closeProjectDetail(true);
      });
      stagePanel.hidden = false;

      const prefersReduced = app.reducedMotion.isPreferred();
      stagePanel.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "nearest"
      });
    }

    cards.forEach(function (card, index) {
      card.addEventListener("click", function () {
        openProjectDetail(index);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          cards[(index + 1) % cards.length].focus();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          cards[(index - 1 + cards.length) % cards.length].focus();
        }
      });

      albumTrack.appendChild(card);
    });

    stagePanel.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !stagePanel.hidden) {
        event.preventDefault();
        closeProjectDetail(true);
      }
    });

    showcase.appendChild(albumTrack);
    showcase.appendChild(stagePanel);
    container.appendChild(showcase);
  }

  /**
   * Renderiza la sección Sobre mí con biografía breve y tres tarjetas clave.
   * @param {object|null} data
   */
  function renderAbout(data) {
    const container = document.querySelector('[data-section-container="about"]');
    const about = data && data.about;
    if (!container || !about) {
      return;
    }

    container.innerHTML = "";
    const layout = createEl("div", "about-layout");

    if (Array.isArray(about.paragraphs) && about.paragraphs.length > 0) {
      const bioCard = createEl("div", "card about-bio");
      about.paragraphs.forEach(function (text) {
        bioCard.appendChild(createEl("p", "", text));
      });
      layout.appendChild(bioCard);
    }

    if (Array.isArray(about.highlights) && about.highlights.length > 0) {
      const highlightsGrid = createEl("div", "about-highlights");
      about.highlights.forEach(function (item) {
        const card = createEl("article", "card highlight-card");
        card.appendChild(createEl("h3", "", item.title));
        card.appendChild(createEl("p", "", item.description));
        highlightsGrid.appendChild(card);
      });
      layout.appendChild(highlightsGrid);
    }

    container.appendChild(layout);
  }

  /**
   * Construye una tarjeta de trayectoria (laboral o formativa) diferenciando su contexto.
   * @param {object} entry
   * @param {string[]} listItems
   * @returns {HTMLElement}
   */
  function buildTrajectoryCard(entry, listItems) {
    const card = createEl("article", "card trajectory-card");
    const header = createEl("div", "trajectory-card-header");
    const info = createEl("div");

    info.appendChild(createEl("h4", "trajectory-role", entry.role));
    const orgDetails = [entry.organization, entry.modality].filter(Boolean).join(" · ");
    info.appendChild(createEl("p", "trajectory-org", orgDetails));

    const meta = createEl("div", "trajectory-meta");
    if (entry.contextTag) {
      meta.appendChild(createEl("span", "tag tag-sage", entry.contextTag));
    }
    if (entry.period) {
      meta.appendChild(createEl("span", "tag", entry.period));
    }

    header.appendChild(info);
    header.appendChild(meta);
    card.appendChild(header);

    if (Array.isArray(listItems) && listItems.length > 0) {
      const list = createEl("ul", "trajectory-list");
      listItems.forEach(function (item) {
        list.appendChild(createEl("li", "", item));
      });
      card.appendChild(list);
    }

    return card;
  }

  /**
   * Renderiza la sección Experiencia separando empleo real y proyectos formativos.
   * @param {object|null} data
   */
  function renderExperience(data) {
    const container = document.querySelector('[data-section-container="experience"]');
    const experience = data && data.experience;
    if (!container || !experience) {
      return;
    }

    container.innerHTML = "";
    const groups = createEl("div", "trajectory-groups");

    if (Array.isArray(experience.work) && experience.work.length > 0) {
      const workGroup = createEl("div", "trajectory-group");
      workGroup.appendChild(createEl("h3", "group-heading", "Experiencia laboral"));
      experience.work.forEach(function (item) {
        workGroup.appendChild(buildTrajectoryCard(item, item.tasks));
      });
      groups.appendChild(workGroup);
    }

    if (Array.isArray(experience.trainingProjects) && experience.trainingProjects.length > 0) {
      const trainingGroup = createEl("div", "trajectory-group");
      trainingGroup.appendChild(createEl("h3", "group-heading", "Proyectos formativos"));
      experience.trainingProjects.forEach(function (item) {
        trainingGroup.appendChild(buildTrajectoryCard(item, item.highlights));
      });
      groups.appendChild(trainingGroup);
    }

    container.appendChild(groups);
  }

  /**
   * Renderiza las categorías de habilidades con etiquetas de contexto sin porcentajes.
   * @param {object|null} data
   */
  function renderSkills(data) {
    const container = document.querySelector('[data-section-container="skills"]');
    if (!container || !data || !Array.isArray(data.skills) || data.skills.length === 0) {
      return;
    }

    container.innerHTML = "";
    const grid = createEl("div", "skills-grid");

    data.skills.forEach(function (group) {
      const card = createEl("article", "card skill-card");
      const header = createEl("div", "skill-card-header");
      header.appendChild(createEl("h3", "", group.category));

      if (group.contextTag) {
        header.appendChild(createEl("span", "tag tag-sage", group.contextTag));
      }

      card.appendChild(header);

      if (Array.isArray(group.items) && group.items.length > 0) {
        const list = createEl("ul", "skill-tags");
        group.items.forEach(function (item) {
          list.appendChild(createEl("li", "tag", item));
        });
        card.appendChild(list);
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  /**
   * Construye un bloque de tarjetas de formación académica o complementaria.
   * @param {string} headingText
   * @param {object[]} items
   * @returns {HTMLElement}
   */
  function buildEducationGroup(headingText, items) {
    const group = createEl("div", "trajectory-group");
    group.appendChild(createEl("h3", "group-heading", headingText));

    const grid = createEl("div", "education-grid");
    items.forEach(function (item) {
      const card = createEl("article", "card education-card");
      card.appendChild(createEl("h4", "", item.program));
      card.appendChild(createEl("p", "education-institution", item.institution));
      if (item.period) {
        card.appendChild(createEl("p", "education-period", item.period));
      }
      grid.appendChild(card);
    });

    group.appendChild(grid);
    return group;
  }

  /**
   * Renderiza la sección Formación separando formación principal y complementaria.
   * @param {object|null} data
   */
  function renderEducation(data) {
    const container = document.querySelector('[data-section-container="education"]');
    const education = data && data.education;
    if (!container || !education) {
      return;
    }

    container.innerHTML = "";
    const groups = createEl("div", "education-groups");

    if (Array.isArray(education.primary) && education.primary.length > 0) {
      groups.appendChild(buildEducationGroup("Formación principal", education.primary));
    }

    if (Array.isArray(education.complementary) && education.complementary.length > 0) {
      groups.appendChild(
        buildEducationGroup("Formación complementaria", education.complementary)
      );
    }

    container.appendChild(groups);
  }

  /**
   * Devuelve iconos SVG discretos para los botones de contacto.
   * @param {string} iconKey
   * @returns {string}
   */
  function getContactIconSvg(iconKey) {
    const icons = {
      email:
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
      phone:
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      github:
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
      linkedin:
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="7" y1="10" x2="7" y2="17"/><line x1="7" y1="7" x2="7" y2="7.01"/><path d="M11 17v-4a3 3 0 0 1 6 0v4"/><line x1="11" y1="10" x2="11" y2="17"/></svg>'
    };
    return icons[iconKey] || "";
  }

  /**
   * Construye un botón de contacto con icono, etiqueta y dato visible.
   * @param {object} config
   * @returns {HTMLAnchorElement}
   */
  function buildContactButton(config) {
    const link = createEl(
      "a",
      config.primary ? "contact-button contact-button-primary" : "contact-button"
    );
    link.href = config.href;
    if (config.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const iconWrap = createEl("span", "contact-button-icon");
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.innerHTML = getContactIconSvg(config.icon);

    const textWrap = createEl("span", "contact-button-text");
    textWrap.appendChild(createEl("span", "contact-button-label", config.label));
    textWrap.appendChild(createEl("span", "contact-button-value", config.value));

    link.appendChild(iconWrap);
    link.appendChild(textWrap);
    return link;
  }

  /**
   * Renderiza la sección CONTÁCTAME con los cuatro canales y la acción de CV.
   * @param {object|null} data
   */
  function renderContact(data) {
    const container = document.querySelector('[data-section-container="contact"]');
    const contact = data && data.contact;
    if (!container || !contact) {
      return;
    }

    container.innerHTML = "";
    const layout = createEl("div", "contact-layout");
    const grid = createEl("div", "contact-grid");

    const subject = encodeURIComponent(
      contact.emailSubject || "Contacto profesional — Desarrollo Java Full Stack"
    );
    const cleanPhone = String(contact.phone || "").replace(/\s+/g, "");

    const items = [
      {
        label: "Correo",
        value: contact.email,
        href: "mailto:" + contact.email + "?subject=" + subject,
        icon: "email",
        primary: true,
        external: false
      },
      {
        label: "Teléfono",
        value: contact.phone,
        href: "tel:" + cleanPhone,
        icon: "phone",
        primary: false,
        external: false
      },
      {
        label: "GitHub",
        value: contact.githubHandle || "@Angelamlarap16",
        href: contact.github,
        icon: "github",
        primary: false,
        external: true
      },
      {
        label: "LinkedIn",
        value: contact.linkedinLabel || "Angela Lara",
        href: contact.linkedin,
        icon: "linkedin",
        primary: false,
        external: true
      }
    ];

    items.forEach(function (item) {
      if (item.value && item.href) {
        grid.appendChild(buildContactButton(item));
      }
    });

    layout.appendChild(grid);

    const cvConfig = (data && data.cv) || {};
    const cvPanel = createEl("div", "card contact-cv-panel");
    const cvCopy = createEl("div", "contact-cv-copy");
    cvCopy.appendChild(createEl("h3", "", "Hoja de vida orientada a desarrollo"));
    cvCopy.appendChild(
      createEl(
        "p",
        "",
        "Consulta el resumen técnico con perfil, proyectos, habilidades, experiencia y formación listo para imprimir o guardar en PDF."
      )
    );

    const cvActions = createEl("div", "contact-cv-actions");
    const printBtn = createEl(
      "button",
      "button button-secondary button-sm",
      cvConfig.printLabel || "Imprimir / Guardar PDF"
    );
    printBtn.type = "button";
    printBtn.addEventListener("click", function () {
      window.print();
    });
    cvActions.appendChild(printBtn);

    if (cvConfig.pdfUrl) {
      const pdfLink = createEl(
        "a",
        "button button-primary button-sm",
        cvConfig.pdfLabel || "Abrir CV en PDF"
      );
      pdfLink.href = cvConfig.pdfUrl;
      pdfLink.target = "_blank";
      pdfLink.rel = "noopener noreferrer";
      pdfLink.setAttribute(
        "aria-label",
        (cvConfig.pdfLabel || "Abrir CV en PDF") + " (se abre en una nueva pestaña)"
      );
      cvActions.appendChild(pdfLink);
    }

    cvPanel.appendChild(cvCopy);
    cvPanel.appendChild(cvActions);
    layout.appendChild(cvPanel);

    container.appendChild(layout);
  }

  /**
   * Conecta los botones de CV del encabezado y la portada con el PDF o la versión imprimible.
   * @param {object|null} data
   */
  function initCvActions(data) {
    const cvConfig = (data && data.cv) || {};
    const pdfUrl = typeof cvConfig.pdfUrl === "string" ? cvConfig.pdfUrl.trim() : "";
    const targets = [
      document.getElementById("header-cv-action"),
      document.getElementById("hero-cv-action")
    ].filter(Boolean);

    targets.forEach(function (element) {
      if (pdfUrl) {
        element.setAttribute("href", pdfUrl);
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
        element.setAttribute(
          "aria-label",
          (cvConfig.pdfLabel || "Abrir CV en PDF") + " (se abre en una nueva pestaña)"
        );
        element.setAttribute("title", "Abrir CV en PDF");
      } else {
        element.setAttribute("aria-label", "Imprimir o guardar CV en PDF");
        element.setAttribute("title", "Imprimir o guardar CV en PDF");
        element.addEventListener("click", function (event) {
          event.preventDefault();
          window.print();
        });
      }
    });
  }

  /**
   * Construye la versión imprimible del CV usando exclusivamente los datos del sitio.
   * @param {object|null} data
   */
  function renderPrintableCv(data) {
    const container = document.getElementById("cv-imprimible");
    if (!container || !data) {
      return;
    }

    const profile = data.profile || {};
    const contact = data.contact || {};
    const about = data.about || {};
    const skills = Array.isArray(data.skills) ? data.skills : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const experience = data.experience || {};
    const education = data.education || {};

    container.innerHTML = "";

    const header = createEl("header", "cv-header");
    header.appendChild(createEl("h1", "cv-name", profile.fullName || "Angela María Lara Picón"));
    header.appendChild(createEl("p", "cv-role", profile.role || "Desarrolladora Java Full Stack"));

    const contactRow = createEl("ul", "cv-contact-row");
    [
      contact.location,
      contact.email,
      contact.phone,
      contact.github ? "GitHub: " + contact.github.replace("https://", "") : "",
      contact.linkedin ? "LinkedIn: " + contact.linkedin.replace("https://www.", "") : ""
    ]
      .filter(Boolean)
      .forEach(function (text) {
        contactRow.appendChild(createEl("li", "", text));
      });
    header.appendChild(contactRow);
    container.appendChild(header);

    if (Array.isArray(about.paragraphs) && about.paragraphs.length > 0) {
      const profileSection = createEl("section", "cv-section");
      profileSection.appendChild(createEl("h2", "cv-section-title", "Perfil"));
      about.paragraphs.forEach(function (text) {
        profileSection.appendChild(createEl("p", "", text));
      });
      container.appendChild(profileSection);
    }

    if (skills.length > 0) {
      const skillsSection = createEl("section", "cv-section");
      skillsSection.appendChild(createEl("h2", "cv-section-title", "Habilidades"));
      skills.forEach(function (group) {
        if (!Array.isArray(group.items) || group.items.length === 0) {
          return;
        }
        const suffix = group.contextTag ? " (" + group.contextTag + ")" : "";
        const line = createEl("p", "");
        const strong = createEl("strong", "", group.category + suffix + ": ");
        line.appendChild(strong);
        line.appendChild(document.createTextNode(group.items.join(", ") + "."));
        skillsSection.appendChild(line);
      });
      container.appendChild(skillsSection);
    }

    if (projects.length > 0) {
      const projectsSection = createEl("section", "cv-section");
      projectsSection.appendChild(createEl("h2", "cv-section-title", "Proyectos y contribuciones"));
      projects.forEach(function (project) {
        const item = createEl("div", "cv-item");
        item.appendChild(createEl("p", "cv-item-title", project.name));
        item.appendChild(
          createEl("p", "cv-item-meta", [project.type, project.status].filter(Boolean).join(" · "))
        );
        item.appendChild(createEl("p", "", project.description));

        const list = createEl("ul", "cv-list");
        if (Array.isArray(project.contributions)) {
          project.contributions.forEach(function (entry) {
            list.appendChild(createEl("li", "", entry));
          });
        }
        if (Array.isArray(project.features)) {
          project.features.forEach(function (entry) {
            list.appendChild(createEl("li", "", entry));
          });
        }
        if (Array.isArray(project.nextSteps)) {
          project.nextSteps.forEach(function (entry) {
            list.appendChild(createEl("li", "", entry));
          });
        }
        if (list.children.length > 0) {
          item.appendChild(list);
        }

        if (Array.isArray(project.technologies) && project.technologies.length > 0) {
          item.appendChild(
            createEl(
              "p",
              "cv-item-meta",
              (project.technologiesLabel || "Tecnologías") + ": " + project.technologies.join(", ")
            )
          );
        }

        const linksText = [project.codeUrl, project.demoUrl].filter(Boolean).join(" | ");
        if (linksText) {
          item.appendChild(createEl("p", "cv-item-meta", linksText));
        }

        projectsSection.appendChild(item);
      });
      container.appendChild(projectsSection);
    }

    const workItems = Array.isArray(experience.work) ? experience.work : [];
    const trainingItems = Array.isArray(experience.trainingProjects)
      ? experience.trainingProjects
      : [];
    if (workItems.length > 0 || trainingItems.length > 0) {
      const expSection = createEl("section", "cv-section");
      expSection.appendChild(createEl("h2", "cv-section-title", "Experiencia"));

      workItems.forEach(function (entry) {
        const item = createEl("div", "cv-item");
        item.appendChild(createEl("p", "cv-item-title", entry.role + " — " + entry.organization));
        item.appendChild(
          createEl(
            "p",
            "cv-item-meta",
            [entry.contextTag, entry.modality, entry.period].filter(Boolean).join(" · ")
          )
        );
        if (Array.isArray(entry.tasks) && entry.tasks.length > 0) {
          const list = createEl("ul", "cv-list");
          entry.tasks.forEach(function (task) {
            list.appendChild(createEl("li", "", task));
          });
          item.appendChild(list);
        }
        expSection.appendChild(item);
      });

      trainingItems.forEach(function (entry) {
        const item = createEl("div", "cv-item");
        item.appendChild(createEl("p", "cv-item-title", entry.role + " — " + entry.organization));
        item.appendChild(
          createEl(
            "p",
            "cv-item-meta",
            [entry.contextTag, entry.period].filter(Boolean).join(" · ")
          )
        );
        if (Array.isArray(entry.highlights) && entry.highlights.length > 0) {
          const list = createEl("ul", "cv-list");
          entry.highlights.forEach(function (highlight) {
            list.appendChild(createEl("li", "", highlight));
          });
          item.appendChild(list);
        }
        expSection.appendChild(item);
      });

      container.appendChild(expSection);
    }

    const primaryEdu = Array.isArray(education.primary) ? education.primary : [];
    const compEdu = Array.isArray(education.complementary) ? education.complementary : [];
    const languages = Array.isArray(profile.languages) ? profile.languages : [];

    if (primaryEdu.length > 0 || compEdu.length > 0 || languages.length > 0) {
      const eduSection = createEl("section", "cv-section");
      eduSection.appendChild(createEl("h2", "cv-section-title", "Formación e idiomas"));

      primaryEdu.concat(compEdu).forEach(function (entry) {
        const details = [entry.program, entry.institution, entry.period].filter(Boolean).join(" — ");
        eduSection.appendChild(createEl("p", "", details));
      });

      if (languages.length > 0) {
        const langText = languages
          .map(function (lang) {
            return lang.name + " (" + lang.level + ")";
          })
          .join(", ");
        eduSection.appendChild(createEl("p", "", "Idiomas: " + langText + "."));
      }

      container.appendChild(eduSection);
    }
  }

  /**
   * Actualiza el año mostrado en el pie de página.
   */
  function initFooterYear() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Anima las frases del título profesional con efecto de máquina de escribir,
   * mostrando la frase principal al cargar y respetando accesibilidad, rendimiento y movimiento reducido.
   * @param {object|null} data
   */
  function initHeroTypewriter(data) {
    const roleEl = document.getElementById("hero-role");
    const textEl = document.getElementById("hero-role-text");

    if (!roleEl || !textEl) {
      return;
    }

    const defaultPhrases = [
      "Java Full Stack Developer",
      "Desarrollo Web & Diseño Responsivo",
      "Gestión de Bases de Datos y Backend"
    ];

    const configuredPhrases =
      data && data.profile && Array.isArray(data.profile.roles)
        ? data.profile.roles.filter(function (phrase) {
          return typeof phrase === "string" && phrase.trim().length > 0;
        })
        : [];

    const phrases = configuredPhrases.length > 0 ? configuredPhrases : defaultPhrases;
    const staticPhrase =
      (data && data.profile && data.profile.role) || phrases[0] || textEl.textContent.trim();

    const srEl = roleEl.querySelector("[data-hero-role-sr]");
    const ghostEl = roleEl.querySelector("[data-hero-role-ghost]");
    if (srEl) {
      srEl.textContent = staticPhrase;
    }
    if (ghostEl) {
      const longestPhrase = phrases.reduce(function (longest, current) {
        return current.length > longest.length ? current : longest;
      }, staticPhrase);
      ghostEl.textContent = longestPhrase;
    }

    const HOLD_DURATION_MS = 1000;
    const TYPE_STEP_MS = 32;
    const ERASE_STEP_MS = 12;
    const SWITCH_PAUSE_MS = 80;

    const motionQuery = app.reducedMotion.getQuery();

    let timerId = null;
    let isInView = true;
    let isPaused = false;
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let phase = "holding";

    function clearTimer() {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }

    function scheduleNext(delayMs) {
      clearTimer();
      timerId = window.setTimeout(runStep, delayMs);
    }

    function showStaticRole() {
      clearTimer();
      roleEl.classList.remove("is-typewriter-active", "is-typewriter-paused");
      textEl.textContent = staticPhrase;
    }

    function shouldAnimate() {
      if (motionQuery && motionQuery.matches) {
        return false;
      }
      if (document.hidden || !isInView) {
        return false;
      }
      return true;
    }

    function pauseEffect() {
      if (isPaused) {
        return;
      }
      isPaused = true;
      clearTimer();
      roleEl.classList.add("is-typewriter-paused");
      const currentPhrase = phrases[phraseIndex] || staticPhrase;
      textEl.textContent = currentPhrase;
      charIndex = currentPhrase.length;
      phase = "holding";
    }

    function resumeEffect() {
      if (motionQuery && motionQuery.matches) {
        showStaticRole();
        return;
      }
      if (document.hidden || !isInView || phrases.length < 2) {
        return;
      }

      isPaused = false;
      roleEl.classList.add("is-typewriter-active");
      roleEl.classList.remove("is-typewriter-paused");
      scheduleNext(HOLD_DURATION_MS);
    }

    function runStep() {
      if (!shouldAnimate()) {
        if (motionQuery && motionQuery.matches) {
          showStaticRole();
        } else {
          pauseEffect();
        }
        return;
      }

      const currentPhrase = phrases[phraseIndex];

      if (phase === "holding") {
        phase = "erasing";
        scheduleNext(ERASE_STEP_MS);
        return;
      }

      if (phase === "erasing") {
        charIndex = Math.max(0, charIndex - 1);
        textEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          phase = "typing";
          scheduleNext(SWITCH_PAUSE_MS);
          return;
        }
        scheduleNext(ERASE_STEP_MS);
        return;
      }

      if (phase === "typing") {
        charIndex += 1;
        textEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex >= currentPhrase.length) {
          phase = "holding";
          scheduleNext(HOLD_DURATION_MS);
          return;
        }
        scheduleNext(TYPE_STEP_MS);
      }
    }

    if (phrases.length < 2 || (motionQuery && motionQuery.matches)) {
      showStaticRole();
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          isInView = Boolean(entry && entry.isIntersecting);
          if (isInView) {
            resumeEffect();
          } else {
            pauseEffect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(roleEl);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        pauseEffect();
      } else {
        resumeEffect();
      }
    });

    app.reducedMotion.onChange(motionQuery, function () {
      if (motionQuery && motionQuery.matches) {
        showStaticRole();
      } else {
        phraseIndex = 0;
        charIndex = phrases[0].length;
        phase = "holding";
        textEl.textContent = phrases[0];
        resumeEffect();
      }
    });

    roleEl.classList.add("is-typewriter-active");
    textEl.textContent = phrases[0];
    phraseIndex = 0;
    charIndex = phrases[0].length;
    phase = "holding";

    if (!document.hidden) {
      scheduleNext(HOLD_DURATION_MS);
    } else {
      pauseEffect();
    }
  }

  /**
   * Crea y gestiona una capa sutil y pausada de copos en la portada respetando
   * clic/lectura libres, pausa fuera de vista y preferencia de movimiento reducido.
   */
  function initHeroSnow() {
    const heroSection = document.getElementById("portada");
    const snowLayer = document.getElementById("hero-snow");

    if (!heroSection || !snowLayer) {
      return;
    }

    const motionQuery = app.reducedMotion.getQuery();

    const flakeConfigs = [
      { left: 2, size: 5, opacity: 0.52, duration: 28, delay: -6, driftA: 34, driftB: 16, driftC: 58, color: "var(--text-secondary)" },
      { left: 5, size: 4, opacity: 0.44, duration: 36, delay: -21, driftA: -12, driftB: 28, driftC: 42, color: "var(--accent-link)" },
      { left: 14, size: 6, opacity: 0.46, duration: 31, delay: -12, driftA: -36, driftB: -18, driftC: -56, color: "var(--accent-secondary)" },
      { left: 26, size: 4.5, opacity: 0.42, duration: 39, delay: -28, driftA: 42, driftB: 14, driftC: 66, color: "var(--text-secondary)" },
      { left: 41, size: 5.5, opacity: 0.48, duration: 33, delay: -17, driftA: -44, driftB: -22, driftC: -64, color: "var(--accent-link)" },
      { left: 57, size: 5, opacity: 0.54, duration: 27, delay: -4, driftA: 28, driftB: -16, driftC: 34, color: "var(--accent-secondary)" },
      { left: 61, size: 4, opacity: 0.48, duration: 35, delay: -23, driftA: -26, driftB: 20, driftC: -32, color: "var(--text-secondary)" },
      { left: 78, size: 6, opacity: 0.46, duration: 30, delay: -15, driftA: 48, driftB: 26, driftC: 72, color: "var(--accent-link)" },
      { left: 94, size: 5, opacity: 0.54, duration: 29, delay: -9, driftA: -38, driftB: -14, driftC: -58, color: "var(--accent-secondary)" },
      { left: 97, size: 4, opacity: 0.46, duration: 41, delay: -31, driftA: -24, driftB: 10, driftC: -44, color: "var(--text-secondary)" },
      { left: 3, size: 6, opacity: 0.48, duration: 34, delay: -19, driftA: 52, driftB: 24, driftC: 76, color: "var(--accent-secondary)", desktopOnly: true },
      { left: 19, size: 4, opacity: 0.42, duration: 42, delay: -33, driftA: -34, driftB: 12, driftC: -48, color: "var(--text-secondary)", desktopOnly: true },
      { left: 59, size: 6.5, opacity: 0.5, duration: 26, delay: -14, driftA: -22, driftB: 24, driftC: -12, color: "var(--accent-link)", desktopOnly: true },
      { left: 72, size: 4.5, opacity: 0.44, duration: 38, delay: -25, driftA: 36, driftB: -14, driftC: 54, color: "var(--text-secondary)", desktopOnly: true },
      { left: 88, size: 5.5, opacity: 0.5, duration: 32, delay: -2, driftA: -46, driftB: -20, driftC: -70, color: "var(--accent-link)", desktopOnly: true },
      { left: 96, size: 4.5, opacity: 0.52, duration: 37, delay: -27, driftA: -54, driftB: -28, driftC: -82, color: "var(--accent-secondary)", desktopOnly: true }
    ];

    let isInView = true;

    function renderFlakes() {
      if (snowLayer.childElementCount > 0) {
        return;
      }

      const fragment = document.createDocumentFragment();
      flakeConfigs.forEach(function (cfg) {
        const flake = document.createElement("span");
        flake.className = cfg.desktopOnly
          ? "hero-snowflake hero-snowflake--desktop"
          : "hero-snowflake";
        flake.style.setProperty("--snow-left", cfg.left + "%");
        flake.style.setProperty("--snow-size", cfg.size + "px");
        flake.style.setProperty("--snow-opacity", String(cfg.opacity));
        flake.style.setProperty("--snow-duration", cfg.duration + "s");
        flake.style.setProperty("--snow-delay", cfg.delay + "s");
        flake.style.setProperty("--snow-drift-a", cfg.driftA + "px");
        flake.style.setProperty("--snow-drift-b", cfg.driftB + "px");
        flake.style.setProperty("--snow-drift-c", cfg.driftC + "px");
        flake.style.setProperty("--snow-color", cfg.color);
        fragment.appendChild(flake);
      });
      snowLayer.appendChild(fragment);
    }

    function syncSnowState() {
      const reducedMotion = Boolean(motionQuery && motionQuery.matches);

      if (reducedMotion) {
        snowLayer.hidden = true;
        snowLayer.innerHTML = "";
        heroSection.classList.remove("is-snow-auto-paused");
        return;
      }

      renderFlakes();
      snowLayer.hidden = false;
      heroSection.classList.toggle("is-snow-auto-paused", document.hidden || !isInView);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          isInView = Boolean(entry && entry.isIntersecting);
          syncSnowState();
        },
        { threshold: 0.02 }
      );
      observer.observe(heroSection);
    }

    document.addEventListener("visibilitychange", syncSnowState);

    app.reducedMotion.onChange(motionQuery, syncSnowState);

    syncSnowState();
  }

  /**
   * Punto de entrada para inicializar la interfaz del portafolio.
   */
  function initPortfolio() {
    initThemeToggle();
    initMobileMenu();
    initActiveSectionIndicator();
    initFooterYear();

    const data = app.getData();
    initHeroTypewriter(data);
    initHeroSnow();
    initHeroMedia(data);
    renderProjects(data);
    renderAbout(data);
    renderExperience(data);
    renderSkills(data);
    renderEducation(data);
    renderContact(data);
    initCvActions(data);
    renderPrintableCv(data);
  }

  document.addEventListener("DOMContentLoaded", initPortfolio);
}) ();
