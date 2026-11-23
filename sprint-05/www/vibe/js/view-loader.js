/**
 * View Loader Module
 * 
 * Asynchronously fetches partial HTML view templates and renders them
 * into the main DOM container (#app).
 */

/**
 * Fetches an external HTML template and injects it into a container element.
 *
 * @param {string} url - View template URL.
 * @param {string} [containerId='app'] - Target DOM element ID.
 * @returns {Promise<void>} Resolves when the HTML has been inserted.
 */
function loadView(url, containerId = 'app') {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error loading view ${url}: ${res.status}`);
      }
      return res.text();
    })
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      }
    });
}

window.ViewLoader = {
  loadView
};
window.loadView = loadView;
