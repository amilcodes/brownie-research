(() => {
  'use strict';
  const theme = new URLSearchParams(location.search).get('theme');
  if (['terminal', 'classic'].includes(theme)) document.documentElement.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#current-year').textContent = String(new Date().getFullYear());
  });
})();
