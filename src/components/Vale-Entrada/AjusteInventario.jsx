import { Autocomplete, TextField } from "@mui/material";


export const AjusteInventario = ({ datos, setDatos, responsables, responsablesBodega  }) => {
  return (
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
        <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Observaciones</label>
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
    </>
)};