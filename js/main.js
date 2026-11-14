// Safe storage helpers keep damaged or unavailable storage from breaking the site.
function readStore(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value === null ? fallback : value; }
  catch { return fallback; }
}
function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { document.getElementById('storage-message').hidden = false; return false; }
}
function getAccounts() {
  const accounts = readStore('f1-accounts', []);
  return Array.isArray(accounts) ? accounts.filter(user => user && typeof user.email === 'string' && typeof user.passwordHash === 'string') : [];
}
function currentUser() { return getAccounts().find(user => user.email === readStore('f1-session', '')); }
const themeToggle = document.getElementById('theme-toggle');
function showThemeButton() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.textContent = dark ? 'Light mode' : 'Dark mode';
}
themeToggle.addEventListener('click', function () {
  const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', next);
  saveStore('f1-theme', next);
  showThemeButton();
});
showThemeButton();
if (currentUser()) {
  document.getElementById('account-link').href = 'profile.html';
  document.getElementById('account-link').textContent = 'My profile';
}
// Left and right arrows move focus between menu links.
const nav = document.querySelector('.main-nav');
const links = Array.from(nav.querySelectorAll('a'));
nav.addEventListener('keydown', function (event) {
  const index = links.indexOf(document.activeElement);
  if (index < 0 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const move = event.key === 'ArrowRight' ? 1 : -1;
  links[(index + move + links.length) % links.length].focus();
});
document.querySelectorAll('.faq-question').forEach(function (button) {
  button.addEventListener('click', function () {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    button.nextElementSibling.hidden = open;
    button.nextElementSibling.classList.toggle('open', !open);
  });
});
const clock = document.getElementById('current-time');
if (clock) {
  function showTime() { clock.textContent = new Date().toLocaleString(); }
  showTime(); setInterval(showTime, 1000);
}
