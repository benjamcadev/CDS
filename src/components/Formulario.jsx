import { useState, useRef, useEffect } from 'react'
import * as React from 'react';


//IMPORTAR LIBRERIA DE SCAN BARCODE
import { useZxing } from "react-zxing";

//IMPORTAR COMPONENTE DE TABLA
import Tabla from './Tabla'

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from './Firmas'

//COMPONENTES DE MATERIAL UI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


//COMPONENTES MATERIAL UI DATE PICKERS
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es'

//LIBRERIA PARA TRABAJAR FECHAS
import dayjs from 'dayjs'






export default function Formulario({ vale, setVale }) {



  const [datos, setDatos] = useState({ fecha: '', area: '', solCodelco: '', bodega: '', responsableRetira: '', responsableEntrega: '', descripcion: '' })
  const [datosTabla, setDatosTabla] = useState({})

  const [result, setResult] = useState("");

  const [devices, setDevices] = useState([]);

  // STATE QUE MANEJA MOSTRAR EL MENSAJE
  const [open, setOpen] = useState(false);


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  useEffect(() => {

    const fetchDataCamera = async () => {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();
      const availableVideoDevices = availableDevices.filter(device => device.kind === 'videoinput');

      if (availableVideoDevices.length === 0) {
        setOpen(true)
      }
      else {
        setDevices(availableVideoDevices);
        alert(JSON.stringify(devices, null, 4))
      }
    }

    // call the function
    fetchDataCamera()
      // make sure to catch any error
      .catch(console.error);

  }, []);

  const { ref } = useZxing({
    deviceId: devices,
    onDecodeResult(result) {
      setResult(result.getText());
    },


  });





  const opcionesArea = [
    { label: 'Telecomunicaciones', value: 'Telecomunicaciones', id: 1 },
    { label: 'Area TI', value: 'Area TI', id: 2 },
    { label: 'Sonda', value: 'Sonda', id: 3 },
    { label: 'IBM/ Coasin', value: 'IBM/ Coasin', id: 4 },

  ];

  const opcionesBodega = [
    { label: 'Insumos', value: 'Insumos', id: 1 },
    { label: 'Networking', value: 'Networking', id: 2 },
    { label: 'Carlitos', value: 'Carlitos', id: 3 },
    { label: 'Legrand', value: 'Legrand', id: 4 },
    { label: 'UPS', value: 'UPS', id: 5 },
  ]

  const opcionesResponsable = [
    { label: 'Arturo Jeronimo', value: 'Arturo Jeronimo', id: 1 },
    { label: 'Daniel Diaz', value: 'Daniel Diaz', id: 2 },
    { label: 'Jose Castillo P.', value: 'Jose Castillo P.', id: 3 },
    { label: 'Jose Castillo A.', value: 'Jose Castillo A.', id: 4 },
    { label: 'Felipe Mardonez', value: 'Felipe Mardonez', id: 5 },
    { label: 'Evans Jones', value: 'Evans Jones', id: 6 },

  ]

  const opcionesResponsableBodega = [
    { label: 'Benjamin Cortes', value: 'Benjamin Cortes', id: 1 },
    { label: 'Javiera Zamorano', value: 'Javiera Zamorano', id: 2 },
    { label: 'Alejandro Cortes', value: 'Alejandro Cortes', id: 3 },
    { label: 'Rodrigo Caminada', value: 'Rodrigo Caminada', id: 4 },
  ]




  const handleSubmit = (e) => {
    e.preventDefault()
    alert(fecha + " " + area)
  }

  return (
    <div className="bg-white shadow-md rounded-md py-5 px-5 ">

      <form className="" onSubmit={handleSubmit}>

        {/* Inputs */}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Fecha</label>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="es"
            >
              <DatePicker
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                defaultValue={dayjs()}
                id="fecha"
                onChange={(newValue) => setDatos({ ...datos, fecha: dayjs(newValue).format('YYYY-MM-DD HH:mm:ss') })}

              />
            </LocalizationProvider>

          </div>


          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="areaSolicitante">Area Solicitante</label>
            <Autocomplete
              disablePortal
              freeSolo
              id="area"
              options={opcionesArea}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onBlur={(e) => setDatos({ ...datos, area: e.target.value })}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="codelcoSolicitante">Solicitante Codelco</label>
            <TextField
              id="codelcoSolicitante"
              size="normal"
              fullWidth
              variant="outlined"
              onChange={(e) => setDatos({ ...datos, solCodelco: e.target.value })} />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="bodega">Bodega</label>
            <Autocomplete
              disablePortal
              id="bodega"
              options={opcionesBodega}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onBlur={(e) => setDatos({ ...datos, bodega: e.target.value })}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable</label>
            <Autocomplete
              disablePortal
              freeSolo
              id="responsable"
              options={opcionesResponsable}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onBlur={(e) => setDatos({ ...datos, responsableRetira: e.target.value })}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable Bodega</label>
            <Autocomplete
              disablePortal
              freeSolo
              id="responsableBodega"
              options={opcionesResponsableBodega}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onBlur={(e) => setDatos({ ...datos, responsableEntrega: e.target.value })}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>




        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Descripcion del Trabajo</label>
            <TextField
              id="descripcion"
              size="normal"
              fullWidth
              multiline
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
            />
          </div>

        </div>

        {/* Tabla */}

        <div className="grid gap-4 mt-10 grid-cols-1" >
          <div className="mb-5">
            <Tabla />
          </div>
        </div>


        {/* Firmas */}

        <div className="grid gap-4 mt-10 " >

          <Firmas
            datos={datos}
          />
        </div>

        <video ref={ref} />
        <p>
          <span>Last result:</span>
          <span>{result}</span>
        </p>

        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-all rounded"

        />

      </form >

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          No cameras found
        </Alert>
      </Snackbar>
    </div >
  )
}
