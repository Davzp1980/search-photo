function photoTemplate(image) {
  return `<li class="list-item">
          <div class="img-box">           
              <img
                src="${image.previewURL}"
                alt="${image.tags}"
                title="${image.tags}"
              />            
          </div>
          <ul class="description-list">
            <li class="description-item">
              <p>Likes</p>
              <p>${image.likes}</p>
            </li>
            <li class="description-item">
              <p>Views</p>
              <p>${image.views}</p>
            </li>
            <li class="description-item">
              <p>Comments</p>
              <p>${image.comments}</p>
            </li>
            <li class="description-item">
              <p>Downloads</p>
              <p>${image.downloads}</p>
            </li>
          </ul>
        </li>`;
}

export function photosTemplate(arrPhotos) {
  return arrPhotos.map(photoTemplate).join('');
}
