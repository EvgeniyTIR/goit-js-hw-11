import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchGalleryObj } from './js/fetchDataGallery';
import { renderGallery } from './js/renderGallery';
import { options, galleryOptions, refs, scrollOptions} from './js/settingsAndOptions';
import throttle from 'lodash.throttle'


const throttle = require(`lodash.throttle`);
const ulr = 'https://pixabay.com/api/';
axios.defaults.baseURL = ulr;
let hits = 0;

refs.form.addEventListener('submit', throttle(submitResult, 500));
 
async function submitResult(e) {
    e.preventDefault();     
    const { elements: { searchQuery } } = e.currentTarget;
    options.q = searchQuery.value.trim();
    if (options.q === '') { return };
    submitReset();
    await getAndDrawData();
   // e.currentTarget.reset();
};

async function getAndDrawData() {
       try {
        const dataObj = await fetchGalleryObj(options); 
           hits = dataObj.totalHits;    
        if (dataObj.hits.length === 0) {
            Notify.warning("Sorry, there are no images matching your search query. Please try again.");
        }
        const markup = dataObj.hits.map(i => renderGallery(i)).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        let lightbox = new SimpleLightbox('.gallery a', galleryOptions);;
        lightbox.refresh();
           return lightbox;
       } catch (error) {      
           Notify.failure("Wooops!!! Try find something else.");
           console.log(error.message);
    }
     
};
function submitReset() {
    refs.gallery.innerHTML = '';
    options.page = 1;     
};

function calcHits() {
    const totalHits = hits - options.page * options.per_page;
    if (totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        console.log(`${totalHits} `)
    }else{ 
        Notify.warning("We're sorry, but you've reached the end of search results.")
         console.log(`Wooops`)
    }
}

function smoothScroll() {
    if (refs.gallery.firstElementChild !== null){
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    }; 
};    

 //infinity scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && options.q !== '') {
            console.log("LOADING MOOOR!!!");
            options.page += 1;
            smoothScroll();
            getAndDrawData();
            calcHits();
        };
    });
}, scrollOptions); 

observer.observe(refs.detectScroll);
