//LIBRERIA PARA HACER FETCH
import axios from 'axios'

export const getTypesUser = async() => {

    try {
        const response = await axios.get('http://localhost:3000/usuarios/types');
        return response.data
      } catch (error) {
        console.error('Hubo un error fetch types users: ' + error);
      }
   
}