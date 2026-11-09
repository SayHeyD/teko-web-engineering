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
  list.className = 'navlinks';

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = item.label;

    if (path === item.href || (item.href === '/vibe/' && (path === '/vibe/' || path === '/vibe/index.html'))) {
      a.className = 'active';
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
