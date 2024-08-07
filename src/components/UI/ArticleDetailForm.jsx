import { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../../helpers/axios';
import ImagenNot from '../../public/images/PageNotFound.png';
import { opcionesUnidadMedida } from '../../helpers/options';
import AlertComponent from './AlertMui';

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
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

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
      const imageBase64 = await getImagenUrl(article.id);
      setFormData((prevState) => ({
        ...prevState,
        imagen_base64: imageBase64,
      }));
      const stockData = await getStockBodegas(article.id);
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
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (file && validTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen_base64: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, sube una imagen en formato PNG, JPEG, JPG o WEBP.');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('/materiales/update', formData, {
        headers: {
          'Content-Type': 'application/json',
          usuarioid: 1, // Reemplaza con el ID de usuario actual
        },
      });
      setAlert({ open: true, message: 'Artículo Actualizado Exitosamente', severity: 'success' });
      onUpdate(); // Actualizar la lista de artículos
      setTimeout(() => {
        setAlert({ open: false, message: '', severity: 'success' });
        onClose(); // Cerrar el modal después de actualizar
      }, 3000); // Cerrar la alerta después de 3 segundos
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
      setAlert({ open: true, message: 'Error al actualizar el artículo', severity: 'error' });
      setTimeout(() => {
        setAlert({ open: false, message: '', severity: 'error' });
      }, 3000); // Cerrar la alerta después de 3 segundos
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('/materiales/delete', {
        headers: {
          'Content-Type': 'application/json',
          usuarioid: 1, // Reemplaza con el ID de usuario actual
        },
        data: { idarticulo: formData.idarticulo },
      });

      setAlert({ open: true, message: 'Artículo Eliminado Exitosamente', severity: 'success' });
      setTimeout(() => {
        setAlert({ open: false, message: '', severity: 'success' });
        onClose(); // Cerrar el modal después de eliminar
        onDelete(); // Actualizar la lista de artículos
      }, 2500); // Cerrar la alerta después de 2.5 segundos

    } catch (error) {
      //console.error('Error al eliminar el artículo:', error);
      setAlert({ open: true, message: 'Error al eliminar el artículo', severity: 'error' });
      setTimeout(() => {
        setAlert({ open: false, message: '', severity: 'error' });
      }, 3000); // Cerrar la alerta después de 3 segundos
    }
  };

  return (
    <Box component="form">
      {alert.open && (
        <AlertComponent
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ open: false, message: '', severity: 'success' })}
        />
      )}
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
          <Button 
            fullWidth 
            variant="contained" 
            component="span">
            Subir Nueva Imagen Del Articulo
          </Button>
        </label>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mt: 0.2 }}>
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

        <FormControl variant="outlined" sx={{ m: 0.5, }}>
          <InputLabel id="unidad_medida">Unidad Medida</InputLabel>
            <Select
              value={formData.unidad_medida}
              labelId="unidad_medida"
              id='unidad_medida'
              
              onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
              fullWidth
            >
              <MenuItem value="" disabled >
                ---Seleccione---
              </MenuItem>
              {opcionesUnidadMedida.map((opcion) => (
                <MenuItem key={opcion.id} value={opcion.label}>
                  {opcion.label}
                </MenuItem>
              ))}
            </Select>
        </FormControl>
        <CustomTextField
          id="precio"
          label="Precio"
          type="number"
          value={formData.precio || ''}
          onChange={handleChange}
      />
      </Box>
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