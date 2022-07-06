import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchDataGallery } from './js/fetchDataGallery';
import { renderGallery } from './js/renderGallery';
import { options, galleryOptions, refs, scrollOptions} from './js/settingsAndOptions';
import throttle from 'lodash.throttle'


const throttle = require(`lodash.throttle`);
axios.defaults.baseURL = 'https://pixabay.com/api/';;

refs.form.addEventListener('submit', throttle(submitResult, 500));
 
async function submitResult(e) {
    e.preventDefault();     
    const { elements: { searchQuery } } = e.currentTarget;
    options.q = searchQuery.value.trim();
    if (options.q === '') { return };
    submitReset();
    await getAndDrawData();
    //e.currentTarget.reset();
};

async function getAndDrawData() {
       try {
        const dataObj = await fetchDataGallery(options); 
        notifyHits(dataObj);        
        const markup = dataObj.hits.map(i => renderGallery(i)).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        let lightbox = new SimpleLightbox('.gallery a', galleryOptions);
        lightbox.refresh();
        return lightbox;
       } catch (error) {      
           Notify.failure("Wooops!!! Try find something else.");
           console.log(error.message);
    };
     
};
function submitReset() {
    refs.gallery.innerHTML = '';
    options.page = 1; 
    console.log(options)
};

function notifyHits(dataObj) {
    const lastPage = dataObj.totalHits / options.page < options.per_page;
    
    if (dataObj.hits.length >= 0 && lastPage) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        console.log(`Wooops`);
    }else if (dataObj.hits.length === 0) {
      Notify.warning("Sorry, there are no images matching your search query. Please try again.");  
     }
    if (dataObj.hits.length >= 1 && !lastPage) {
        Notify.success(`Hooray! We found ${dataObj.totalHits} images.`);
        console.log(`${dataObj.totalHits} `)
    }
    
        
}
//плавный скрол
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
        if (entry.isIntersecting && options.q !== '' && document.documentElement.getBoundingClientRect().top!== 0) {
            console.log("LOADING MOOOR!!!");
            options.page += 1;
            smoothScroll();
            getAndDrawData();           
        };
    });
}, scrollOptions); 

observer.observe(refs.detectScroll);
