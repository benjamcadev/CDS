import { useState, useEffect } from 'react';
import CustomTextField from '../UI/CustomTextField';
import ButtonMui from '../UI/ButtonMui';

import { getCategorias } from '../../helpers/getCategories';
import { opcionesUnidadMedida } from '../../helpers/options';
import axios from '../../helpers/axios';
import ImagenNot from '../../public/images/PageNotFound.png';

import {  FormControl, IconButton, InputLabel, MenuItem, Select  } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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

const CreateModal = ({ name, title, onSave }) => {
  const [open, setOpen] = useState(false);
  
  
  const [cameraOpen, setCameraOpen] = useState(false); 
  const [formData, setFormData] = useState({
    nombre: '',
    sap: '',
    codigo_interno: '',
    sku: '',
    unidad_medida: '',
    precio: '',
    cantidad: '',
    comentario: '',
    categoria_idcategoria: '',
    imagen_base64: ImagenNot,
  });
  
  const [categorias, setCategorias] = useState([]);
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      nombre: '',
      sap: '',
      codigo_interno: '',
      sku: '',
      unidad_medida: '',
      precio: '',
      cantidad: '',
      comentario: '',
      categoria_idcategoria: '',
      imagen_base64: ImagenNot,
    });
    
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
  
  const handleSubmit = async () => {
    try {
      const response = await axios.post('/materiales/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          usuarioid: 1 // ID CON PERMISOS DE ADMINISTRADOR
        }
      });

      MySwal.fire({
        icon: 'success',
        title: 'Artículo Creado Exitosamente',
        text: 'Puedes continuar creando más artículos.',
        customClass: {
          container: 'zIndexModal', // Asegura que el SweetAlert esté por delante del modal
        },
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

      setFormData({
        nombre: '',
        sap: '',
        codigo_interno: '',
        sku: '',
        unidad_medida: '',
        precio: '',
        cantidad: '',
        comentario: '',
        categoria_idcategoria: '',
        imagen_base64: ImagenNot,
      });

      onSave(); // Actualizar la lista de artículos
      //Cerramos el modal
      handleClose();
      
      // No cerramos el modal aquí, permitimos que el usuario continúe
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error al crear el artículo',
        text: 'Ocurrió un error al intentar crear el artículo. Inténtalo de nuevo más tarde.',
        confirmButtonColor: '#3085d6',
        customClass: {
          container: 'zIndexModal', // Asegura que el SweetAlert esté por delante del modal
        },
      });
    }
  };

  const openCamera = () => setCameraOpen(true);
  const closeCamera = () => setCameraOpen(false);


 
  return (
    <div>
      <ButtonMui name={name} handleOpen={handleOpen} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography id="transition-modal-title" sx={{ fontWeight: 'font-bold' }} variant="h5" component="h2">
                {title}
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box component="form" sx={{ mt: 0.1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
                {formData.imagen_base64 && (
                  <img
                    src={formData.imagen_base64}
                    alt="Artículo"
                    style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                <input 
                  accept="image/*" 
                  id="contained-button-file" 
                  multiple type="file" 
                  capture="environment" 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload} 
                />
                <label htmlFor="contained-button-file">
                  <Button 
                    fullWidth 
                    variant="contained" 
                    component="span">
                    Subir Imagen Del Articulo
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
              </Box>
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, mt: 1.5 }}>
              <CustomTextField 
                id="nombre" 
                label="Descripción del Articulo (Obligatorio)" 
                variant="outlined"  
                value={formData.nombre} 
                onChange={handleChange} 
              />
              <CustomTextField 
                id="sap" 
                label="SAP (Opcional)" 
                type="number" 
                variant="outlined"  
                value={formData.sap} 
                onChange={handleChange} 
              />
              <CustomTextField 
                id="sku" 
                label="SKU (Opcional)" 
                type="number" 
                variant="outlined"  
                value={formData.sku} 
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
                label="Precio (USD)"  
                type="number" 
                value={formData.precio} 
                onChange={handleChange} 
              />

              <CustomTextField 
                id="comentario" 
                label="Comentario (Opcional)" 
                variant="outlined" 
                fullWidth 
                value={formData.comentario} 
                onChange={handleChange} 
              />
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="categoria_idcategoria">Categoria</InputLabel>
                  <Select
                    value={formData.categoria_idcategoria}
                    labelId="categoria_idcategoria"
                    id="categoria_idcategoria"
                    onChange={(e) => setFormData({ ...formData, categoria_idcategoria: e.target.value })}
                    fullWidth
                  >
                  <MenuItem value="" disabled >
                    ---Seleccione---
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.idcategoria} value={categoria.idcategoria}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                  </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
                sx={{ height: '50px' }}
                >
                Guardar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CreateModal;