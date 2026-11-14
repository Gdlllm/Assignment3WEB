const messageForm = document.getElementById('message-form');
const steps = messageForm.querySelectorAll('.form-step');
const result = document.getElementById('message-result');
function showStep(number) {
  steps.forEach(function (step, index) { step.hidden = index !== number; });
  steps[number].querySelector('input, select, textarea').focus();
}
document.getElementById('message-next').addEventListener('click', function () {
  if (validateFields(steps[0])) showStep(1);
});
document.getElementById('message-back').addEventListener('click', function () { showStep(0); });
$(messageForm).on('submit', function (event) {
  event.preventDefault();
  if (this.getAttribute('aria-busy') === 'true') return;
  if (steps[1].hidden) { $('#message-next').trigger('click'); return; }
  if (!validateFields(steps[1])) return;
  const $form = $(this).attr('aria-busy', 'true');
  const $controls = $form.find(':input:enabled').prop('disabled', true);
  $form.find('.submit-label').text('Please wait...');
  result.textContent = '';
  // Simulate a request, then save a local draft. No message is sent.
  setTimeout(function () {
    const saved = saveStore('f1-message', {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      topic: document.getElementById('contact-topic').value,
      message: document.getElementById('contact-message').value.trim()
    });
    $controls.prop('disabled', false);
    $form.attr('aria-busy', 'false').find('.submit-label').text('Save message');
    result.textContent = saved ? 'Your message draft is saved in this browser.' : 'Draft could not be saved. Please allow browser storage.';
    if (saved) $('#race-toast').stop(true, true).fadeIn(150).delay(2500).fadeOut(300);
  }, 1200);
});
