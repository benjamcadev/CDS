//LIBRERIA PARA HACER FETCH
import axios from './axios'

export const getBodegas = async() => {

    try {
        const response = await axios.get('/bodegas');
        return response.data
      } catch (error) {
        console.error('Hubo un error fetch bodegas: ' + error);
      }
   
}
//BUSCAR BODEGAS QUE PERTENECE MATERIAL POR ID DE MATERIAL (Backend si tiene  esta ruta)
//router.get('/api/v1/bodegas/find/:id', getBodegaMaterial)

export const getBodegaMaterial = async (id) => {
  try {
    const response = await axios.get(`/bodegas/find/${id}`);
    return response.data;
  } catch (error) {
    console.error('Hubo un error fetch bodegas: ' + error);
  }
};
