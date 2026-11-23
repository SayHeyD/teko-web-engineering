/**
 * Core Router Module
 * 
 * Handles URL pattern matching, client-side history navigation (pushState/popstate),
 * base path normalization, link interception, and route dispatching.
 */

class Router {
  constructor() {
    this.basePath = '';
    this.routes = [];
    this.preloadHandlers = new Map();
    this.started = false;
  }

  /**
   * Normalizes a path string to ensure a consistent leading slash.
   *
   * @param {string} p - Input path string.
   * @returns {string} Normalized path starting with '/'.
   */
  normalizePath(p) {
    if (!p) return '/';
    let path = p.trim();
    if (!path.startsWith('/')) path = '/' + path;
    return path;
  }

  /**
   * Extracts and decodes current relative pathname, removing base path prefix.
   *
   * @returns {string} Relative pathname normalized for route matching.
   */
  getPathname() {
    let pathname = decodeURI(window.location.pathname || '/');
    if (this.basePath && pathname.startsWith(this.basePath)) {
      pathname = pathname.slice(this.basePath.length);
    }
    if (!pathname.startsWith('/')) {
      pathname = '/' + pathname;
    }
    return pathname;
  }

  /**
   * Checks if a route pattern matches the given pathname.
   *
   * @param {string} routePath - Route pattern.
   * @param {string} currentPath - Current pathname.
   * @returns {boolean} True if matched.
   */
  matchRoute(routePath, currentPath) {
    if (routePath === '*') return true;

    const cleanRoute = routePath.replace(/\/+$/, '') || '/';
    const cleanCurrent = currentPath.replace(/\/+$/, '') || '/';

    if (cleanRoute === cleanCurrent) return true;

    const withoutHtmlRoute = cleanRoute.replace(/\.html$/, '');
    const withoutHtmlCurrent = cleanCurrent.replace(/\.html$/, '');
    if (withoutHtmlRoute === withoutHtmlCurrent) return true;

    if ((cleanRoute === '/' || cleanRoute === '/index.html') &&
        (cleanCurrent === '/' || cleanCurrent === '/index.html' || cleanCurrent === '')) {
      return true;
    }

    return false;
  }

  /**
   * Dispatches navigation callbacks for the current or specified route.
   *
   * @param {string} [pathname] - Target pathname.
   */
  dispatch(pathname) {
    const current = pathname || this.getPathname();
    let handled = false;

    for (const route of this.routes) {
      if (this.matchRoute(route.path, current)) {
        for (const cb of route.callbacks) {
          cb();
        }
        handled = true;
        break;
      }
    }

    if (!handled) {
      for (const route of this.routes) {
        if (route.path === '/' || route.path === '*') {
          for (const cb of route.callbacks) {
            cb();
          }
          break;
        }
      }
    }
  }

  /**
   * Registers a route path or wildcard middleware with callback handlers.
   *
   * @param {string|Function} path - Route path or middleware function.
   * @param {...Function} callbacks - Callback handlers.
   */
  register(path, ...callbacks) {
    if (typeof path === 'function') {
      this.routes.push({
        path: '*',
        callbacks: [path, ...callbacks]
      });
      return;
    }

    if (typeof path === 'string' && callbacks.length > 0) {
      this.routes.push({
        path: this.normalizePath(path),
        callbacks: callbacks
      });
    }
  }

  /**
   * Registers a preloading callback handler for a specific route path.
   *
   * @param {string} path - Route path.
   * @param {Function} handler - Preloading callback.
   */
  registerPreload(path, handler) {
    if (typeof path === 'string' && typeof handler === 'function') {
      this.preloadHandlers.set(this.normalizePath(path), handler);
    }
  }

  /**
   * Triggers the preloading callback associated with a route path.
   *
   * @param {string} [pathname] - Route pathname to preload.
   */
  preload(pathname) {
    let current = pathname || this.getPathname();
    if (this.basePath && current.startsWith(this.basePath)) {
      current = current.slice(this.basePath.length);
    }
    if (!current.startsWith('/')) {
      current = '/' + current;
    }

    for (const [routePath, handler] of this.preloadHandlers.entries()) {
      if (this.matchRoute(routePath, current)) {
        if (typeof handler === 'function') {
          handler();
        }
        return;
      }
    }
  }

  /**
   * Configures or retrieves base path prefix.
   *
   * @param {string} [base] - Base URL path.
   * @returns {string|void} Current base path if called without arguments.
   */
  base(base) {
    if (arguments.length === 0) return this.basePath;
    this.basePath = (base || '').replace(/\/+$/, '');
  }

  /**
   * Navigates to a path using pushState and triggers dispatch.
   *
   * @param {string} path - Target path.
   */
  show(path) {
    let target = this.normalizePath(path);
    if (this.basePath && !target.startsWith(this.basePath)) {
      target = this.basePath + target;
    }
    window.history.pushState({}, '', target);
    this.dispatch();
  }

  /**
   * Replaces current URL with replaceState and triggers dispatch.
   *
   * @param {string} path - Target path.
   */
  replace(path) {
    let target = this.normalizePath(path);
    if (this.basePath && !target.startsWith(this.basePath)) {
      target = this.basePath + target;
    }
    window.history.replaceState({}, '', target);
    this.dispatch();
  }

  /**
   * Starts event listeners for popstate, internal link click interception, and hover preloading.
   */
  start() {
    if (this.started) {
      this.dispatch();
      return;
    }
    this.started = true;

    window.addEventListener('popstate', () => {
      this.dispatch();
    });

    const getValidInternalLink = (target) => {
      const link = target.closest('a');
      if (!link) return null;

      if (link.target && link.target !== '_self') return null;
      if (link.hasAttribute('download')) return null;
      if (link.getAttribute('rel') === 'external') return null;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;

      if (link.origin && link.origin !== window.location.origin) return null;

      const linkPath = link.pathname;
      if (this.basePath && !linkPath.startsWith(this.basePath)) return null;

      return link;
    };

    // Preload views on hover or touchstart
    const handlePreload = (e) => {
      const link = getValidInternalLink(e.target);
      if (!link) return;
      this.preload(link.pathname);
    };

    document.addEventListener('mouseover', handlePreload, { passive: true });
    document.addEventListener('touchstart', handlePreload, { passive: true });

    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = getValidInternalLink(e.target);
      if (!link) return;

      e.preventDefault();
      this.show(link.pathname);
    });

    this.dispatch();
  }
}

window.Router = Router;
