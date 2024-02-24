import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';



export default function alertSnackbar({ alert, setAlert }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, estado: false });
    };


    return (
        <div>
            <Snackbar className="mb-8" open={alert.estado} autoHideDuration={8000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}} >
                <Alert
                    onClose={handleClose}
                    severity={alert.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>{alert.titulo}</AlertTitle>
                    {alert.mensaje}
                </Alert>
            </Snackbar>
        </div>
    )
}
