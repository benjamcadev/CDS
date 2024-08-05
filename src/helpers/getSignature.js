//LIBRERIA PARA HACER FETCH
import axios from './axios'

export const getSignature = async(idTicket) => {

    try {
        const response = await axios.get(`/ticket/salida/signature/${idTicket}`);
        return response.data
      } catch (error) {
        console.error('Hubo un error fetch signatures: ' + error);
      }
   
}

export const getSignatureEntrada = async(idTicket) => {

  try {
      const response = await axios.get(`/ticket/entrada/signature/${idTicket}`);
      return response.data
    } catch (error) {
      console.error('Hubo un error fetch ticket entrada: ' + error);
    }
 
}