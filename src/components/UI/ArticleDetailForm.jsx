import { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import axios from '../../helpers/axios';
import ImagenNot from '../../public/images/PageNotFound.png';
import { opcionesUnidadMedida } from '../../helpers/options';
import AlertComponent from './AlertMui';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from '../../context/AuthContext';
import WebcamCapture from '../WebcamCapture';

const MySwal = withReactContent(Swal)

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '40%', // Cambia a un porcentaje para adaptarse mejor
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto', // Añade overflow para permitir el desplazamiento si es necesario
  maxHeight: '90vh', //  modal no se extienda más allá de la vista
  '@media (min-width:600px)': {
    p: 2,
    maxWidth: '40%', // Cambia a un porcentaje para adaptarse mejor
  },
};

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

  const { user } = useAuth();

  const [cameraOpen, setCameraOpen] = useState(false); 

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
        confirmButtonColor: '#3085d6',
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
          usuarioid: user.id, // Reemplaza con el ID de usuario actual
        },
      });

      MySwal.fire({
        icon: 'success',
        title: 'Artículo Actualizado Exitosamente',
        text: 'El artículo ha sido actualizado correctamente.',
        confirmButtonColor: '#3085d6',
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
            confirmButtonColor: '#3085d6',
          });

          onClose(); // Cerrar el modal después de eliminar
          onDelete(); // Actualizar la lista de artículos
        } catch (error) {
          MySwal.fire({
            icon: 'error',
            title: 'Error al eliminar el artículo',
            text: 'Ocurrió un error al intentar eliminar el artículo. Inténtalo de nuevo más tarde.',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  const openCamera = () => setCameraOpen(true);
  const closeCamera = () => setCameraOpen(false);


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
          style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Box>
      {user.tipoUser === 1 ? (
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
        <Box sx={{ ml: 2 }}>
          <Button
            fullWidth
            variant="contained"
            component="span"
            onClick={openCamera}
          >
            <CameraAltIcon />
          </Button>
          </Box>
        
            
          {/* Modal para abrir la cámara */}
          <Modal open={cameraOpen} onClose={closeCamera}>
          <Box sx={{ ...style, maxWidth: '200%', textAlign: 'center' }}>
            <WebcamCapture setImage={(img) => {
              setFormData({ ...formData, imagen_base64: img });
              closeCamera();
            }} />
          </Box>
        </Modal>
      </Box>
      ) : (
        <div></div>
      )}
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
      {/* Solo se muestra si el usuario es administrador en caso contrario se esconden   */}
      {user.tipoUser === 1 ? (
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Editar Articulo
          </Button>
          <Button variant="contained" color="warning" onClick={handleDelete}>
            Eliminar
          </Button>
          
        </Box>
      ) : (
        <div></div>
      )
    }
    </Box>
  );
};

export default ArticleDetailForm;