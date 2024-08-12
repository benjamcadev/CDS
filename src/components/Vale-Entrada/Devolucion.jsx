import { useState } from 'react';
import { Autocomplete, Button } from '@mui/material';
import TextField from '@mui/material/TextField';

export const Devolucion = ({ datos, setDatos, responsables, responsablesBodega, idTicket }) => {

  const [imagenSubida, setImagenSubida] = useState(false); // Estado para rastrear si la imagen ha sido subida

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

  return (

    // sintaxis abreviada para el componente <Fragment> de React

    <>
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

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable</label>
        <Autocomplete
          disablePortal
          value={datos.responsableRetira}
          disabled={datos.responsableRetira != '' && idTicket ? true : false}
          freeSolo
          id="responsable"
          options={responsables}
          isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
          onChange={(e, value) => { setDatos({ ...datos, responsableRetira: value.label, responsableRetiraCorreo: value.correo }) }}
          renderInput={(params) => ( 
            <TextField 
              {...params}
              inputProps={{ ...params.inputProps, readOnly: true }}    
            />
          )}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="foto">Foto Documento</label>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            handleImageUpload(e); // Llama a la función que se pasa como prop para actualizar el estado en FormularioValeEntrada
          }} // Manejar el cambio de archivo
        />
        <label htmlFor="contained-button-file">
          <Button
            fullWidth
            variant="contained"
            component="span"
            style={{ backgroundColor: imagenSubida ? 'green' : '' }} // Cambiar color a verde si la imagen ha sido subida
          >
            {imagenSubida ? 'Foto del material subido' : 'Subir Imagen Del Material'}
          </Button>
        </label>
      </div>

      <div className="mb-5">
          <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Motivo Devolución</label>
          <TextField
            id="descripcion"
            size="normal"
            fullWidth
            multiline
            value={datos.descripcion}
            disabled={datos.descripcion != '' && datos.idTicket ? true : false}
            onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
          />
        </div>
      {/* Otros campos específicos para Devolución */}
    </>
  );
}