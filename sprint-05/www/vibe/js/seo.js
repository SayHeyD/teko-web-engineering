/**
 * SEO & Metadata Module
 * 
 * Manages dynamic document title, meta tags, canonical links, Open Graph tags,
 * and JSON-LD structured schema injections for SPA views.
 */

/**
 * Dynamically updates document title, meta description, canonical link,
 * and Open Graph tags.
 *
 * @param {string} title - Page title.
 * @param {string} description - Meta description.
 * @param {string} canonical - Full canonical URL.
 */
function setMeta(title, description, canonical) {
  document.title = title;

  // Standard Meta Description
  let metaDesc = document.querySelector("meta[name='description']");
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical Link
  let linkCanonical = document.querySelector("link[rel='canonical']");
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonical);

  // Open Graph Title
  let ogTitle = document.querySelector("meta[property='og:title']");
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Open Graph Description
  let ogDesc = document.querySelector("meta[property='og:description']");
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);
}

/**
 * Injects or updates structured JSON-LD schema markup.
 *
 * @param {string} type - Schema.org type (e.g. 'WebPage', 'WebApplication').
 * @param {Object} data - Schema property data.
 */
function setJSONLD(type, data) {
  let script = document.querySelector("script[type='application/ld+json']");
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    ...data
  }, null, 2);
}

window.SEO = {
  setMeta,
  setJSONLD
};
window.setMeta = setMeta;
window.setJSONLD = setJSONLD;
