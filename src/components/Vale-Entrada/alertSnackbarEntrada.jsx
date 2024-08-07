import React from 'react';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

export const alertSnackbarEntrada = ({ alert, setAlert, setdatos, setRows }) => {

    let navigate = useNavigate();

    const initialRows = [];

    const limpiarCampos = () => {
    setdatos({
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
    setRows(initialRows);
    setAlert({
        estado: false,
        mensaje: '',
        titulo: '',
        detalle_tipo: '',
        time: null,
        responseReturn: false,
        value: ''
    });
  };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, estado: false });
        if (alert.detalle_tipo === 'success_ticket') {
            console.log("Exito")
            navigate("/vale-entrada");
            limpiarCampos();
        }
    };

    const handleAceptar = () => {
        if (alert.detalle_tipo === 'success_ticket') {
            setAlert({ ...alert, estado: false, responseReturn: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate("/vale-entrada");
            limpiarCampos();
            //window.location.href = "/vale-entrada"; 
        }
    };

    return (
        <div className="">
            <Snackbar 
                className="mb-8" 
                open={alert.estado} 
                autoHideDuration={alert.time} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
            >
                <Alert
                    onClose={handleClose}
                    severity={alert.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>{alert.titulo}</AlertTitle>
                    <div className="flex mt-4 font-bold justify-center items-center text-lg">
                        {alert.mensaje}
                    </div>
                    {alert.detalle_tipo === 'success_ticket' && (
                        <div className="mt-3 flex justify-center items-center">
                            <Button onClick={handleAceptar} color="inherit" size="normal">
                                Aceptar
                            </Button>
                        </div>
                    )}
                </Alert>
            </Snackbar>
        </div>
    );
};