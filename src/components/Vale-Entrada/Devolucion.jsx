import { Autocomplete, Button } from '@mui/material';
import TextField from '@mui/material/TextField';

export const Devolucion = ({ datos, setDatos, responsables, responsablesBodega, idTicket }) => {
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
          renderInput={(params) => <TextField {...params} />}
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
          renderInput={(params) => <TextField {...params} />}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="foto">Foto Del Material</label>
          <input 
            accept="image/*" 
            id="contained-button-file" 
            multiple type="file" 
            style={{ display: 'none' }} 

          />
        <label 
          htmlFor="contained-button-file">
          <Button
            fullWidth
            variant="contained" 
            component="span">
            Imagen Del Material Devuelto
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