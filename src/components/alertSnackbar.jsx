import React from 'react'
import { useNavigate } from "react-router-dom"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';


export default function alertSnackbar({ alert, setAlert }) {

    let navigate = useNavigate()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, estado: false });
    };

    const handleAceptar = () => {
        console.log('Tipo de Ticket:', datos.tipoTicket)
        //RE DIRECCIONAR AL TICKET EN LA BARRA DE DIRECCIONES
        if (alert.detalle_tipo === 'success_ticket') { 
            setAlert({ ...alert, estado: false, responseReturn: true }); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
    
            if (datos.tipoTicket === 'Compra') {
                navigate("/vale-entrada/" + alert.value);
            } else {
                navigate("/vale-salida/" + alert.value);
            }
        } else {
            // Otras acciones si no es un success_ticket
        }
    };

    return (
        <div className="">
            <Snackbar className="mb-8" open={alert.estado}  autoHideDuration={alert.time} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
                <Alert
                    onClose={handleClose}
                    severity={alert.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}

                >
                    <AlertTitle>{alert.titulo}</AlertTitle>
                    <div className="flex mt-4 font-bold justify-center items-center text-lg">  {alert.mensaje}</div>

                    {alert.detalle_tipo == 'success_ticket' ? <div className="mt-3 flex justify-center items-center">
                        <Button onClick={handleAceptar}  color="inherit" size="normal">
                        Aceptar
                        </Button>
                    </div> : ''}
                
                </Alert>
            </Snackbar>
        </div>
    )
}
