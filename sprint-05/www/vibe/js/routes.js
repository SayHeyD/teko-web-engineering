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
  const preloadViewFn = (helpers && helpers.preloadView) || window.preloadView;
  const setMetaFn = (helpers && helpers.setMeta) || window.setMeta;
  const setJSONLDFn = (helpers && helpers.setJSONLD) || window.setJSONLD;

  if (!router) return;

  // Define base URL for the SPA
  router.base("/vibe");

  /**
   * Helper to register a route with automatic hover preloading for its view template.
   */
  function defineRoute(path, viewUrl, onRender, metaConfig, jsonLdConfig) {
    if (typeof router.preload === 'function') {
      router.preload(path, function () {
        if (typeof preloadViewFn === 'function') {
          preloadViewFn(viewUrl);
        }
      });
    }

    router(path, function () {
      loadViewFn(viewUrl).then(function () {
        if (typeof onRender === 'function') {
          onRender();
        }
        if (typeof renderMenu === 'function') {
          renderMenu();
        }
      });
      if (metaConfig) {
        setMetaFn(metaConfig.title, metaConfig.description, metaConfig.canonical);
      }
      if (jsonLdConfig) {
        setJSONLDFn(jsonLdConfig.type, jsonLdConfig.data);
      }
    });
  }

  /**
   * Route: Home ('/')
   */
  defineRoute(
    "/",
    "/vibe/views/home.html",
    null,
    {
      title: "VIBE - Home",
      description: "Welcome to VIBE - Vitality • Intake • Body • Exercise. Discover body mass index fundamentals and health metrics.",
      canonical: window.location.origin + "/vibe/"
    },
    {
      type: "WebPage",
      data: {
        name: "VIBE Home",
        url: window.location.origin + "/vibe/"
      }
    }
  );

  /**
   * Route: Calculate BMI ('/calculate-bmi')
   */
  defineRoute(
    "/calculate-bmi",
    "/vibe/views/calculate-bmi.html",
    function () {
      if (typeof initCalculateBmi === 'function') initCalculateBmi();
    },
    {
      title: "VIBE - Calculate BMI",
      description: "Calculate your Body Mass Index (BMI) quickly and accurately with our interactive calculator.",
      canonical: window.location.origin + "/vibe/calculate-bmi"
    },
    {
      type: "WebApplication",
      data: {
        name: "Calculate BMI",
        url: window.location.origin + "/vibe/calculate-bmi"
      }
    }
  );

  /**
   * Route: BMI Statistics ('/bmi-statistics')
   */
  defineRoute(
    "/bmi-statistics",
    "/vibe/views/bmi-statistics.html",
    function () {
      if (typeof loadAndRenderBmiStatistics === 'function') loadAndRenderBmiStatistics();
    },
    {
      title: "VIBE - BMI Statistics",
      description: "View international BMI statistics across countries and demographics with interactive accordion cards.",
      canonical: window.location.origin + "/vibe/bmi-statistics"
    },
    {
      type: "DataFeed",
      data: {
        name: "BMI Statistics",
        url: window.location.origin + "/vibe/bmi-statistics"
      }
    }
  );

  /**
   * Route: BMI Categories ('/bmi-category')
   */
  defineRoute(
    "/bmi-category",
    "/vibe/views/bmi-category.html",
    function () {
      if (typeof loadAndRenderBmiCategories === 'function') loadAndRenderBmiCategories();
    },
    {
      title: "VIBE - BMI Categories",
      description: "Overview of standard World Health Organization BMI categories and classifications.",
      canonical: window.location.origin + "/vibe/bmi-category"
    },
    {
      type: "ItemList",
      data: {
        name: "BMI Categories",
        url: window.location.origin + "/vibe/bmi-category"
      }
    }
  );
}

window.AppRoutes = {
  registerRoutes
};
