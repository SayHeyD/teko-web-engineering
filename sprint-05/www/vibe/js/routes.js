/**
 * Application Routes Configuration Module
 * 
 * Defines SPA routes, associated partial view loaders, component lifecycle initializations,
 * and SEO metadata updates for the VIBE application.
 */

/**
 * Registers application routes onto the given router instance.
 *
 * @param {Function|Object} pageInstance - The router or facade function.
 * @param {Object} [helpers] - Helper functions ({ loadView, setMeta, setJSONLD }).
 */
function registerRoutes(pageInstance, helpers) {
  const router = pageInstance || window.page;
  const loadViewFn = (helpers && helpers.loadView) || window.loadView;
  const setMetaFn = (helpers && helpers.setMeta) || window.setMeta;
  const setJSONLDFn = (helpers && helpers.setJSONLD) || window.setJSONLD;

  if (!router) return;

  // Define base URL for the SPA
  router.base("/vibe");

  /**
   * Route: Home ('/')
   */
  router("/", function () {
    loadViewFn("/vibe/views/home.html").then(function () {
      if (typeof renderMenu === 'function') renderMenu();
    });
    setMetaFn(
      "VIBE - Home",
      "Welcome to VIBE - Vitality • Intake • Body • Exercise. Discover body mass index fundamentals and health metrics.",
      window.location.origin + "/vibe/"
    );
    setJSONLDFn("WebPage", {
      name: "VIBE Home",
      url: window.location.origin + "/vibe/"
    });
  });

  /**
   * Route: Calculate BMI ('/calculate-bmi')
   */
  router("/calculate-bmi", function () {
    loadViewFn("/vibe/views/calculate-bmi.html").then(function () {
      if (typeof initCalculateBmi === 'function') initCalculateBmi();
      if (typeof renderMenu === 'function') renderMenu();
    });
    setMetaFn(
      "VIBE - Calculate BMI",
      "Calculate your Body Mass Index (BMI) quickly and accurately with our interactive calculator.",
      window.location.origin + "/vibe/calculate-bmi"
    );
    setJSONLDFn("WebApplication", {
      name: "Calculate BMI",
      url: window.location.origin + "/vibe/calculate-bmi"
    });
  });

  /**
   * Route: BMI Statistics ('/bmi-statistics')
   */
  router("/bmi-statistics", function () {
    loadViewFn("/vibe/views/bmi-statistics.html").then(function () {
      if (typeof loadAndRenderBmiStatistics === 'function') loadAndRenderBmiStatistics();
      if (typeof renderMenu === 'function') renderMenu();
    });
    setMetaFn(
      "VIBE - BMI Statistics",
      "View international BMI statistics across countries and demographics with interactive accordion cards.",
      window.location.origin + "/vibe/bmi-statistics"
    );
    setJSONLDFn("DataFeed", {
      name: "BMI Statistics",
      url: window.location.origin + "/vibe/bmi-statistics"
    });
  });

  /**
   * Route: BMI Categories ('/bmi-category')
   */
  router("/bmi-category", function () {
    loadViewFn("/vibe/views/bmi-category.html").then(function () {
      if (typeof loadAndRenderBmiCategories === 'function') loadAndRenderBmiCategories();
      if (typeof renderMenu === 'function') renderMenu();
    });
    setMetaFn(
      "VIBE - BMI Categories",
      "Overview of standard World Health Organization BMI categories and classifications.",
      window.location.origin + "/vibe/bmi-category"
    );
    setJSONLDFn("ItemList", {
      name: "BMI Categories",
      url: window.location.origin + "/vibe/bmi-category"
    });
  });
}

window.AppRoutes = {
  registerRoutes
};
