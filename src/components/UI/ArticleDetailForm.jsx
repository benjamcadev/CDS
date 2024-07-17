import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

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

const ArticleDetailForm = ({ article }) => {
  const [formData, setFormData] = useState(article);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validatePositiveNumber = (value) => value >= 0;

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <CustomTextField 
        id="nombre" 
        label="Nombre Del Articulo" 
        value={formData.nombre || ''} 
        onChange={handleChange} 
      />
      <CustomTextField 
        id="sap" 
        label="SAP" 
        value={formData.sap || ''} 
        onChange={handleChange} 
      />
      <CustomTextField 
        id="codigo_interno" 
        label="Codigo Interno" 
        value={formData.codigo_interno || ''} 
        onChange={handleChange} 
      />
      <CustomTextField 
        id="sku" 
        label="SKU" 
        value={formData.sku || ''} 
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
        validate={validatePositiveNumber} 
      />
     
      <input accept="image/*" id="contained-button-file" multiple type="file" style={{ display: 'none'  }} />
      <label htmlFor="contained-button-file">
        <Button fullWidth variant="contained" component="span">
          Subir Nueva Imagen Del Articulo
        </Button>
      </label>

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary">Editar Articulo</Button>
        <Button variant="contained" color="warning">Eliminar</Button>
      </Box>
    </Box>
  );
};

export default ArticleDetailForm;