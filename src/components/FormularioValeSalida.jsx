import { useState, useRef, useEffect, useReducer } from 'react'
import * as React from 'react';
import { useParams } from 'react-router-dom'

//IMPORTAR COMPONENTE DE TABLA
import Tabla from './Tabla'

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from './Firmas'

//IMPORTAR COMPONENTE DE MULTISELECT BODEGAS
//import MultipleSelectChipBodega from './SelectBodegas'

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
import axios from '../helpers/axios'

//IMPORTAR HELPERS
import { getBodegas } from '../helpers/getBodegas'
import { getSignature } from '../helpers/getSignature'

export default function FormularioValeSalida() {

  let { idTicket } = useParams();


  const [datos, setDatos] = useState({
    fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    fechaCierre: '',
    ticketTrabajo: '',
    solCodelco: '',

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
    time: null,
    responseReturn: false,
    value: ''
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

  //STATE PARA TRAER UBICACIONES BODEGA
  const [ubicaciones, setUbicaciones] = useState([])

  //STATE PARA TRAER RESPONSABLES
  const [responsables, setResponsables] = useState([])

  //STATE PARA TRAER RESPONSABLES DE BODEGA
  const [responsablesBodega, setResponsablesBodega] = useState([])

  //STATE PARA ESPERAR CARGA DE FIRMAS
  const [awaitSignature, setAwaitSignature] = useState(false)

  //STATE PARA DECIRLE AL SISTEMA QUE ES UNA FIRMA QUE YA ESTA GUARDADA
  const [oldSignature, setOldSignature] = useState({
    signatureBodega: false,
    signatureRetira: false
  })




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

  //USE EFFECT PARA CAPTURAR RESPUESTA DEL ALERT
  useEffect(() => {
    if (alert.responseReturn) {
      //REDIRECIONAR

    }
  }, [alert])

  //USE EFFECT PARA TRAER BODEGAS

  useEffect(() => {

    async function fetchBodegas() {
      try {
        const response = await axios.get('bodegas/', { withCredentials: true });
        setBodegas(response.data)
      } catch (error) {
        console.error('Hubo un error fetch bodegas: ' + error);
      }
    }

    fetchBodegas()

  }, [])

  //USE EFFECT PARA TRAER UBICACIONES BODEGAS

  useEffect(() => {

    async function fetchUbicaciones() {
      try {
        const response = await axios.get('bodegas/ubicacion/', { withCredentials: true });
        setUbicaciones(response.data)
      } catch (error) {
        console.error('Hubo un error fetch ubicaciones bodega: ' + error);
      }
    }

    fetchUbicaciones()

  }, [])




  //USE EFFECT PARA TRAER RESPONSABLES y RESPONSABLES DE BODEGA

  useEffect(() => {

    async function fetchResponsables() {
      try {
        const response = await axios.get(`/usuarios/${3}`, { withCredentials: true }); //3 ES USUARIOS RESPONSABLES
        const response2 = await axios.get(`/usuarios/${1}`, { withCredentials: true }); //1 ES USUARIOS ADMIN
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

  //USEEFFECT PARA CARGAR :id POR PARAMETROS DE URL
  useEffect(() => {

    async function fetchTicketSalida() {
      //Traer ticket de la BD
      let response = ''
      try {
        response = await axios.get(`/ticket/salida/${idTicket}`, { withCredentials: true });

      } catch (error) {

        if (error.response.data) {
          setAlert({ ...alert, estado: true, mensaje: `${error.response.data.message}`, tipo: 'error', titulo: `${error.response.data.title}`, detalle_tipo: '', time: null });
          return
        } else { setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null }); return }

      }


      //Agregar datos al state del ticket
      const { fecha_creacion,  ticketTrabajo , cliente_trabajo, solicitante, usuario_idusuario, CC, motivo, observaciones, detalle } = response.data;
      //SACAR LAS BODEGAS
      let bodegasTicketId = detalle.map((detalle_salida) => { return detalle_salida.bodega })
      //ELIMINAMOS BODEGAS DUPLICADAS
      bodegasTicketId = bodegasTicketId.filter((value, index) => bodegasTicketId.indexOf(value) === index)

      //HELPER PARA OBTENER BODEGAS DESDE LA BD
      const bodegasBD = await getBodegas()

      //RECORRER BODEGAS DEL TICKET Y ASOCIAR NOMBRES
      let bodegasNombre = []
      let j = 0

      for (let i = 0; i < bodegasBD.length; i++) {
        if (bodegasTicketId[j] === bodegasBD[i].idbodegas) {
          bodegasNombre.push(bodegasBD[i].nombre)
          j++
        }

      }

      //TRANSFORMAR A BASE 64 LAS FIRMAS
      const signatures = await getSignature(idTicket)
    

      setDatos({

        fecha: fecha_creacion,
        ticketTrabajo: ticketTrabajo,
        solCodelco: cliente_trabajo,
        responsableRetira: solicitante,
        responsableEntrega: usuario_idusuario,
        ceco: CC,
        descripcion: motivo,
        observaciones: observaciones,
        firmaSolicitante: signatures.base64_retira,
        firmaBodega: signatures.base64_entrega


      })

      detalle.map((linea_detalle, key) => {
        linea_detalle.item = key + 1
        linea_detalle.id = key + 1
      })

      setRows(detalle)
      setAwaitSignature(true)


    }

    if (idTicket !== undefined) {
      fetchTicketSalida(idTicket)

    }

  }, [])

  useEffect(() => {

    //SETEA EN CASO QUE LAS FIRMAS YA ESTAN GUARDADAS, PARA QUE NO SE PUEDA EDITAR Y SOLO SE RENDERIZE UN COMPONENTE DE IMG
    if (datos.firmaBodega != '' && datos.firmaBodega) {
      setOldSignature({ signatureBodega: true })

    }
    if (datos.firmaSolicitante != '' && datos.firmaSolicitante) {
      setOldSignature({ signatureRetira: true })

    }
  }, [awaitSignature]);



  {/*const opcionesArea = [
    { label: 'Area Telecomunicaciones PSINET', value: 'Area Telecomunicaciones PSINET', id: 1 },
    { label: 'Area TI PSINET', value: 'Area TI PSINET', id: 2 },
    { label: 'Sonda', value: 'Sonda', id: 3 },
    { label: 'IBM/ Coasin', value: 'IBM/ Coasin', id: 4 },

   ]; */}

  const handleSubmit = (e) => {
    e.preventDefault()
    //VALIDAR DATOS VACIOS
    if (datos.ticketTrabajo == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el area', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.responsableRetira == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el nombre responsable que retira', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.responsableEntrega == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar el nombre responsable de bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.descripcion == '') { setAlert({ ...alert, estado: true, mensaje: 'Falta completar una descripcion del trabajo', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.detalle == '') { setAlert({ ...alert, estado: true, mensaje: 'No has agregado materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.firmaBodega == '') { setAlert({ ...alert, estado: true, mensaje: 'No hay firma del responsable bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    if (datos.firmaSolicitante == '') { setAlert({ ...alert, estado: true, mensaje: 'No hay firma de quien retira los materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 }); return }
    // if (datos.firmaSolicitante == '' ) {
    //   setDialogo({ ...dialogo, estado: true, mensaje: 'Hemos detectado que no hay firma de quien retira los materiales, ¿Deseas guardar el detalle del vale, y cerrarlo más tarde?', titulo: '¿Desea dejar el vale abierto?', boton1: 'Cancelar', boton2: 'Aceptar' });
    // } else {

    //   enviarDatos()
    // }

    enviarDatos()

  }

  const enviarDatos = async () => {

    const requestJson = JSON.stringify(datos);
    //ACTIVAR MENSAJE DE ESPERA
    setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Generando Ticket...', detalle_tipo: '', time: null });
    //ENVIAR DATOS EN ENDPOINT
    const response = await axios.post('/ticket/salida/', requestJson, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).catch((error) => {
      setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });

    })

    if (response.status == 200) {
      setAlert({ ...alert, estado: true, mensaje: `N° Ticket: ${response.data.idTicket}`, tipo: 'success', titulo: 'Ticket Guardado !', detalle_tipo: 'success_ticket', time: null, value: response.data.idTicket });
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
        {idTicket ? <h1 className="sm:text-2xl md:text-5xl font-bold tracking-tight pb-10 ">Ticket N° {idTicket}</h1> : ''}

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
                value={dayjs(datos.fecha)}
                disabled={datos.fecha != '' && idTicket ? true : false}
                id="fecha"
                onChange={(newValue) => setDatos({ ...datos, fecha: dayjs(newValue).format('YYYY-MM-DD HH:mm:ss') })}

              />
            </LocalizationProvider>

          </div>


          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="areaSolicitante">Nro° Ticket de Trabajo</label>
            <TextField
              type='number'
              id="areaSolicitante"
              size="normal"
              fullWidth
              variant="outlined"
              value={datos.ticketTrabajo}
              disabled={datos.ticketTrabajo != '' && idTicket ? true : false}
              onChange={(e) => setDatos({ ...datos, ticketTrabajo: e.target.value })} />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="codelcoSolicitante">Solicitante Codelco</label>
            <TextField
              id="codelcoSolicitante"
              size="normal"
              fullWidth
              variant="outlined"
              value={datos.solCodelco}
              disabled={datos.solCodelco != '' && idTicket ? true : false}
              onChange={(e) => setDatos({ ...datos, solCodelco: e.target.value })} />
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
            <label className="block text-gray-700 uppercase font-bold" htmlFor="responsable">Responsable Bodega</label>
            <Autocomplete
              disablePortal
              freeSolo
              value={
                responsables.map(function (responsable) {
                  if (responsable.id === datos.responsableEntrega) {
                    return responsable.label
                  }

                }).join('')}
              disabled={datos.responsableEntrega != '' && idTicket ? true : false}
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
              value={datos.ceco}
              disabled={datos.ceco != '' && idTicket ? true : false}
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
              value={datos.descripcion}
              disabled={datos.descripcion != '' && idTicket ? true : false}
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
              ubicaciones={ubicaciones}
              alert={alert}
              setAlert={setAlert}
              idTicket={idTicket}

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
              value={datos.observaciones}
              disabled={datos.observaciones != '' && idTicket ? true : false}
            />
          </div>

        </div>


        {/* Firmas */}



        <div className="grid gap-4 mt-10 " >
          <Firmas
            awaitSignature={awaitSignature}
            oldSignature={oldSignature}
            setOldSignature={setOldSignature}
            setDatos={setDatos}
            datos={datos}
            responsables={responsables}
            idTicket={idTicket}
          />
        </div>


        {idTicket ?
          ''
          :
          <input
            type="submit"
            className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
            value={'cerrar vale'}
          />
        }


      </form >


    </div >
  )
}
