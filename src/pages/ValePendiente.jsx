import React, { useEffect, useState } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'

//IMAGENES
import logoPsinet from '../public/images/Logo-PSINet.png'

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar';

//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//IMPORTAR COMPONENTE DE FIRMA
import Firmas from '../components/Firmas'

//LIBRERIA PARA HACER FETCH
import axios from '../helpers/axios'

//IMPORTANDO CONTEXT
import { useAuth } from '../context/AuthContext'

//HELPERS
import { getSignature } from '../helpers/getSignature'

// PLUGINS DE TIMEZONE
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone);
dayjs.extend(utc);


export const ValePendiente = () => {

    const [searchParams] = useSearchParams();

    //NAVEGACION
    let navigate = useNavigate()

    const idTicket = searchParams.get("id");
    const email = searchParams.get("email");
    const pass = searchParams.get("p");
    const user = searchParams.get("user");




    //TRAYENDO LA FUNCION DE REGISTAR DESDE EL CONTEXT
    const { signin, isAuthenticated, setIsAuthenticated, errors } = useAuth()


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

    //STATE PARA ESPERAR CARGA DE FIRMAS
    const [awaitSignature, setAwaitSignature] = useState(false)

    //STATE PARA DECIRLE AL SISTEMA QUE ES UNA FIRMA QUE YA ESTA GUARDADA
    const [oldSignature, setOldSignature] = useState({
        signatureBodega: false,
        signatureRetira: false
    });

    //STATE PARA TRAER RESPONSABLES
    const [responsables, setResponsables] = useState([])

    //tate para las rows
    const [rows, setRows] = useState([])

    //STATE PARA TRAER UBICACIONES BODEGA
    const [ubicaciones, setUbicaciones] = useState([])



    const [datos, setDatos] = useState({
        fecha: '',
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
        detalle: '',
        idTicketSalida: ''
    })

    //STATE DEL LOGIN
    const [login, setLogin] = useState({
        correo: searchParams.get("email"),
        pass: searchParams.get("p")
    })

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

    }, [signin])

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

    }, [signin])




    //USEEFFECT PARA CARGAR :id POR PARAMETROS DE URL
    useEffect(() => {

        //ACTIVAR MENSAJE DE ESPERA
        setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Cerrando Ticket...', detalle_tipo: '', time: null });

        
        if (idTicket == undefined || email == undefined || pass == undefined || user == undefined) {
            navigate('/login/')
        }

        async function fetchTicketSalida() {
            //http://localhost:5173/vale-pendiente?id=357&email=no-sidebar@psinet.cl&p=cds614&user=javiera.zamorano@psinet.cl

            //Logear
            const requestJson = JSON.stringify(login);

            //ENVIAR DATOS EN ENDPOINT
            const responseLogin = await signin(requestJson)



            if (responseLogin.status == 400) {
                setAlert({ ...alert, estado: true, mensaje: `${responseLogin.data.message}`, tipo: 'error', titulo: `${responseLogin.statusText}`, detalle_tipo: '', time: null });
                navigate('/login/')
                return
            }

            if (responseLogin.status == 200) {
                //Traer ticket de la BD
                let response = ''

                try {
                    response = await axios.get(`/ticket/salida/${idTicket}`, { withCredentials: true });

                    //TRANSFORMAR A BASE 64 LAS FIRMAS
                    const signatures = await getSignature(idTicket)

                    //Agregar datos al state del ticket
                    const { fecha_creacion, ticketTrabajo, cliente_trabajo, solicitante, usuario_idusuario, CC, motivo, observaciones, detalle, fecha_cierre, responsableRetiraCorreo } = response.data;

                    //CONVERTIR FECHA A CHILE
                    const fecha = dayjs.utc(fecha_creacion);
                    const fechaConvertida = fecha.tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
                    // asignar al state de datos
                    setDatos({
                        fecha: fechaConvertida,
                        fechaCierre: fecha_cierre,
                        ticketTrabajo: ticketTrabajo,
                        solCodelco: cliente_trabajo,
                        responsableRetira: solicitante,
                        responsableEntrega: usuario_idusuario,
                        ceco: CC,
                        descripcion: motivo,
                        observaciones: observaciones,
                        firmaSolicitante: signatures.base64_retira,
                        firmaBodega: signatures.base64_entrega,
                        idTicketSalida: idTicket,
                        responsableRetiraCorreo: responsableRetiraCorreo,
                        detalle: detalle

                    });

                    setRows(...rows, detalle.map(function (det) { return det; }))

                   


                } catch (error) {

                    console.log(error)

                    if (error) {

                        setAlert({ ...alert, estado: true, mensaje: `${error}`, tipo: 'error', titulo: `Error`, detalle_tipo: '', time: null });

                    } if (error.response.data) {
                        setAlert({ ...alert, estado: true, mensaje: `${error.response.data.message}`, tipo: 'error', titulo: `${error.response.data.title}`, detalle_tipo: '', time: null });

                    } else {
                        setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });
                    }
                }
            }
        }


        if (idTicket !== undefined) {
            fetchTicketSalida(idTicket)
        }

    }, [])


 






    const handleSubmit = async (e) => {
        e.preventDefault();


        if (datos.firmaSolicitante === '') {
            setAlert({
                ...alert, estado: true, mensaje: 'No hay firma de quien retira los materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000
            });

            return;
        }

        // Enviar los datos
        enviarDatos();


    }

    const enviarDatos = async () => {

        const requestJson = JSON.stringify(datos);

        //ACTIVAR MENSAJE DE ESPERA
        setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Cerrando Ticket...', detalle_tipo: '', time: null });
        //ENVIAR DATOS EN ENDPOINT
        const response = await axios.post('/ticket/salida/close', requestJson, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).catch((error) => {
            setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });

        })

        if (response.status == 200) {
            setAlert({ ...alert, estado: true, mensaje: `N° Ticket: ${response.data.idTicket}`, tipo: 'success', titulo: 'Ticket Cerrado !', detalle_tipo: 'success_ticket_pendiente', time: null, value: response.data.idTicket });
        }
    

    }




    return (
        <div className="container mx-auto mt-5">
            <Alert
                alert={alert}
                setAlert={setAlert}
            />

            <div className={` bg-white shadow-md rounded-md py-5 px-5 `}>

                <header className='flex h-20 rounded-md p-4 justify-center  bg-gray-900 '>
                    <div className={` absolute transition-opacity ease-in `}  >
                        <img className=" h-11 w-18 md:h-12 " src={logoPsinet} alt="Your Company" />
                    </div>
                </header>

                <div className="text-center mt-6 ">

                    <h1 className={`text-4xl font-semibold text-black `}>TICKET N° {idTicket}</h1>
                    {datos.firmaSolicitante && datos.fechaCierre ?  <p className="mt-2 text-slate-100 text-2xl bg-green-400 rounded-md font-bold ">Ticket Firmado</p> : 
                    <p className="mt-2 text-slate-100 text-2xl bg-amber-500 rounded-md font-bold ">Ticket pendiente de firma</p>}


                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 mt-5">

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="Fecha">Fecha</label>
                            <TextField
                                type='text'
                                id="Fecha"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={datos.fecha}
                                disabled={true}
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="nroTicketTrabajo">Nro° Ticket de Trabajo</label>
                            <TextField
                                type='text'
                                id="nroTicketTrabajo"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={datos.ticketTrabajo}
                                disabled={true}
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="solCodelco">Solicitante Codelco</label>
                            <TextField
                                type='text'
                                id="solCodelco"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={datos.solCodelco}
                                disabled={true}
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="responsable">Responsable</label>
                            <TextField
                                type='text'
                                id="responsable"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={datos.responsableRetira}
                                disabled={true}
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="responsableBodega">Responsable Bodega</label>
                            <TextField
                                type='text'
                                id="responsableBodega"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={
                                    responsables.map(function (responsable) {
                                        if (responsable.id === datos.responsableEntrega) {
                                            return responsable.label
                                        }

                                    }).join('')}
                                disabled={true}
                            />
                        </div>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold text-left" htmlFor="descripcion">Descripcion del Trabajo</label>
                            <TextField
                                id="descripcion"
                                size="normal"
                                value={datos.descripcion}
                                disabled={true}
                                fullWidth
                                multiline

                            />
                        </div>


                    </div>

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mt-8 sm:grid-cols-1 md:grid-cols-1">

                        <div className={`mb-5`} >
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell align="right">Unidad</TableCell>
                                            <TableCell align="right">Descripcion</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Bodega/Ubicacion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.item}
                                                </TableCell>
                                                <TableCell align="right">{row.unidad}</TableCell>
                                                <TableCell align="right">{row.descripcion}</TableCell>
                                                <TableCell align="right">{row.cantidad}</TableCell>
                                                <TableCell align="right">{ubicaciones.map((option) => {
                                                    if (option.id_ubicacion_bodegas == row.ubicacion) {
                                                        return option.ubicacion
                                                    }
                                                })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </div>



                    </div>

                    <div className="grid gap-4 mt-10 " >
                        <Firmas

                            oldSignature={oldSignature}
                            setOldSignature={setOldSignature}
                            setDatos={setDatos}
                            datos={datos}
                            responsables={responsables}
                            idTicket={idTicket}
                        />
                    </div>

                    {datos.firmaSolicitante && datos.fechaCierre ? '' :
                        <input
                            type="submit"
                            className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
                            value={'cerrar vale'}
                        />}


                </form>


            </div>
        </div>
    )
}
