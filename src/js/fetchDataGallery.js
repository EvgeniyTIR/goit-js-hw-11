import axios from "axios";

export const fetchDataGallery = async ({ key, q, image_type, orientation, safesearch, per_page, page }) => { 
    const result = await axios.get(`?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${per_page}&page=${page}`)
    //     .then(res => {           
    //        return  res.data 
    //    } ).catch(error =>console.log(error));    
    return result.data
}