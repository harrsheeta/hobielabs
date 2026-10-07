(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const fallback = document.querySelector('#form-email-fallback');
  const button = form.querySelector('button[type="submit"]');
  const fields = ['name','email','idea'].map(id => document.getElementById(id));
  const label = button.innerHTML;
  let sending = false;
  form.addEventListener('submit', async event => {
    if (sending) { event.preventDefault(); return; }
    fields.forEach(field => { field.value = field.value.trim(); });
    if (!form.reportValidity()) { event.preventDefault(); return; }
    // The provider's normal form flow supports local previews using the _url field.
    if (location.protocol === 'file:') {
      status.textContent = 'Opening secure email submission…';
      return;
    }
    event.preventDefault();
    sending = true;
    const payload = Object.fromEntries(new FormData(form).entries());
    const readOnly = fields.map(field => field.readOnly);
    button.disabled = true;
    button.textContent = 'SENDING…';
    fields.forEach(field => { field.readOnly = true; });
    form.setAttribute('aria-busy', 'true');
    fallback.hidden = true;
    status.textContent = 'Sending your brief…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/collab@hobielabs.com', {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload), signal:controller.signal
      });
      if (!response.ok) throw new Error('Service unavailable');
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') {
        if (/activat/i.test(String(result.message || ''))) {
          status.textContent = 'Email delivery is awaiting activation. Please email your brief directly for now.';
          fallback.hidden = false;
          return;
        }
        throw new Error('Submission not accepted');
      }
      form.reset();
      status.textContent = 'Your brief was submitted. Thanks—we’ll be in touch.';
    } catch {
      status.textContent = 'We couldn’t confirm submission. Your details are still here. Please try again or email us directly.';
      fallback.hidden = false;
    } finally {
      clearTimeout(timer);
      sending = false;
      button.disabled = false;
      button.innerHTML = label;
      fields.forEach((field,index) => { field.readOnly = readOnly[index]; });
      form.setAttribute('aria-busy','false');
    }
  });
})();
