import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

//IMPORTAR COMPONENTE DE TABLA
import TablaEntrada from './TablaEntrada'

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from './Firmas'

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from './alertSnackbar'

// IMPORTAR COMPONENTE DE DIALOG
import Dialogo from './Dialogo'

//COMPONENTES DE MATERIAL UI
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, TextareaAutosize } from '@mui/material';



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
import { Compra, Devolucion, FirmasEntrada } from './Vale-Entrada';


export default function FormularioValeEntrada() {

  let { idTicket } = useParams();


  const [datos, setDatos] = useState({
    fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    tipoTicket: '',
    tipoCompra:'',
    numeroDocumento:'',
    tipoRecepcion:'',
    responsableRetira: '',
    responsableRetiraCorreo: '',
    responsableEntrega: '',
    responsableEntregaCorreo: '',
    descripcion: '',
    observaciones: '',
    firmaSolicitante: '',
    firmaBodega: '',
    detalle: ''
  });

  const [compraData, setCompraData] = useState({
    tipoCompra: '',
    numeroDocumento: '',
    tipoRecepcion: '',
    foto: null,
    descripcion: ''
  });
  
  const [devolucionData, setDevolucionData] = useState({
    tipoDevolucion: '',
    numeroDocumento: ''
  });


  // Estado de los tipos de ticket
  const [ tiposTicket, setTiposTicket ] = useState([]);

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

  
  const OpcionesTipoCompra = [
    { label: 'Guia Despacho', value: 'Guia Despacho', id: 1 },
    { label: 'Factura', value: 'Factura', id: 2 },
    { label: 'SEP', value: 'Factura', id: 3 },
  ];

  const OpcionesTipoRecepcion = [
    { label: 'BODEGA 6', value: 'BODEGA 6', id: 1 },
    { label: 'TICA', value: 'TICA', id: 2 },
  ];
  


  useEffect(() => {

    const fetchTiposTicket = async () => {
      try {
        const response = await axios.get('tipo_ticket/');
        setTiposTicket(response.data);
        console.log({response})
      } catch (error) {
        console.error('Error fetching tipos ticket:', error);
      }
    };

    fetchTiposTicket();
  }, []);



  //USEEFFECT PARA IR GRABANDO MODIFICACIONES DE LA TABLA 
  useEffect(() => {
    setDatos({ ...datos, detalle: rows });
  }, [rows]);

  //USE EFFECT PARA CAPTURAR RESPUESTA DEL DIALOGO
  useEffect(() => {
    if (dialogo.responseReturn) {
      enviarDatos();
    }
  }, [dialogo]);

  //USE EFFECT PARA CAPTURAR RESPUESTA DEL ALERT
  useEffect(() => {
    if (alert.responseReturn) {
    }
  }, [alert]);

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
    async function fetchTicketEntrada() {
      let response = '';
      try {
        response = await axios.get(`/ticket/entrada/${idTicket}`, { withCredentials: true });
      } catch (error) {
        if (error.response.data) {
          setAlert({ ...alert, estado: true, mensaje: `${error.response.data.message}`, tipo: 'error', titulo: `${error.response.data.title}`, detalle_tipo: '', time: null });
          return;
        } else {
          setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });
          return;
        }
      }

      const { fecha_creacion, cliente_trabajo, solicitante, usuario_idusuario, motivo, observaciones, detalle } = response.data;
      let bodegasTicketId = detalle.map((detalle_salida) => { return detalle_salida.bodega });
      bodegasTicketId = bodegasTicketId.filter((value, index) => bodegasTicketId.indexOf(value) === index);

      const bodegasBD = await getBodegas();

      let bodegasNombre = [];
      let j = 0;

      for (let i = 0; i < bodegasBD.length; i++) {
        if (bodegasTicketId[j] === bodegasBD[i].idbodegas) {
          bodegasNombre.push(bodegasBD[i].nombre);
          j++;
        }
      }

      const signatures = await getSignature(idTicket);

      setDatos({
        fecha: fecha_creacion,
        tipoTicket: tiposTicket,
        tipoCompra: tipoCompra,
        numeroDocumento: numeroDocumento,
        tipoRecepcion: tipoRecepcion,
        responsablesBodega: responsablesBodega,
        descripcion: descripcion,
        observaciones: observaciones,
        firmaSolicitante: signatures.base64_retira,
        firmaBodega: signatures.base64_entrega
      });

      detalle.map((linea_detalle, key) => {
        linea_detalle.item = key + 1;
        linea_detalle.id = key + 1;
      });

      setRows(detalle);
      setAwaitSignature(true);
    }

    if (idTicket !== undefined) {
      fetchTicketEntrada(idTicket);
    }
  }, []);
  
  useEffect(() => {
    if (datos.firmaBodega != '' && datos.firmaBodega) {
      setOldSignature({ signatureBodega: true });
    }
    if (datos.firmaSolicitante != '' && datos.firmaSolicitante) {
      setOldSignature({ signatureRetira: true });
    }
  }, [awaitSignature]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarDatos()) {
      enviarDatos();
    }
  };

  const validarDatos = () => {
    if (datos.tipoTicket === '') {
      setAlert({ ...alert, estado: true, mensaje: 'Falta completar el tipo de ticket', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 });
      return false;
    }
    if (datos.responsableEntrega === '') {
      setAlert({ ...alert, estado: true, mensaje: 'Falta completar el nombre responsable de bodega', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 });
      return false;
    }
    if (datos.detalle.length === 0) {
      setAlert({ ...alert, estado: true, mensaje: 'No has agregado materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000 });
      return false;
    }
    return true;
  };

  const enviarDatos = async () => {
    const tipoTicketSeleccionado = tiposTicket.find(ticket => ticket.nombre_tipo_ticket === datos.tipoTicket);
    console.log(tipoTicketSeleccionado)
    const tipo_ticket_idtipo_ticket = tipoTicketSeleccionado ? tipoTicketSeleccionado.id_tipo_ticket : null;
  
    console.log('Tipo Ticket ID:', tipo_ticket_idtipo_ticket); // Verificar el ID del tipo de ticket
  
    const requestJson = {
      ...datos,
      motivo: datos.descripcion,
      responsable_bodega: datos.responsableEntrega,
      foto_documentos: compraData.foto ? compraData.foto.name : '',
      tipo_ticket_idtipo_ticket: tipo_ticket_idtipo_ticket,
      usuario_idusuario: 1  // Asegúrate de que estás enviando el ID del usuario correcto
    };
  
    // Activar mensaje de espera
    setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Generando Ticket...', detalle_tipo: '', time: null });
  
    // Enviar datos en endpoint
    const response = await axios.post('/ticket/entrada/', requestJson, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).catch((error) => {
      setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });
    });
  
    if (response.status === 200) {
      setAlert({ ...alert, estado: true, mensaje: `N° Ticket: ${response.data.idTicket}`, tipo: 'success', titulo: 'Ticket Guardado !', detalle_tipo: 'success_ticket', time: null, value: response.data.idTicket });
    }
  };

  
   return (
    <div className="bg-white shadow-md rounded-md py-5 px-5 ">
      <Alert alert={alert} setAlert={setAlert} />
      <Dialogo dialogo={dialogo} setDialogo={setDialogo} />

      <form className="" onSubmit={handleSubmit}>
        {idTicket ? <h1 className="sm:text-2xl md:text-5xl font-bold tracking-tight pb-10 ">Ticket N° {idTicket}</h1> : ''}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Fecha Entrada</label>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                defaultValue={dayjs()}
                value={dayjs(datos.fecha)}
                disabled={datos.fecha !== '' && idTicket ? true : false}
                id="fecha"
                onChange={(newValue) => setDatos({ ...datos, fecha: dayjs(newValue).format('YYYY-MM-DD HH:mm:ss') })}
              />
            </LocalizationProvider>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 uppercase font-bold" htmlFor="tipoTicket">Tipo de Ticket</label>
            <Autocomplete
              disablePortal
              value={datos.tipoTicket}
              freeSolo
              id="tipoTicket"
              options={tiposTicket.map((tipo) => tipo.nombre_tipo_ticket)}
              onChange={(e, value) => setDatos({ ...datos, tipoTicket: value })}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          {/*{datos.tipoTicket === 'Compra' && (
            <Compra compraData={compraData} setCompraData={setCompraData} />
          )} */}

          {datos.tipoTicket === 'Compra' && (

            <>
              <div className="mb-5">
                <label className="block text-gray-700 uppercase font-bold" htmlFor="tipoCompra">Tipo de Compra</label>
                <Autocomplete
                  disablePortal
                  value={datos.tipoCompra}
                  freeSolo
                  id="tipoCompra"
                  options={OpcionesTipoCompra}
                  isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
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
                    isOptionEqualToValue={(option, value) => option.id === value.id} //SOLO ARA SACAR UN WARNING POR CONSOLA
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
               
               <div  className="mb-5">
                 <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">motivo</label>
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
                          return responsable.label
                        }
                      }).join('')
                    }
                    disabled={datos.responsableEntrega !== '' && idTicket ? true : false}
                    id="responsableBodega"
                    options={responsablesBodega}
                    isOptionEqualToValue={(option, value) => option.id === value.nombre}
                    onChange={(e, value) => { setDatos({ ...datos, responsableEntrega: value.label, responsableEntregaCorreo: value.correo }) }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                
              
            </>
          )}

          {datos.tipoTicket === 'Devolucion' && (
            <Devolucion devolucionData={devolucionData} setDevolucionData={setDevolucionData} />
          )}

        </div>
        <div className="grid gap-4 mt-4 mb-10 grid-cols-1">
          <div className="mb-4">
            <TablaEntrada
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
        <div className="grid gap-4 mt-10">
          <FirmasEntrada
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
      </form>
    </div>
  );
}
