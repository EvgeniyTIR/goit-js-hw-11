const API_KEY = '28389797-09b5d7989e1fd958a2bdadcb0' 
export const galleryOptions = {
    maxZoom: 3,
    captions: true,
    captionSelector: "img",
    captionType: "attr",
    captionsData: "alt",
    captionPosition: "bottom",
            captionDelay: 250,
        }

export const options = {
    key: API_KEY,
    q: "",
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
};

export const refs = {
    inputSearch: document.querySelector('input#text'),
    form: document.querySelector('#search-form'),
    submit: document.querySelector('.search-form__button'),
    gallery: document.querySelector('.gallery'),
    detectScroll: document.querySelector('.scroll-detection')
};

export const scrollOptions = {
    rootMargin: '500px',
    threshold: 1.0,
};