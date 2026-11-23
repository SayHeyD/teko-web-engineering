/**
 * SPA Router Facade (`page.js`)
 * 
 * Acts as the centralized Facade aggregating subsystem modules:
 * - Router: Core routing engine, history API, navigation, event interception.
 * - SEO: Metadata and structured JSON-LD data updates.
 * - ViewLoader: Asynchronous partial HTML template fetching and rendering.
 * - AppRoutes: Application route definitions and lifecycle hooks.
 * 
 * Provides a unified `page` callable interface and coordinates application startup.
 */

// Instantiate the router subsystem
const routerInstance = new window.Router();

/**
 * Primary Facade Function
 *
 * - `page(fn)`: Registers wildcard/middleware callback.
 * - `page(path, fn, ...)`: Registers route callbacks for a specific path.
 * - `page(path)`: Navigates programmatically to a path.
 * - `page()`: Starts the router and dispatches current location.
 *
 * @param {string|Function} [path] - Target path or handler callback.
 * @param {...Function} callbacks - Route handlers.
 */
function page(path, ...callbacks) {
  if (typeof path === 'function') {
    routerInstance.register(path, ...callbacks);
    return;
  }
  if (typeof path === 'string' && callbacks.length > 0) {
    routerInstance.register(path, ...callbacks);
    return;
  }
  if (typeof path === 'string') {
    routerInstance.show(path);
    return;
  }
  routerInstance.start();
}

// ===========================================================================
// Router Subsystem Delegation
// ===========================================================================

page.base = function (base) {
  if (arguments.length === 0) return routerInstance.base();
  return routerInstance.base(base);
};

page.show = function (path) {
  routerInstance.show(path);
};

page.replace = function (path) {
  routerInstance.replace(path);
};

page.preload = function (path, handler) {
  if (typeof handler === 'function') {
    routerInstance.registerPreload(path, handler);
  } else {
    routerInstance.preload(path);
  }
};

page.start = function () {
  routerInstance.start();
};

// ===========================================================================
// SEO & Metadata Subsystem Delegation
// ===========================================================================

page.setMeta = function (title, description, canonical) {
  if (window.SEO && typeof window.SEO.setMeta === 'function') {
    window.SEO.setMeta(title, description, canonical);
  } else if (typeof setMeta === 'function') {
    setMeta(title, description, canonical);
  }
};

page.setJSONLD = function (type, data) {
  if (window.SEO && typeof window.SEO.setJSONLD === 'function') {
    window.SEO.setJSONLD(type, data);
  } else if (typeof setJSONLD === 'function') {
    setJSONLD(type, data);
  }
};

// ===========================================================================
// ViewLoader Subsystem Delegation
// ===========================================================================

page.loadView = function (url, containerId) {
  if (window.ViewLoader && typeof window.ViewLoader.loadView === 'function') {
    return window.ViewLoader.loadView(url, containerId);
  } else if (typeof loadView === 'function') {
    return loadView(url, containerId);
  }
  return Promise.reject(new Error('ViewLoader subsystem is unavailable'));
};

page.preloadView = function (url) {
  if (window.ViewLoader && typeof window.ViewLoader.preloadView === 'function') {
    return window.ViewLoader.preloadView(url);
  } else if (typeof preloadView === 'function') {
    return preloadView(url);
  }
  return Promise.reject(new Error('ViewLoader subsystem is unavailable'));
};

// ===========================================================================
// Subsystem Exposure (for debugging or direct extension)
// ===========================================================================

page.subsystems = {
  router: routerInstance,
  seo: window.SEO,
  viewLoader: window.ViewLoader,
  routes: window.AppRoutes
};

// Expose globally
window.page = page;

// ===========================================================================
// Initialization & Route Registration
// ===========================================================================

if (window.AppRoutes && typeof window.AppRoutes.registerRoutes === 'function') {
  window.AppRoutes.registerRoutes(page, {
    loadView: page.loadView,
    preloadView: page.preloadView,
    setMeta: page.setMeta,
    setJSONLD: page.setJSONLD
  });
}

// Automatically start router when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    page.start();
  });
} else {
  page.start();
}
