import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';



export default function Dialogo({ dialogo, setDialogo }) {

    const handleClose = () => {
        setDialogo({...dialogo, estado: false, responseReturn: false});
        
      };

    const handleAceptar = () => {
        setDialogo({...dialogo, estado: false, responseReturn: true});
       
    }  


    return (
        <div>
            <Dialog
                open={dialogo.estado}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogo.titulo}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogo.mensaje}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{dialogo.boton1Texto}</Button>
                    <Button onClick={handleAceptar} autoFocus>
                        {dialogo.boton2Texto}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
