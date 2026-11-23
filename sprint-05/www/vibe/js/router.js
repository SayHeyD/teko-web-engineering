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
   * Starts event listeners for popstate and internal link click interception.
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

    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = e.target.closest('a');
      if (!link) return;

      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;
      if (link.getAttribute('rel') === 'external') return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      if (link.origin && link.origin !== window.location.origin) return;

      const linkPath = link.pathname;
      if (this.basePath && !linkPath.startsWith(this.basePath)) return;

      e.preventDefault();
      this.show(linkPath);
    });

    this.dispatch();
  }
}

window.Router = Router;
