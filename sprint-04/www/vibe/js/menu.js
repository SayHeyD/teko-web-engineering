const menuItems = [
  { label: 'Home', href: '/vibe/' },
  { label: 'Calculate BMI', href: '/vibe/calculate-bmi.html' },
  { label: 'BMI Statistics', href: '/vibe/bmi-statistics.html' },
  { label: 'BMI Categories', href: '/vibe/bmi-category.html' }
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

    const isHome = (item.href === '/vibe/' && (path === '/vibe/' || path === '/vibe/index.html' || path === '/vibe'));
    const isCurrent = path === item.href || path.endsWith(item.href);

    if (isHome || isCurrent) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
      a.href = '#';
      a.setAttribute('onclick', 'return false;');
    } else {
      a.href = item.href;
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  navContainer.replaceWith(list);
}

document.addEventListener('DOMContentLoaded', renderMenu);
