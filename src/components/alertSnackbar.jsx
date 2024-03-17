import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';



export default function alertSnackbar({ alert, setAlert }) {



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, estado: false });
    };

    const handleAceptar = () => {
        //RE DIRECCIONAR AL TICKET EN LA BARRA DE DIRECCIONES
        setAlert({ ...alert, estado: false });
    }


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
