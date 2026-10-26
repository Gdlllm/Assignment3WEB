// A two-step message form. The input values stay in place when moving back.
const messageForm = document.getElementById('message-form');

if (messageForm) {
  const steps = messageForm.querySelectorAll('.form-step');
  const result = document.getElementById('message-result');

  function showStep(number) {
    steps.forEach(function (step, index) {
      step.hidden = index !== number;
    });
  }

  function checkStep(step) {
    const fields = step.querySelectorAll('[required]');
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        fields[i].reportValidity();
        return false;
      }
    }
    return true;
  }

  document.getElementById('message-next').addEventListener('click', function () {
    if (checkStep(steps[0])) {
      result.textContent = '';
      showStep(1);
    }
  });

  document.getElementById('message-back').addEventListener('click', function () {
    showStep(0);
  });

  messageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (checkStep(steps[1])) {
      result.textContent = 'Form completed! This demo does not send messages.';
    }
  });
}
