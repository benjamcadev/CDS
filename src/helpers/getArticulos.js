import axios from "./axios";


export const getArticulos = async (page = 1, limit = 10) => {

  try {
    const response = await axios.get(`/materiales/list?page=${page}&limit=${limit}`);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al traer los Artículos', error);
    throw error;
  }

}

export const searchArticulos = async (searchValue) => {
  try {
    const response = await axios.post('/materiales/find', { search_value: searchValue });
    // Asegurarse de que cada fila tenga una propiedad id
    //console.log(response.data)
    return response.data.map(articulo => ({ ...articulo, id: articulo.id }));
  } catch (error) {
    console.error('Error al buscar los Artículos', error);
    throw error;
  }
};
