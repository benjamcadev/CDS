import { useState } from 'react';
import { Autocomplete, Box, Button, Modal } from '@mui/material';
import TextField from '@mui/material/TextField';
import WebcamCapture from '../WebcamCapture';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


const OpcionesTipoCompra = [
  { label: 'Guia Despacho', value: 'Guia Despacho', id: 1 },
  { label: 'Factura', value: 'Factura', id: 2 },
  { label: 'SEP', value: 'Factura', id: 3 },
];

const OpcionesTipoRecepcion = [
  { label: 'BODEGA 6', value: 'BODEGA 6', id: 1 },
  { label: 'TICA', value: 'TICA', id: 2 },
];


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

export const Compra = ({ datos, setDatos, responsables, responsablesBodega  }) => {

  const [cameraOpen, setCameraOpen] = useState(false); 
  const [imagenSubida, setImagenSubida] = useState(false); 
  // Estado para rastrear si la imagen ha sido subida
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setDatos({ ...datos, foto_documentos: reader.result });
        };
        reader.readAsDataURL(file);
        setImagenSubida(true); // Marcar como que la imagen ha sido subida
    }
  };

  
  const openCamera = () => setCameraOpen(true);
  const closeCamera = () => setCameraOpen(false);


  return (
    <>
      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="tipoCompra">Tipo de Compra</label>
        <Autocomplete
          disablePortal
          value={datos.tipoCompra}
          freeSolo
          id="tipoCompra"
          options={OpcionesTipoCompra}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onBlur={(e) => setDatos({ ...datos, tipoCompra: e.target.value })}
          renderInput={(params) => ( 
            <TextField 
              {...params}
              inputProps={{ ...params.inputProps, readOnly: true }}    
            />
          )}
        />
      </div>
    
      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="numeroDocumento">N° Documento</label>
        <TextField
          id="numeroDocumento"
          size="normal"
          value={datos.numeroDocumento}
          type='number'
          fullWidth
          onChange={(e) => setDatos({ ...datos, numeroDocumento: e.target.value })}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="tipoRecepcion">Tipo de Recepción</label>
        <Autocomplete
          disablePortal
          value={datos.tipoRecepcion}
          freeSolo
          id="tipoRecepcion"
          options={OpcionesTipoRecepcion}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onBlur={(e) => setDatos({ ...datos, tipoRecepcion: e.target.value })}
          renderInput={(params) => ( 
            <TextField 
              {...params}
              inputProps={{ ...params.inputProps, readOnly: true }}    
            />
          )}
        />
      </div>

      <div className="mb-5 flex">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="foto">Foto Documento</label>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            handleImageUpload(e); // Llama a la función que se pasa como prop para actualizar el estado en FormularioValeEntrada
          }}

        />
        <label htmlFor="contained-button-file">
          <Button
            fullWidth
            variant="contained"
            component="span"
            style={{ backgroundColor: imagenSubida ? 'green' : '' }} // Cambiar color a verde si la imagen ha sido subida
          >
            {imagenSubida ? 'Documento Subido' : 'Subir Imagen Del Documento'}
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
          <Box sx={{ ...style,  maxWidth: '200%', textAlign: 'center' }}>
            <WebcamCapture setImage={(img) => {
              setDatos({ ...datos, foto_documentos: img });
              setImagenSubida(true);
              closeCamera();
            }} />
          </Box>
        </Modal>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">observaciones</label>
        <TextField
          id="descripcion"
          size="normal"
          fullWidth
          multiline
          value={datos.descripcion}
          onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="responsableBodega">Responsable Bodega</label>
        <Autocomplete
          disablePortal
          freeSolo
          value={
            responsables.map(function (responsable) {
              if (responsable.id === datos.responsableEntrega) {
                return responsable.label;
              }
            }).join('')
          }
          id="responsableBodega"
          options={responsablesBodega}
          isOptionEqualToValue={(option, value) => option.id === value.nombre}
          onChange={(e, value) => { setDatos({ ...datos, responsableEntrega: value.label, responsableEntregaCorreo: value.correo }) }}
          renderInput={(params) => ( 
            <TextField 
              {...params}
              inputProps={{ ...params.inputProps, readOnly: true }}    
            />
          )}
        />
      </div>
    </>
  );
}