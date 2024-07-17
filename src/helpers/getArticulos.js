import axios from "./axios";


export const getArticulos = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/materiales/list?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al traer los Artículos', error);
    throw error;
  }
};
