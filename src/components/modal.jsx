import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//IMPORTANTO EL AUTOCOMPLETE SEARCH
import AutocompleteSearch from './autocompleteSearch'

export default function SearchModal({openModal, setOpenModal}) {
 

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
    
      <Dialog
        open={openModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle >Busqueda de Material</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Escribe el codigo o descripcion del material
          </DialogContentText>

          <AutocompleteSearch className="mt-10"/>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button type="submit">Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}