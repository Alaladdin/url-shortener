document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form');

  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const formValues = loginForm.querySelectorAll('input');
    const username = formValues[0].value;
    const password = formValues[1].value;

    const createStatus = (mess, code = 'default') => {
      const statusElement = document.querySelector('.login-form__status');
      const statusCodes = {
        error: 'alert-danger',
        success: 'alert-success',
        warn: 'alert-warning',
        default: 'alert-info',
      };

      const getStatusCode = (key) => {
        const keyFormatted = key.toLowerCase();
        return Object.keys(statusCodes)
          .includes(keyFormatted) ? statusCodes[keyFormatted] : statusCodes.default;
      };

      // Clear all status classes
      Object.values(statusCodes).forEach((className) => statusElement.classList.remove(className));

      statusElement.innerHTML = mess;
      statusElement.classList.add('show', getStatusCode(code));
    };

    fetch('/login', {
      headers: { 'Content-Type': 'application/json' },
      // redirect: 'follow',
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        if (res.redirected) {
          createStatus('Success', 'success');
          window.location.href = res.url;
          return true;
        }
        const json = await res.json();
        if (!res.ok) throw new Error(Object.values(json));
        createStatus(json, 'success');
        return json;
      })
      .catch((err) => {
        createStatus(err, 'error');
      });
  };
});
