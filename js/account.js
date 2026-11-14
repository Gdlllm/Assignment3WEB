// Browser-only account simulation: store a hash instead of the original password.
async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}
document.getElementById('signup-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = this;
  const result = document.getElementById('signup-result');
  result.textContent = '';
  if (!validateFields(form)) return;
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const accounts = getAccounts();
  if (accounts.some(user => user.email === email)) {
    result.textContent = 'This email already has an account. Please log in.'; return;
  }
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const user = {
      name: document.getElementById('signup-name').value.trim(), email: email,
      phone: document.getElementById('signup-phone').value.trim(),
      team: document.getElementById('signup-team').value,
      passwordHash: await hashPassword(document.getElementById('signup-password').value)
    };
    accounts.push(user);
    if (!saveStore('f1-accounts', accounts)) throw new Error('storage');
    form.reset();
    result.textContent = 'Account created. Log in to open your profile.';
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').focus();
  } catch { result.textContent = 'Could not save your account. Allow browser storage and try again.'; }
  finally { button.disabled = false; }
});
document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const result = document.getElementById('login-result');
  result.textContent = '';
  if (!validateFields(this)) return;
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const button = this.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const hash = await hashPassword(document.getElementById('login-password').value);
    const user = getAccounts().find(user => user.email === email && user.passwordHash === hash);
    if (!user) { result.textContent = 'Email or password is incorrect. Please try again.'; return; }
    if (saveStore('f1-session', email)) window.location.href = 'profile.html';
    else result.textContent = 'Allow browser storage to log in.';
  } catch { result.textContent = 'Login is unavailable. Please reload and try again.'; }
  finally { button.disabled = false; }
});
