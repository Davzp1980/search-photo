import { loadPhotos } from './src/js/photo-api';
import { photosTemplate } from './src/js/photo-render';
import iziToast from 'izitoast';
import './node_modules/izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const observer = new IntersectionObserver(intersectionObserve);
const refs = {
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

let currentPage = 1;
let query = '';
let maxPages = 1;

const gallery = new simpleLightbox('.img-list a', {
  captionDelay: 500,
  captionPosition: 'bottom',
});

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
    console.log(res);
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
    gallery.refresh();
    // showPubliciti();
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
  console.log('hello');
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

function showPubliciti() {
  setTimeout(() => {
    refs.publicityElem.classList.add('show-publicity');
  }, 2000);

  setTimeout(() => {
    refs.publicityElem.classList.remove('show-publicity');
  }, 10000);
}

function observeStatus() {
  if (currentPage >= maxPages) {
    observer.unobserve(refs.ebserveElem);
  } else {
    observer.observe(refs.ebserveElem);
  }
}

function scrollDown() {
  const liElem = refs.imagesListElem.children[0];
  const height = liElem.getBoundingClientRect().height;
  scrollBy({
    behavior: 'smooth',
    top: height * 15,
  });
}

function showLoader() {
  refs.loaderElem.classList.remove('visually-hidden');
}
function hideLoader() {
  refs.loaderElem.classList.add('visually-hidden');
}

function turnOffSearchBtn() {
  refs.searchBtnElem.disabled = true;
  refs.searchBtnElem.classList.add('search-btn-off');
}

function turnOnSearchBtn() {
  refs.searchBtnElem.disabled = false;
  refs.searchBtnElem.classList.remove('search-btn-off');
}
