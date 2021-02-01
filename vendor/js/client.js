const addUrl = async (url) => {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  if (response.status !== 201) {
    throw new Error(data.msg);
  }
  return data;
};

const GetUrlList = async () => {
  const response = await fetch('/list/');
  return await response.json();
};

const deleteUrl = async (url) => {
  const response = await fetch(`/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  console.log(response);

  return await response.json();
};

const form = document.querySelector('.form-shorter');

const createUrlItem = (shortId, url, { onDelete }) => {
  const urlItem = document.createElement('div');
  const urlGroup = document.createElement('div');
  const urlFull = document.createElement('a');
  const urlShort = document.createElement('a');
  const deleteBtn = document.createElement('button');

  urlItem.classList.add('url__item', 'input-group', 'my-2', 'd-flex', 'justify-content-between', 'align-items-center');
  urlGroup.classList.add('url__group');
  urlFull.classList.add('url__full', 'text-secondary');
  urlShort.classList.add('url__sort');
  deleteBtn.classList.add('btn', 'btn-danger');

  urlFull.href = url;
  urlShort.href = `/${shortId}`;

  urlFull.textContent = url;
  urlShort.textContent = `${window.location.origin}/${shortId}`;
  deleteBtn.textContent = 'Delete';

  urlFull.target = '_blank';
  urlShort.target = '_blank';

  urlGroup.append(urlFull);
  urlGroup.append(urlShort);
  urlItem.append(urlGroup);
  urlItem.append(deleteBtn);

  deleteBtn.onclick = async () => {
    onDelete(urlItem, url);
  };

  return urlItem;
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formInput = document.querySelector('.form-shorter__url');
  const urlListElement = document.querySelector('.url-list');
  const formValue = formInput.value.trim();

  if (formValue.length <= 0) return;

  const handlers = {
    onDelete(item, url) {
      item.remove();
      deleteUrl(url);
    },
  };

  try {
    const res = await addUrl(formValue);
    const urlItem = createUrlItem(res.shortId, res.url, handlers);
    urlListElement.append(urlItem);
  } catch (err) {
    console.error(err);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlListElement = document.querySelector('.url-list');
  const formInput = document.querySelector('.form-shorter__url');

  const shortBtn = document.querySelector('.form-shorter__submit');
  const { urlList } = await GetUrlList();
  const handlers = {
    onDelete(item, url) {
      item.remove();
      deleteUrl(url);
    },
  };

  urlList.forEach(urlItem => {
    const urlItemElement = createUrlItem(urlItem.shortId, urlItem.url, handlers);
    urlListElement.append(urlItemElement);
  });

  shortBtn.disabled = formInput.value <= 0;
  formInput.oninput = () => {
    shortBtn.disabled = formInput.value <= 0;
  };
});