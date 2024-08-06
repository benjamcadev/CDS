import { useState, useEffect } from 'react';
import CustomTextField from '../UI/CustomTextField';
import ButtonMui from '../UI/ButtonMui';
import AlertComponent from '../UI/AlertMui';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  '@media (min-width:600px)': {
    p: 4,
  },
};

const CreateModal = ({ name, title, onSave }) => {
  const [open, setOpen] = useState(false);
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
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

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
    setAlert({ open: false, message: '', severity: 'success' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      setAlert({ open: false, message: '', severity: 'error' });
      setTimeout(() => {
        setAlert({ open: true, message: 'Por favor, sube una imagen en formato PNG, JPEG, JPG o WEBP.', severity: 'error' });
      }, 100); // Usar un pequeño retraso para restablecer la alerta
      setTimeout(() => setAlert({ open: false, message: '', severity: 'error' }), 3000); // Desaparecer alerta después de 3 segundos
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
      //console.log(response.data);
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

      setAlert({ open: true, message: 'Artículo Creado Exitosamente', severity: 'success' });
      onSave(); // Actualizar la lista de artículos
      setTimeout(() => {
        setAlert({ open: false, message: '', severity: 'success' });
        handleClose(); // Cerrar el modal después de que la alerta desaparezca
      }, 2500); 
      // Desaparecer alerta después de 2.5 segundos
    } catch (error) {

      //console.error('Error al crear el artículo:', error);
      setAlert({ open: true, message: 'Error al crear el artículo', severity: 'error' });
      setTimeout(() => setAlert({ open: false, message: '', severity: 'error' }), 2500); // Desaparecer alerta después de 2.5 segundos
    } 
  };

 
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
            {alert.open && (
              <AlertComponent
                message={alert.message}
                severity={alert.severity}
                onClose={() => setAlert({ open: false, message: '', severity: 'success' })}
              />
            )}

            <Box component="form" sx={{mt: 0.1}}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
                {formData.imagen_base64 && (
                  <img
                    src={formData.imagen_base64}
                    alt="Artículo"
                    style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                )}
            </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                <input 
                  accept="image/*" 
                  id="contained-button-file" 
                  multiple type="file" 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload} 

                />
                <label 
                  htmlFor="contained-button-file">
                  <Button 
                    fullWidth 
                    variant="contained" 
                    component="span">
                    Subir Imagen Del Articulo
                  </Button>
                </label>
              </Box>
            </Box>

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
               <FormControl variant="outlined" sx={{  minWidth: 120 }}>
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
              <FormControl variant="outlined" sx={{  minWidth: 120 }}>
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
              <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
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