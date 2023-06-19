import { URL, fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'slim-select/dist/slimselect.css';

function getRefs() {
  return {
    select: document.querySelector('.breed-select'),
    loader: document.querySelector('.loader'),
    error: document.querySelector('.error'),
    info: document.querySelector('.cat-info'),
  };
}

const refs = getRefs();
refs.select.style.maxWidth = '360px';
isHidden([refs.select, refs.error, refs.info]);
isVisually([refs.loader]);

const selectInstance = new SlimSelect({
  select: refs.select,
  settings: {
    placeholderText: 'Choose the breed of the cat',
    allowDeselect: true,
    maxSelected: 1,
  },
});

function isVisually(arr) {
  arr.forEach(element => {
    if (element.classList.contains('visually-hidden')) {
      element.classList.remove('visually-hidden');
    }
  });
}

function isHidden(arr) {
  arr.forEach(element => {
    if (!element.classList.contains('visually-hidden')) {
      element.classList.add('visually-hidden');
    }
  });
}

let str = 'breeds';
let url = URL + str;
fetchBreeds(url).then(addDataSelectBreeds).catch(isError);

function addDataSelectBreeds(arrBreeds) {
  if (!arrBreeds || arrBreeds.length === 0) {
    isHidden([refs.loader]);
    isVisually([refs.error]);
    Notify.failure(refs.error.textContent);
    return;
  }
  const dataSelectBreeds = arrBreeds.map(({ name, id }) => {
    return { text: name, value: id };
  });
  const firstOption = [
    {
      text: '',
      placeholder: true,
    },
  ];
  const allOptions = [...firstOption, ...dataSelectBreeds];
  selectInstance.setData(allOptions);
  isHidden([refs.loader, refs.error, refs.info]);
  isVisually([refs.select]);
}

function isError(error) {
  isVisually([refs.error]);
  isHidden([refs.loader, refs.info]);
  Notify.failure(refs.error.textContent);
  console.error('Error status: ', error);
}

refs.select.addEventListener('change', onSelect);

function onSelect(event) {
  if (event.target.value === '') {
    return;
  }
  str = 'images/search?';
  const searchParams = new URLSearchParams({
    breed_ids: event.target.value,
    limit: 1,
    size: 'small',
  });
  url = URL + str + searchParams;
  isHidden([refs.info, refs.error]);
  isVisually([refs.loader]);
  fetchCatByBreed(url).then(addInfo).catch(isError);
}

function addInfo(arrInfo) {
  const markUp =
    arrInfo
      .map(
        ({ url, breeds }) =>
          `<img
             src="${url}"
             alt="${breeds[0].name || 'cat image'}"
          />`
      )
      .join('') +
    `<div class="info">
            <h1 class="info-title">${arrInfo[0].breeds[0].name}</h1>
            <p class="info-description">${arrInfo[0].breeds[0].description}</p>
            <p class="info-description">Country of Origin: ${arrInfo[0].breeds[0].origin}</p>
            <p class="info-description">Temperament: ${arrInfo[0].breeds[0].temperament}</p>
     </div>`;
  refs.info.innerHTML = markUp;
  isHidden([refs.loader]);
  isVisually([refs.info]);
}