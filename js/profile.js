const user = currentUser();
if (!user) {
  window.location.replace('account.html');
} else {
  document.getElementById('profile-content').hidden = false;
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-phone').textContent = user.phone;
  document.getElementById('profile-team').textContent = user.team;
  document.getElementById('profile-search').textContent = readStore('f1-driver-search', '') || 'No saved search yet.';
  document.getElementById('logout').addEventListener('click', function () {
    if (saveStore('f1-session', '')) window.location.replace('account.html');
  });
}
