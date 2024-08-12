import { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from '../../helpers/axios';
import ImagenNot from '../../public/images/PageNotFound.png';
import { opcionesUnidadMedida } from '../../helpers/options';
import AlertComponent from './AlertMui';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

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

    if (file && !validTypes.includes(file.type)) {
      MySwal.fire({
        icon: 'error',
        title: 'Formato de archivo incorrecto',
        text: 'Por favor, sube una imagen en formato PNG, JPEG, JPG o WEBP.',
        customClass: {
          container: 'zIndexModal',
        }
      });

      // Restablece el input de archivo para que pueda detectar el mismo archivo de nuevo
      e.target.value = null;
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen_base64: reader.result });
      };
      reader.readAsDataURL(file);
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

      MySwal.fire({
        icon: 'success',
        title: 'Artículo Actualizado Exitosamente',
        text: 'El artículo ha sido actualizado correctamente.',
        customClass: {
          container: 'zIndexModal',
        }
      });

      onUpdate(); // Actualizar la lista de artículos
      onClose(); // Cerrar el modal después de actualizar
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error al actualizar el artículo',
        text: 'Ocurrió un error al intentar actualizar el artículo. Inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleDelete = async () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto, se eliminará el artículo y su stock en todas las bodegas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'zIndexModal',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete('/materiales/delete', {
            headers: {
              'Content-Type': 'application/json',
              usuarioid: 1, // Reemplaza con el ID de usuario actual
            },
            data: { idarticulo: formData.idarticulo },
          });

          MySwal.fire({
            icon: 'success',
            title: 'Artículo Eliminado Exitosamente',
            text: 'El artículo ha sido eliminado correctamente.',
          });

          onClose(); // Cerrar el modal después de eliminar
          onDelete(); // Actualizar la lista de artículos
        } catch (error) {
          MySwal.fire({
            icon: 'error',
            title: 'Error al eliminar el artículo',
            text: 'Ocurrió un error al intentar eliminar el artículo. Inténtalo de nuevo más tarde.',
          });
        }
      }
    });
  };


  return (
    <Box component="form"  sx={{ mt: 0.1 }}>
      {alert.open && (
        <AlertComponent
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ open: false, message: '', severity: 'success' })}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
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

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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