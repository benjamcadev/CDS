import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

export const Devolucion = ({ devolucionData, setDevolucionData }) => {
  return (
    <>
      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="responsableBod">Responsable Bodega</label>
        <TextField
          id="responsableBod"
          size="normal"
          value={devolucionData.responsableBod}
          fullWidth
          onChange={(e) => setDevolucionData({ ...devolucionData, responsableBod: e.target.value })}
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 uppercase font-bold" htmlFor="responsableBodega">Responsable Entrega</label>
        <TextField
          id="responsableBodega"
          size="normal"
          value={devolucionData.responsableBodega}
          fullWidth
          onChange={(e) => setDevolucionData({ ...devolucionData, responsableBodega: e.target.value })}
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
            value={devolucionData.descripcion}
            disabled={devolucionData.descripcion != '' && devolucionData.idTicket ? true : false}
            onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
          />
        </div>
      {/* Otros campos específicos para Devolución */}
    </>
  );
}