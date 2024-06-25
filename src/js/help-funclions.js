import { refs, maxPages, currentPage, observer } from '../../main';

export function showLoader() {
  refs.loaderElem.classList.remove('visually-hidden');
}
export function hideLoader() {
  refs.loaderElem.classList.add('visually-hidden');
}

export function turnOffSearchBtn() {
  refs.searchBtnElem.disabled = true;
  refs.searchBtnElem.classList.add('search-btn-off');
}

export function turnOnSearchBtn() {
  refs.searchBtnElem.disabled = false;
  refs.searchBtnElem.classList.remove('search-btn-off');
}

export function scrollDown() {
  const liElem = refs.imagesListElem.children[0];
  const height = liElem.getBoundingClientRect().height;
  scrollBy({
    behavior: 'smooth',
    top: height * 15,
  });
}

export function observeStatus() {
  if (currentPage >= maxPages) {
    observer.unobserve(refs.ebserveElem);
  } else {
    observer.observe(refs.ebserveElem);
  }
}

export function showPubliciti() {
  setTimeout(() => {
    refs.publicityElem.classList.add('show-publicity');
  }, 2000);

  setTimeout(() => {
    refs.publicityElem.classList.remove('show-publicity');
  }, 10000);
}
