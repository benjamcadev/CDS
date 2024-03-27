import { useState, useRef, useEffect } from 'react'
import * as React from 'react';



//IMPORTAR COMPONENTE DE TABLA
import Tabla from './Tabla'

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from './Firmas'

//IMPORTAR COMPONENTE DE MULTISELECT BODEGAS
import MultipleSelectChipBodega from './selectBodegas'

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from './alertSnackbar'

// IMPORTAR COMPONENTE DE DIALOG
import Dialogo from './Dialogo'

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

//LIBRERIA PARA HACER FETCH
import axios from 'axios'

export default function Formulario({ vale, setVale }) {



  const [datos, setDatos] = useState({
    fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    fechaCierre: '',
    area: '',
    solCodelco: '',
    bodegas: [],
    responsableRetira: '',
    responsableRetiraCorreo: '',
    responsableEntrega: '',
    responsableEntregaCorreo: '',
    ceco: '',
    descripcion: '',
    observaciones: '',
    firmaSolicitante: '',
    firmaBodega: '',
    detalle: ''
  })

  //STATE DE LA TABLA
  const initialRows = [];
  const [rows, setRows] = useState(initialRows);

  //STATE DE ALERT SNACKBAR
  const [alert, setAlert] = useState({
    estado: false,
    mensaje: 'Mensaje de prueba',
    titulo: '',
    detalle_tipo: '',
    time: null
  });

  //STATE DE DIALOG
  const [dialogo, setDialogo] = useState({
    estado: false,
    mensaje: 'Mensaje de prueba',
    titulo: 'Titulo de prueba',
    boton1Texto: 'Cancelar',
    boton2Texto: 'Aceptar',
    responseReturn: false
  });

  //STATE PARA TRAER BODEGAS
  const [bodegas, setBodegas] = useState([])

  //STATE PARA TRAER RESPONSABLES
  const [responsables, setResponsables] = useState([])

  //STATE PARA TRAER RESPONSABLES DE BODEGA
  const [responsablesBodega, setResponsablesBodega] = useState([])


  //USEEFFECT PARA IR GRABANDO MODIFICACIONES DE LA TABLA 
  useEffect(() => {
    setDatos({ ...datos, detalle: rows })
  }, [rows])

  //USE EFFECT PARA CAPTURAR RESPUESTA DEL DIALOGO
  useEffect(() => {
    if (dialogo.responseReturn) {
      console.log("Boton Aceptar")
      //ENVIAR DATOS CON VALE ABIERTO
      enviarDatos()
    }
  }, [dialogo])

  //USE EFFECT PARA TRAER BODEGAS

  useEffect(() => {

    async function fetchBodegas() {
      try {
        const response = await axios.get('http://186.64.113.208:3000/bodegas/');
        setBodegas(response.data)
      } catch (error) {
        console.error('Hubo un error fetch bodegas: ' + error);
      }
    }

    fetchBodegas()

  }, [])

  //USE EFFECT PARA TRAER RESPONSABLES y RESPONSABLES DE BODEGA

  useEffect(() => {

    async function fetchResponsables() {
      try {
        const response = await axios.get(`http://186.64.113.208:3000/usuarios/${3}`); //3 ES USUARIOS RESPONSABLES
        const response2 = await axios.get(`http://186.64.113.208:3000/usuarios/${1}`); //1 ES USUARIOS ADMIN
        setResponsables(response.data.concat(response2.data))
        setResponsablesBodega(response2.data)

      } catch (error) {
        console.error('Hubo un error fetch usuarios responsables: ' + error);
      }
    }

    fetchResponsables()

  }, [])

  //USE EFFECT PARA DETECTAR SI HAY FIRMA Y GRABAR FECHA DE CIERRE
  useEffect(() => {
    if (!datos.firmaSolicitante == '') {
      setDatos({ ...datos, fechaCierre: dayjs().format('YYYY-MM-DD HH:mm:ss') })
    }
  }, [datos.firmaSolicitante])



  const opcionesArea = [
    { label: 'Area Telecomunicaciones PSINET', value: 'Area Telecomunicaciones PSINET', id: 1 },
    { label: 'Area TI PSINET', value: 'Area TI PSINET', id: 2 },
    { label: 'Sonda', value: 'Sonda', id: 3 },
    { label: 'IBM/ Coasin', value: 'IBM/ Coasin', id: 4 },

  ];

  const handleSubmit = (e) => {
    e.preventDefault()

    //VALIDAR DATOS VACIOS
    if (datos.area == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el area', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.bodegas.length == 0) { setAlert({ ...alert, estado: true, mensaje: 'Falta seleccionar bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.responsableRetira == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el nombre responsable que retira', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.responsableEntrega == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el nombre responsable de bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.descripcion == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar una descripcion del trabajo', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.detalle == '') { setAlert({ ...alert, estado: true, mensaje: 'No has agregado materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.firmaBodega == '') { setAlert({ ...alert, estado: true, mensaje: 'No hay firma del responsable bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.firmaSolicitante == '') {
      setDialogo({ ...dialogo, estado: true, mensaje: 'Hemos detectado que no hay firma de quien retira los materiales, ¿Deseas guardar el detalle del vale, y cerrarlo más tarde?', titulo: '¿Desea dejar el vale abierto?', boton1: 'Cancelar', boton2: 'Aceptar' });
    } else {

      enviarDatos()
    }

  }

  const enviarDatos = async () => {

    const requestJson = JSON.stringify(datos);
    //ACTIVAR MENSAJE DE ESPERA
    setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Generando Ticket...',detalle_tipo: '', time: null  });
    //ENVIAR DATOS EN ENDPOINT
    const response = await axios.post('http://186.64.113.208:3000/ticket/salida/', requestJson, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch((error) => {
      setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null  });

    })

    if (response.status == 200) {
      setAlert({ ...alert, estado: true, mensaje: `N° Ticket: ${response.data.idTicket}`, tipo: 'success', titulo: 'Ticket Guardado !',detalle_tipo: 'success_ticket', time: null  });
    }

  }

  return (
    <div className="bg-white shadow-md rounded-md py-5 px-5 ">

      <Alert
        alert={alert}
        setAlert={setAlert}
      />

      <Dialogo
        dialogo={dialogo}
        setDialogo={setDialogo}

      />

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
              bodegas={bodegas}
            />
          </div>


          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable</label>
            <Autocomplete
              disablePortal
              freeSolo
              id="responsable"
              options={responsables}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onChange={(e, value) => { setDatos({ ...datos, responsableRetira: value.label, responsableRetiraCorreo: value.correo }) }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable Bodega</label>
            <Autocomplete
              disablePortal
              freeSolo
              id="responsableBodega"
              options={responsablesBodega}
              isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
              onChange={(e, value) => { setDatos({ ...datos, responsableEntrega: value.id, responsableEntregaCorreo: value.correo }) }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="codelcoSolicitante">Centro de Costos</label>
            <TextField
              id="ceco"
              size="normal"
              fullWidth
              variant="outlined"
              onChange={(e) => setDatos({ ...datos, ceco: e.target.value })} />
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

        <div className="grid gap-4 mt-10 mb-10 grid-cols-1" >
          <div className="mb-5">
            <Tabla
              rows={rows}
              setRows={setRows}
              bodegas={bodegas}
              alert={alert}
              setAlert={setAlert}

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
            responsables={responsables}
          />
        </div>


        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-all rounded"
          value={'cerrar vale'}
        />

      </form >


    </div >
  )
}
