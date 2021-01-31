const createUrl = async (url) => {
  const response = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  return await response.json();
};

const GetUrlList = async () => {
  const response = await fetch('http://localhost:3000/list/');
  return await response.json();
};

const deleteUrl = async (url) => {
  console.log('trying...');
  const response = await fetch(`http://localhost:3000/`, {
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
  urlShort.href = `http://localhost:3000/${shortId}`;

  urlFull.textContent = url;
  urlShort.textContent = `http://localhost:3000/${shortId}`;
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
  const res = await createUrl(formInput.value.trim());

  const handlers = {
    onDelete(item, url) {
      item.remove();
      deleteUrl(url);
    },
  };
  const urlItem = createUrlItem(res.shortId, res.url, handlers);

  urlListElement.append(urlItem);
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlListElement = document.querySelector('.url-list');
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
});