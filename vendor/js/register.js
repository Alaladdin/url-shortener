document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('.form');

  registerForm.onsubmit = (e) => {
    e.preventDefault();
    const formValues = registerForm.querySelectorAll('input');
    const username = formValues[0].value;
    const password = formValues[1].value;

    const validateForm = (data) => {
      const errs = [];
      const usernameLen = data.username.length;
      const passLen = data.password.length;
      const rules = {
        usernameMinLen: 2,
        usernameMaxLen: 10,
        passMinLen: 6,
        passMaxLen: 12,
      };
      const errorCodes = {
        usernameEmpty: 'username value is empty',
        usernameMinLen: `username min length is ${rules.usernameMinLen}`,
        usernameMaxLen: `username max length is ${rules.usernameMaxLen}`,

        passEmpty: 'pass value is empty',
        passMinLen: `pass min length is ${rules.passMinLen}`,
        passMaxLen: `pass max length is ${rules.passMaxLen}`,
      };

      if (rules.usernameMinLen > usernameLen) {
        errs.push(errorCodes.usernameMinLen);
      }
      if (rules.usernameMaxLen < usernameLen) {
        errs.push(errorCodes.usernameMaxLen);
      }
      if (passLen <= rules.passMinLen) {
        errs.push(errorCodes.passMinLen);
      }
      if (rules.passMaxLen <= passLen) {
        errs.push(errorCodes.passMaxLen);
      }

      return errs;
    };

    const errors = validateForm({ username, password });

    const createStatus = (mess, code = 'default') => {
      const statusElement = document.querySelector('.register-form__status');
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

    if (errors.length > 0) {
      const errorsMess = errors.join('<br>');
      createStatus(errorsMess, 'error');
    } else {
      fetch('/register', {
        headers: { 'Content-Type': 'application/json' },
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
          if (!res.ok) throw new Error(json);
          return json;
        })
        .catch((err) => {
          createStatus(err, 'error');
        });
    }
  };
});
