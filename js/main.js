/* ==========================================================================
   Inicialización principal del portafolio
   Se ejecuta tras cargar el DOM gracias al atributo defer en index.html
   ========================================================================== */

(function () {
  "use strict";

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
   * Punto de entrada para inicializar la interfaz y futuras interacciones.
   */
  function initPortfolio() {
    const data = getPortfolioData();
    if (!data) {
      return;
    }

    // Espacio reservado para inicializar tema, renderizado dinámico y controles de CV
    // en los siguientes pasos del proyecto.
  }

  document.addEventListener("DOMContentLoaded", initPortfolio);
})();
