// JavaScript validation is shared by all forms. HTML forms have novalidate.
function validateField(field) {
  const value = field.type === 'password' ? field.value : field.value.trim();
  const rule = field.dataset.rule;
  let message = '';
  if (!value) message = 'Please fill in this field.';
  else if (rule === 'name' && value.length < 2) message = 'Please enter at least two characters.';
  else if (rule === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter an email like name@example.com.';
  else if (rule === 'phone' && !/^\+?[0-9 ()-]+$/.test(value)) message = 'Use digits, spaces, brackets or a leading +.';
  else if (rule === 'phone' && (value.replace(/\D/g, '').length < 10 || value.replace(/\D/g, '').length > 15)) message = 'Enter a phone number with 10 to 15 digits.';
  else if (rule === 'password' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/.test(value)) message = 'Use 8+ characters, uppercase, lowercase, a number and a symbol.';
  else if (rule === 'confirm' && value !== document.getElementById('signup-password').value) message = 'The passwords do not match.';
  else if (rule === 'message' && value.length < 10) message = 'Please write at least 10 characters.';
  document.getElementById(field.id + '-error').textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return message === '';
}
function validateFields(container) {
  let firstError = null;
  container.querySelectorAll('[data-rule]').forEach(function (field) {
    if (!validateField(field) && !firstError) firstError = field;
  });
  if (firstError) firstError.focus();
  return firstError === null;
}
document.querySelectorAll('[data-rule]').forEach(function (field) {
  field.addEventListener('input', function () {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});
