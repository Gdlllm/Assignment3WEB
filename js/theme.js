// Apply the saved theme before drawing the page.
try {
  const theme = JSON.parse(localStorage.getItem('f1-theme'));
  document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
} catch { document.documentElement.setAttribute('data-bs-theme', 'light'); }
