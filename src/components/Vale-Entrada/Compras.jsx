import { Autocomplete, Button, TextareaAutosize } from '@mui/material';
import TextField from '@mui/material/TextField';


const OpcionesTipoCompra = [
  { label: 'Guia Despacho', value: 'Guia Despacho', id: 1 },
  { label: 'Factura', value: 'Factura', id: 2 },
  { label: 'SEP', value: 'Factura', id: 3 },
];

const OpcionesTipoRecepcion = [
  { label: 'BODEGA 6', value: 'BODEGA 6', id: 1 },
  { label: 'TICA', value: 'TICA', id: 2 },
];

export const Compra = ({ datos, setDatos, responsables, responsablesBodega  }) => {
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
          renderInput={(params) => <TextField {...params} />}
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
          renderInput={(params) => <TextField {...params} />}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="foto">Foto Documento</label>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple type="file"
          style={{ display: 'none' }} />
        <label
          htmlFor="contained-button-file">
          <Button
            fullWidth
            variant="contained"
            component="span">
            Subir Imagen Del Documento
          </Button>
        </label>
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
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </>
  );
}