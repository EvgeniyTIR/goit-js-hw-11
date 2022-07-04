import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchGalleryObj } from './js/fetchGalleryObj';
import { renderGallery } from './js/renderGallery';
import { options, galleryOptions, refs} from './js/objOptions';
import throttle from 'lodash.throttle'


const throttle = require(`lodash.throttle`);
const ulr = 'https://pixabay.com/api/';
axios.defaults.baseURL = ulr;



refs.form.addEventListener('submit', throttle(submitResult, 500));
 
async function submitResult(e) {
    e.preventDefault();    
    submitReset();
    const { elements: { searchQuery } } = e.currentTarget;
    options.q = searchQuery.value.trim();
    if (options.q === '') { return };
    try {
        const dataObj = await fetchGalleryObj(options);           
        if (dataObj.length === 0) {
          Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
        const markup = dataObj.map(i => renderGallery(i)).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        let lightbox = new SimpleLightbox('.gallery a', galleryOptions);;
        lightbox.refresh();
        return lightbox
    } catch (error) {      
        console.log(error.message);
    }
   // e.currentTarget.reset();
};

function submitReset() {
    refs.gallery.innerHTML = '';
    options.page = 1;   
}

function smoothScroll(e) {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}    


//1) axios запрос данных 2) результирующая функция сабмит 3) функция разметки 4) подключение галлереи 5) бесконечный скрол

//+
//Если бэкенд возвращает пустой массив, 
// значит ничего подходящего найдено небыло.
// В таком случае показывай уведомление с текстом
// "Sorry, there are no images matching your search query.Please try again."
//Для уведомлений используй библиотеку notiflix.

// В ответе бэкенд возвращает свойство totalHits -
//     общее количество изображений которые подошли под критерий поиска(для бесплатного аккаунта).
//     Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом
// "We're sorry, but you've reached the end of search results.".

// Уведомление
// После первого запроса при каждом новом поиске выводить уведомление
//  в котором будет написано сколько всего нашли изображений(свойство totalHits).
//  Текст уведомления "Hooray! We found totalHits images."

