import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



export default function alertSnackbar({ alert, setAlert }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({...alert, estado: false});
    };


    return (
        <div>
            <Snackbar className="mb-8" open={alert.estado} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alert.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.mensaje}
                </Alert>
            </Snackbar>
        </div>
    )
}
