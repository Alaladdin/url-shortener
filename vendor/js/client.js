document.addEventListener('DOMContentLoaded', async () => {
  let timeOut;

  /**
   * Creates notification
   * @param {string} mess
   * @param {string} code
   * @param {number} timeout
   * @param {boolean} freezeShow
   */
  const createNotification = (
    mess, {
      code = 'default',
      timeout = 3,
      freezeShow = false,
    } = {},
  ) => {
    const notifElement = document.querySelector('.event-message');
    const statusCodes = {
      error: 'text-danger',
      success: 'text-success',
      warn: 'text-warning',
      default: 'text-muted',
    };
    const getStatusCode = (key) => {
      const keyFormatted = key.toLowerCase();
      return Object.keys(statusCodes)
        .includes(keyFormatted) ? statusCodes[keyFormatted] : statusCodes.default;
    };

    // Clear all status classes
    Object.values(statusCodes).forEach((className) => notifElement.classList.remove(className));

    notifElement.textContent = mess;
    notifElement.classList.add('show', getStatusCode(code));

    clearTimeout(timeOut);

    // Hide, if freezeShow is false
    if (!freezeShow) {
      timeOut = setTimeout(() => {
        notifElement.classList.remove('show');
      }, timeout * 1000);
    }
  };

  // Requests to the server
  const addUrl = async (url) => {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(data.message);
    }
    return data;
  };

  const GetUrlList = async () => {
    return fetch('/list/')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        return json;
      })
      .catch((err) => {
        toggleForm(false);
        createNotification(err, {
          code: 'error',
          freezeShow: true,
        });
        return { err };
      });
  };

  const deleteUrl = async (url) => fetch('/', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
    .then((res) => res.json())
    .then((res) => createNotification(res.message));

  const toggleForm = (active) => {
    const shortBtn = document.querySelector('.form-shorter__submit');
    shortBtn.disabled = !active;
  };

  const copyText = (str, callback) => {
    const el = document.createElement('textarea');
    el.classList.add('sr-only');
    el.value = str;
    document.body.appendChild(el);

    el.select();
    el.setSelectionRange(0, 99999); /* For mobile */

    document.execCommand('copy');
    document.body.removeChild(el);
    if (callback) callback();
  };

  const updateOnlineStatus = () => {
    const navigatorOnline = navigator.onLine;
    const notifMess = navigatorOnline ? 'online' : 'offline';
    const notifClass = navigatorOnline ? 'success' : 'error';
    const deleteBtns = document.querySelectorAll('.url__delete');

    deleteBtns.forEach((btn) => {
      btn.disabled = !navigatorOnline;
    });

    createNotification(notifMess, {
      code: notifClass,
      freezeShow: !navigatorOnline, // freeze only if offline
    });

    toggleForm(navigatorOnline);
  };

  const createUrlItem = (shortId, url, { onDelete }) => {
    const urlItem = document.createElement('div');
    const urlGroup = document.createElement('div');
    const urlFullCol = document.createElement('div');
    const urlShortCol = document.createElement('div');
    const urlFull = document.createElement('a');
    const urlShort = document.createElement('a');
    const btnsCol = document.createElement('div');
    const copyBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    urlItem.classList.add('url__item', 'row', 'flex-column', 'flex-sm-row', 'align-items-center');
    urlGroup.classList.add('url__group', 'col', 'mb-3', 'mb-sm-0');
    urlFullCol.classList.add('col');
    urlShortCol.classList.add('col');
    urlFull.classList.add('url__full', 'text-shorter', 'text-secondary');
    urlShort.classList.add('url__sort', 'text-shorter');
    copyBtn.classList.add('url__copy', 'btn', 'btn-sm', 'btn-secondary', 'mr-2');
    deleteBtn.classList.add('url__delete', 'btn', 'btn-sm', 'btn-danger');
    btnsCol.classList.add('col',
      'col-sm-4',
      'col-md-3',
      'col-lg-2',
      'text-sm-right',
      'd-flex',
      'justify-content-end');

    urlFull.href = url;
    urlShort.href = `/${shortId}`;
    urlFull.textContent = url;
    urlShort.textContent = `${window.location.origin}/${shortId}`;
    copyBtn.textContent = 'Copy';
    deleteBtn.textContent = 'Delete';

    urlFull.target = '_blank';
    urlShort.target = '_blank';

    urlFullCol.append(urlFull);
    urlShortCol.append(urlShort);
    urlGroup.append(urlFullCol);
    urlGroup.append(urlShortCol);
    btnsCol.append(copyBtn);
    btnsCol.append(deleteBtn);
    urlItem.append(urlGroup);
    urlItem.append(btnsCol);

    copyBtn.onclick = () => copyText(urlShort.textContent, () => {
      createNotification('copied');
    });

    deleteBtn.onclick = async () => {
      onDelete(urlItem, url);
    };

    return urlItem;
  };

  // Main side
  const { urlList, err } = await GetUrlList();
  const form = document.querySelector('.form-shorter');
  const formInput = document.querySelector('.form-shorter__input');

  if (!err) {
    const urlListElement = document.querySelector('.url-list');
    const getFormValue = () => formInput.value.trim();
    const getFormValueLength = () => getFormValue().length;
    const handlers = {
      onDelete(item, url) {
        item.remove();
        deleteUrl(url);
      },
    };

    toggleForm(getFormValueLength() > 0);
    formInput.oninput = () => toggleForm(getFormValueLength() > 0);
    window.ononline = updateOnlineStatus;
    window.onoffline = updateOnlineStatus;

    urlList.forEach((urlItem) => {
      const urlItemElement = createUrlItem(urlItem.shortId, urlItem.url, handlers);
      urlListElement.append(urlItemElement);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (getFormValueLength() <= 0) return;

      try {
        const res = await addUrl(getFormValue());
        const urlItem = createUrlItem(res.shortId, res.url, handlers);
        urlListElement.append(urlItem);
        formInput.value = '';
        toggleForm(getFormValueLength() > 0);
        createNotification('url was created');
      } catch (error) {
        createNotification(error.message, { code: 'error' });
      }
    });
  } else {
    formInput.disabled = true;
    form.addEventListener('submit', (e) => e.preventDefault());
  }
});
