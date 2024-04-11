//LIBRERIA PARA HACER FETCH
import axios from 'axios'




export const getSignature = async(idTicket) => {

    try {
        const response = await axios.get(`http://186.64.113.208:3000/ticket/salida/signature/${idTicket}`);
        return response.data
      } catch (error) {
        console.error('Hubo un error fetch signatures: ' + error);
      }
   
}