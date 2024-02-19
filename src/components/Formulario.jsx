import { useState, useRef, useEffect } from 'react'
import * as React from 'react';



//IMPORTAR COMPONENTE DE TABLA
import Tabla from './Tabla'

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from './Firmas'

//IMPORTAR COMPONENTE DE MULTISELECT BODEGAS
import MultipleSelectChipBodega from './selectBodegas'

//COMPONENTES DE MATERIAL UI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


//COMPONENTES MATERIAL UI DATE PICKERS
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es'

//LIBRERIA PARA TRABAJAR FECHAS
import dayjs from 'dayjs'



export default function Formulario({ vale, setVale }) {



  const [datos, setDatos] = useState({
    fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    area: '',
    solCodelco: '',
    bodegas: [], 
    responsableRetira: '',
    responsableEntrega: '',
    descripcion: '',
    observaciones: '',
    firmaSolicitante: '',
    firmaBodega: '',
    detalle: ''
  })

  //STATE DE LA TABLA
  const initialRows = [];
  const [rows, setRows] = React.useState(initialRows);


  //USEEFFECT PARA IR GRABANDO MODIFICACIONES DE LA TABLA 
  useEffect(() => {
    setDatos({ ...datos, detalle: rows })
  },[rows])

  const opcionesArea = [
    { label: 'Area Telecomunicaciones PSINET', value: 'Area Telecomunicaciones PSINET', id: 1 },
    { label: 'Area TI PSINET', value: 'Area TI PSINET', id: 2 },
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
    { label: 'Mauricio Barraza', value: 'Mauricio Barraza', id: 4 },
    { label: 'Rodrigo Caminada', value: 'Rodrigo Caminada', id: 5 },
  ]




  const handleSubmit = (e) => {
    e.preventDefault()

    
    
    console.log(datos)
   
    const myJSON = JSON.stringify(datos);

    console.log(myJSON)
    
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
            <MultipleSelectChipBodega
              setDatos={setDatos}
              datos={datos}
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
            <Tabla
              rows={rows}
              setRows={setRows}
            />
          </div>
        </div>


        {/* Observaciones */}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="observaciones">Observaciones</label>
            <TextField
              id="observaciones"
              size="normal"
              fullWidth
              multiline
              onChange={(e) => setDatos({ ...datos, observaciones: e.target.value })}
            />
          </div>

        </div>


        {/* Firmas */}

        <div className="grid gap-4 mt-10 " >

          <Firmas
            setDatos={setDatos}
            datos={datos}
          />
        </div>


        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-all rounded"

        />

      </form >


    </div >
  )
}
