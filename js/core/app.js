/* ==========================================================================
   Núcleo compartido del portafolio: espacio de nombres, acceso a datos y utilidades
   Script clásico con defer; debe cargarse después de portfolio-data.js
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Obtiene los datos centralizados del portafolio sin mutar window.PORTFOLIO_DATA.
   * @returns {object|null}
   */
  function getData() {
    if (typeof window.PORTFOLIO_DATA === "object" && window.PORTFOLIO_DATA !== null) {
      return window.PORTFOLIO_DATA;
    }
    return null;
  }

  /**
   * Crea un elemento HTML con clase y texto opcionales.
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
   * Construye un enlace externo seguro con rel="noopener noreferrer".
   * @param {string} label
   * @param {string} url
   * @param {string} [buttonClass]
   * @returns {HTMLAnchorElement}
   */
  function createExternalLink(label, url, buttonClass) {
    const anchor = createEl("a", buttonClass, label);
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    return anchor;
  }

  /**
   * Lee un valor de localStorage sin interrumpir el sitio si el almacenamiento está restringido.
   * @param {string} key
   * @returns {string|null}
   */
  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  /**
   * Guarda un valor en localStorage de forma segura.
   * @param {string} key
   * @param {string} value
   * @returns {boolean}
   */
  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Devuelve el objeto MediaQueryList para prefers-reduced-motion si está soportado.
   * @returns {MediaQueryList|null}
   */
  function getReducedMotionQuery() {
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-reduced-motion: reduce)");
    }
    return null;
  }

  /**
   * Indica si la preferencia de movimiento reducido está activa actualmente.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    const query = getReducedMotionQuery();
    return Boolean(query && query.matches);
  }

  /**
   * Suscribe un manejador a cambios de prefers-reduced-motion con respaldo para navegadores previos.
   * @param {MediaQueryList|null} query
   * @param {Function} handler
   */
  function onReducedMotionChange(query, handler) {
    if (!query || typeof handler !== "function") {
      return;
    }
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
    } else if (typeof query.addListener === "function") {
      query.addListener(handler);
    }
  }

  const modules = {};

  /**
   * Registra un módulo funcional bajo el espacio de nombres único del portafolio.
   * @param {string} name
   * @param {object} api
   */
  function registerModule(name, api) {
    if (typeof name === "string" && name.length > 0 && api && typeof api === "object") {
      modules[name] = api;
    }
  }

  window.PortfolioApp = {
    getData: getData,
    dom: {
      createEl: createEl,
      createExternalLink: createExternalLink
    },
    storage: {
      get: readStorage,
      set: writeStorage
    },
    reducedMotion: {
      getQuery: getReducedMotionQuery,
      isPreferred: prefersReducedMotion,
      onChange: onReducedMotionChange
    },
    modules: modules,
    registerModule: registerModule
  };
})();
