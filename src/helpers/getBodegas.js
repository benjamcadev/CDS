//LIBRERIA PARA HACER FETCH
import axios from './axios'

export const getBodegas = async() => {

    try {
        const response = await axios.get('http://186.64.113.208:3000/bodegas/');
        return response.data
      } catch (error) {
        console.error('Hubo un error fetch bodegas: ' + error);
      }
   
}