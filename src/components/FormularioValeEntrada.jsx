import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TablaEntrada from './TablaEntrada';
import axios from '../helpers/axios';
import { getSignature } from '../helpers/getSignature';
import { getBodegas } from '../helpers/getBodegas';
import dayjs from 'dayjs';
import { AjusteInventario, Compra, Devolucion, FirmasEntrada, Inventario } from './Vale-Entrada';
import { alertSnackbarEntrada as Alert } from './Vale-Entrada/alertSnackbarEntrada';

import Dialogo from './Dialogo';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';

export default function FormularioValeEntrada() {
  let { idTicket } = useParams();

  const [datos, setDatos] = useState({
    fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    tipoTicket: '',
    tipoCompra: '',
    numeroDocumento: '',
    tipoRecepcion: '',
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



  const [tiposTicket, setTiposTicket] = useState([]);
  const initialRows = [];
  const [rows, setRows] = useState(initialRows);
  const [alert, setAlert] = useState({
    estado: false,
    mensaje: 'Mensaje de prueba',
    titulo: '',
    detalle_tipo: '',
    time: null,
    responseReturn: false,
    value: ''
  });

  const [dialogo, setDialogo] = useState({
    estado: false,
    mensaje: 'Mensaje de prueba',
    titulo: 'Titulo de prueba',
    boton1Texto: 'Cancelar',
    boton2Texto: 'Aceptar',
    responseReturn: false
  });

  const [bodegas, setBodegas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [responsablesBodega, setResponsablesBodega] = useState([]);
  const [awaitSignature, setAwaitSignature] = useState(false);
  const [oldSignature, setOldSignature] = useState({
    signatureBodega: false,
    signatureRetira: false
  });


  useEffect(() => {
    const fetchTiposTicket = async () => {
      try {
        const response = await axios.get('tipo_ticket/');
        setTiposTicket(response.data);
        console.log({ response });
      } catch (error) {
        console.error('Error fetching tipos ticket:', error);
      }
    };
    fetchTiposTicket();
  }, []);

  useEffect(() => {
    setDatos({ ...datos, detalle: rows });
  }, [rows]);

  useEffect(() => {
    if (dialogo.responseReturn) {
      enviarDatos();
    }
  }, [dialogo]);

  useEffect(() => {
    if (alert.responseReturn) {
      //limpiarCampos();
    }
  }, [alert]);

  useEffect(() => {
    async function fetchBodegas() {
      try {
        const response = await axios.get('bodegas/', { withCredentials: true });
        setBodegas(response.data);
      } catch (error) {
        console.error('Hubo un error fetch bodegas: ' + error);
      }
    }
    fetchBodegas();
  }, []);

  useEffect(() => {
    async function fetchUbicaciones() {
      try {
        const response = await axios.get('bodegas/ubicacion/', { withCredentials: true });
        setUbicaciones(response.data);
      } catch (error) {
        console.error('Hubo un error fetch ubicaciones bodega: ' + error);
      }
    }
    fetchUbicaciones();
  }, []);

  useEffect(() => {
    async function fetchResponsables() {
      try {
        const response = await axios.get(`/usuarios/${3}`, { withCredentials: true }); //3 ES USUARIOS RESPONSABLES
        const response2 = await axios.get(`/usuarios/${1}`, { withCredentials: true }); //1 ES USUARIOS ADMIN
        setResponsables(response.data.concat(response2.data));
        setResponsablesBodega(response2.data);
      } catch (error) {
        console.error('Hubo un error fetch usuarios responsables: ' + error);
      }
    }
    fetchResponsables();
  }, []);

  useEffect(() => {
    if (!datos.firmaSolicitante == '') {
      setDatos({ ...datos, fechaCierre: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    }
  }, [datos.firmaSolicitante]);

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
        responsableEntrega: responsableEntrega,
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
  }, [idTicket]);

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
    const tipo_ticket_idtipo_ticket = tipoTicketSeleccionado ? tipoTicketSeleccionado.id_tipo_ticket : null;

    const requestJson = {
      ...datos,
      motivo: datos.descripcion,
      responsable_bodega: datos.responsableEntrega,
      foto_documentos: datos.foto ? datos.foto.name : '',
      tipo_ticket_idtipo_ticket: tipo_ticket_idtipo_ticket,
      usuario_idusuario: 1  // ID del usuario logueado
    };

    setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Generando Ticket...', detalle_tipo: '', time: null });

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
    <div className="bg-white shadow-md rounded-md py-5 px-5">
      <Alert
        alert={alert}
        setAlert={setAlert}
        setdatos={setDatos}
        setRows={setRows}
      />
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
          
        {/* Sección de Compra, Inventario, Devolucion, Ajuste de inventario */}
        
          {datos.tipoTicket === 'Compra' && (
           <Compra datos={datos} setDatos={setDatos} responsables={responsables} responsablesBodega={responsablesBodega} />
          )}

          {datos.tipoTicket === 'Inventario' && (
            <Inventario datos={datos} setDatos={setDatos} responsables={responsables} responsablesBodega={responsablesBodega} />
          )}

          {datos.tipoTicket === 'Devolucion' && (
            <Devolucion datos={datos} setDatos={setDatos} responsables={responsables} responsablesBodega={responsablesBodega} idTicket={idTicket} />
          )}

          {datos.tipoTicket === 'Ajuste de Inventario' && (
            <AjusteInventario datos={datos} setDatos={setDatos} responsables={responsables} responsablesBodega={responsablesBodega} />
          )}

        </div>

        <div className="grid gap-4 mt-4 mb-10 grid-cols-1">
          <div className="mb-4">
            <TablaEntrada
              rows={rows}
              setRows={setRows}
              datos={datos}
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
        {!idTicket && (
          <input
            type="submit"
            className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
            value={'cerrar vale'}
          />
        )}
      </form>
    </div>
  );
}