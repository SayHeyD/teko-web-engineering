/**
 * View Loader Module
 * 
 * Asynchronously fetches, caches, and preloads partial HTML view templates,
 * rendering them into the main DOM container (#app).
 */

const viewCache = new Map();

/**
 * Preloads and caches an external HTML template in memory.
 *
 * @param {string} url - View template URL.
 * @returns {Promise<string>} Resolves with the HTML content string.
 */
function preloadView(url) {
  if (!url) {
    return Promise.reject(new Error('View URL is required'));
  }

  if (viewCache.has(url)) {
    return viewCache.get(url);
  }

  const fetchPromise = fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error loading view ${url}: ${res.status}`);
      }
      return res.text();
    })
    .catch((err) => {
      viewCache.delete(url);
      throw err;
    });

  viewCache.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Fetches an external HTML template (from cache if preloaded) and injects it into a container element.
 *
 * @param {string} url - View template URL.
 * @param {string} [containerId='app'] - Target DOM element ID.
 * @returns {Promise<void>} Resolves when the HTML has been inserted.
 */
function loadView(url, containerId = 'app') {
  return preloadView(url)
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      }
    });
}

/**
 * Clears the view template cache.
 */
function clearViewCache() {
  viewCache.clear();
}

window.ViewLoader = {
  loadView,
  preloadView,
  clearViewCache,
  viewCache
};
window.loadView = loadView;
window.preloadView = preloadView;
