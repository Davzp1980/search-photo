import axios from 'axios';

const photoAxios = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '44327397-ede54b0a70b202831c7c411c5',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
  },
});

export async function loadPhotos(query, currentPage) {
  const res = await photoAxios.get('', {
    params: {
      q: query,
      page: currentPage,
    },
  });
  return res.data;
}
