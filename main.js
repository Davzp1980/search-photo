import { loadPhotos } from './src/js/photo-api';
import { photosTemplate } from './src/js/photo-render';
import iziToast from 'izitoast';
import './node_modules/izitoast/dist/css/iziToast.min.css';
import {
  turnOffSearchBtn,
  turnOnSearchBtn,
  showLoader,
  hideLoader,
  observeStatus,
  showPubliciti,
} from './src/js/help-funclions';

export const refs = {
  searchFormElem: document.querySelector('.search-form'),
  imagesListElem: document.querySelector('.img-list'),
  loaderElem: document.querySelector('.loader'),
  searchBtnElem: document.querySelector('.search-btn'),
  inputElem: document.querySelector('.search-input'),
  ebserveElem: document.querySelector('.observer'),
  observerLoader: document.querySelector('.observer-loader'),
  publicityElem: document.querySelector('.content'),
  closeBtn: document.querySelector('.close-btn'),
};

export const observer = new IntersectionObserver(intersectionObserve);
export let query = '';
export let currentPage = 1;
export let maxPages = 1;

refs.searchFormElem.addEventListener('submit', async e => {
  e.preventDefault();

  currentPage = 1;
  const searchRequest = e.target.elements.query.value.trim();
  query = searchRequest;
  if (searchRequest === '') {
    console.log('error');
    iziToast.error({
      message: 'The search field must not be empty',
      position: 'topRight',
    });
    hideLoader();
    return;
  }
  showLoader();

  try {
    const res = await loadPhotos(searchRequest, currentPage);
    if (res.hits.length === 0) {
      iziToast.info({
        message: 'No photos by your request',
        position: 'topRight',
      });
      hideLoader();
      turnOffSearchBtn();
      refs.searchFormElem.reset();
      return;
    }
    maxPages = Math.ceil(res.totalHits / 15);

    const markup = photosTemplate(res.hits);
    refs.imagesListElem.innerHTML = markup;
    showPubliciti();
  } catch (err) {
    console.log(err.message);
  }

  hideLoader();
  turnOffSearchBtn();
  refs.searchFormElem.reset();

  observeStatus();
});

refs.closeBtn.addEventListener('click', () => {
  refs.publicityElem.classList.remove('show-publicity');
});

refs.inputElem.addEventListener('input', () => {
  turnOnSearchBtn();
});

async function loadMore() {
  refs.observerLoader.classList.remove('visually-hidden');
  currentPage++;
  const res = await loadPhotos(query, currentPage);

  const markup = photosTemplate(res.hits);
  refs.imagesListElem.insertAdjacentHTML('beforeend', markup);
  refs.observerLoader.classList.add('visually-hidden');
  observeStatus();
  if (currentPage >= maxPages) {
    iziToast.info({
      message: 'No more photos :(',
      position: 'bottomRight',
    });
  }
}

function intersectionObserve(entries) {
  if (entries[0].isIntersecting) {
    loadMore();
  }
}
