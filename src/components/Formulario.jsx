import { useState, useRef } from 'react'
import * as React from 'react';

//IMPORTAR COMPONENTE DE TABLA
import Tabla from './Tabla'

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

//COMPONENTE DE FIRMA
import SignatureCanvas from 'react-signature-canvas'




export default function Formulario({ vale, setVale }) {


  const sigCanvas = useRef({});

  const [fecha, setFecha] = useState('')
  const [area, setArea] = useState('')
  const [imageURL, setImageURL] = useState(null);


  const opcionesArea = [
    { label: 'Telecomunicaciones', value: 'Telecomunicaciones', id: 1 },
    { label: 'Area TI', value: 'Area TI', id: 2 },
    { label: 'Sonda', value: 'Sonda', id: 3 },
    { label: 'IBM/ Coasin', value: 'IBM/ Coasin', id: 4 },

  ];



  const save = () => {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));

    console.log(imageURL)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    alert(fecha + " " + area)
  }

  return (
    <div className="bg-white shadow-md rounded-md py-5 px-5 ">

      <form className="" onSubmit={handleSubmit}>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Fecha</label>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="es"
            >
              <DatePicker
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                id="fecha"
                onChange={(newValue) => setFecha(dayjs(newValue).format('YYYY-MM-DD HH:mm:ss'))}

              />
            </LocalizationProvider>

          </div>


          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="areaSolicitante">Area Solicitante</label>
            <Autocomplete
              disablePortal
              id="area"
              options={opcionesArea}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onBlur={(e) => setArea(e.target.value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Descripcion del Trabajo</label>
            <TextField
              id="descripcion"
              size="normal"
              fullWidth
              multiline
              
            />
          </div>


        </div>

        {/* Tabla */}

        <div className="grid gap-4 grid-cols-1" >
          <div className="mb-5">
            <Tabla />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2" >
          <div className="mb-5">
            <p className="block text-gray-700 uppercase font-bold">
              FIRMA QUIEN RETIRA
            </p>
            <SignatureCanvas
              penColor='blue'
              ref={sigCanvas}
              canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200, }}
            />
          </div>



          <div className="mb-5 ">
            <p className="block text-gray-700 uppercase font-bold">
              FIRMA RESPONSABLE BODEGA</p>
            <SignatureCanvas
              penColor='blue'
              ref={sigCanvas}
              canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200, }}
            />
          </div>
        </div>

        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-all"

        />




      </form >

      <button onClick={save}>Save</button>
    </div >
  )
}
