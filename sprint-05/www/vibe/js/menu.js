const menuItems = [
  { label: 'Home', href: '/vibe/' },
  { label: 'Calculate BMI', href: '/vibe/calculate-bmi' },
  { label: 'BMI Statistics', href: '/vibe/bmi-statistics' },
  { label: 'BMI Categories', href: '/vibe/bmi-category' }
];

function renderMenu() {
  const navContainer = document.querySelector('.navlinks');
  if (!navContainer) {
    return;
  }

  const path = window.location.pathname;
  const list = document.createElement('ul');
  list.className = 'navbar-nav ms-auto mb-2 mb-lg-0 navlinks gap-lg-1';

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nav-item';

    const a = document.createElement('a');
    a.className = 'nav-link';
    a.textContent = item.label;
    a.href = item.href;

    const isHome = (item.href === '/vibe/' && (path === '/vibe/' || path === '/vibe/index.html' || path === '/vibe'));
    const cleanPath = path.replace(/\/+$/, '').replace(/\.html$/, '');
    const cleanHref = item.href.replace(/\/+$/, '').replace(/\.html$/, '');
    const isCurrent = cleanPath === cleanHref;

    if (isHome || isCurrent) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  navContainer.replaceWith(list);
}

document.addEventListener('DOMContentLoaded', renderMenu);
