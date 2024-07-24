import { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import axios from '../../helpers/axios';
import ImagenNot from '../../public/images/PageNotFound.png';

const CustomTextField = ({ label, value, onChange, ...props }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    variant="outlined"
    fullWidth
    margin="normal"
    {...props}
  />
);

export const ArticleDetailForm = ({ article, onClose, onUpdate, onDelete }) => {

  const [formData, setFormData] = useState({
    ...article,
    imagen_base64: ImagenNot,
  });
  const [stockBodegas, setStockBodegas] = useState([]);


  const getImagenUrl = async (idarticulo) => {
    try {
      const response = await axios.get(`/materiales/imagen/${idarticulo}`);
      return response.data.base64;
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return ImagenNot;
    }
  };

  const getStockBodegas = async (idarticulo) => {
    try {
      const response = await axios.get(`/bodegas/find/${idarticulo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el stock por bodega:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchImageAndStock = async () => {
      if (article.imagen_url) {
        const imageBase64 = await getImagenUrl(article.idarticulo);
        setFormData((prevState) => ({
          ...prevState,
          imagen_base64: imageBase64,
        }));
      }
      const stockData = await getStockBodegas(article.idarticulo);
      setStockBodegas(stockData);
    };
    fetchImageAndStock();
  }, [article]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imagen_base64: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put('/materiales/update', formData, {
        headers: {
          'Content-Type': 'application/json',
          usuarioid: 1, // Reemplaza con el ID de usuario actual
        },
      });
      onClose(); // Cerrar el modal después de actualizar
      onUpdate(); // Actualizar la lista de artículos
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/materiales/delete', {
        headers: {
          'Content-Type': 'application/json',
          usuarioid: 1, // Reemplaza con el ID de usuario actual
        },
        data: { idarticulo: formData.idarticulo },
      });
      onClose(); // Cerrar el modal después de eliminar
      onDelete(); // Actualizar la lista de artículos
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  };

  const validatePositiveNumber = (value) => value >= 0;

  return (
    <Box component="form" sx={{  }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={formData.imagen_base64}
          alt="Artículo"
          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="contained-button-file">
          <Button fullWidth variant="contained" component="span">
            Subir Nueva Imagen Del Articulo
          </Button>
        </label>
      </Box>

      <CustomTextField
        id="Descripcion"
        label="Nombre Del Articulo"
        value={formData.Descripcion || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="Codigo_SAP"
        label="SAP"
        type="number"
        value={formData.Codigo_SAP || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="Codigo_interno"
        label="Codigo Interno"
        disabled
        value={formData.Codigo_interno || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="sku"
        label="SKU"
        type="number"
        value={formData.SKU || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="unidad_medida"
        label="Unidad De Medida (CAJA, UNIDAD)"
        value={formData.unidad_medida || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="precio"
        label="Precio"
        type="number"
        value={formData.precio || ''}
        onChange={handleChange}
      />
      <Box sx={{ mt: 0.2 }}>
        <Typography variant="h7" sx={{ fontWeight: 'bold' }}>Stock Por Bodega</Typography>
        {stockBodegas.length > 0 ? (
          stockBodegas.map((stock) => (
            <Grid container key={stock.bodegas_idbodegas} sx={{ mt: 0.1 }} spacing={1}>
              <Grid item xs={4}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Bodega:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',  }}>
                  {stock.nombreBodega}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Stock:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', alignItems: 'center'}}>
                  {stock.cantidad}
                </Typography>
              </Grid>
              <Grid item xs={4}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ubicación:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', alignItems: 'center' }}> 
                  {stock.nombreUbicacion}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body2">No hay stock en ninguna bodega.</Typography>
        )}
      </Box>
      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Editar Articulo
        </Button>
        <Button variant="contained" color="warning" onClick={handleDelete}>
          Eliminar
        </Button>
      </Box>
    </Box>
  );
};

export default ArticleDetailForm;