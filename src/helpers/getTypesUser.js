//LIBRERIA PARA HACER FETCH
import axios from './axios'

export const getTypesUser = async() => {

    try {
        const response = await axios.get('/usuarios/types');
       
        return response
      } catch (error) {
        console.error('Hubo un error fetch types users: ' + error);
        return error
      }
   
}