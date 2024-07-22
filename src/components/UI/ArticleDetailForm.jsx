import { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from '../../helpers/axios';

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
  const [formData, setFormData] = useState(article);

  useEffect(() => {
    setFormData(article);
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
    <Box component="form" sx={{ mt: 2 }}>
      {formData.imagen_base64 && (
        <img
          src={formData.imagen_base64}
          alt="Artículo"
          style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'cover' }}
        />
      )}
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
      <CustomTextField
        id="Descripcion"
        label="Nombre Del Articulo"
        value={formData.Descripcion || ''}
        onChange={handleChange}
      />
      <CustomTextField
        id="Codigo_SAP"
        label="SAP"
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
        id="SKU"
        label="SKU"
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
      <CustomTextField
        id="Stock"
        label="Cantidad"
        type="number"
        value={formData.Stock || ''}
        onChange={handleChange}
      />
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
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
