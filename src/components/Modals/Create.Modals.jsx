import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import CustomTextField from '../UI/CustomTextField';
import ButtonMui from '../UI/ButtonMui';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  '@media (min-width:600px)': {
    p: 4,
  },
};

const  CreateModal = ({name, title}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validatePositiveNumber = (value) => {
    const number = Number(value);
    return number > 0 && Number.isInteger(number);
  };

  return (
    <div>
      <ButtonMui name={name} handleOpen={handleOpen} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
       //onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                {title}
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:2 }}>
              
              <CustomTextField id="outlined-basic" label="Nombre Del Articulo" variant="outlined" fullWidth />
              <CustomTextField id="outlined-basic" label="SAP" variant="outlined" fullWidth />
              <CustomTextField id="outlined-basic" label="Codigo Interno" variant="outlined" fullWidth />
              <CustomTextField id="outlined-basic" label="SKU" variant="outlined" fullWidth />
              <CustomTextField id="outlined-basic" label="Unidad De Medida (CAJA, UNIDAD)" variant="outlined" fullWidth />
              <CustomTextField id="price" label="Precio" type='number' validate={validatePositiveNumber} />
              <CustomTextField id="outlined-basic" label="Cantidad" type='number' validate={validatePositiveNumber} variant="outlined" fullWidth />
              <input accept="image/*" id="contained-button-file" multiple type="file" style={{ display: 'none' }}  />
              <label htmlFor="contained-button-file">
                <Button fullWidth variant="contained" component="span">
                  Subir Imagen Del Articulo
                </Button>
              </label>
            </Box>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center'  }}>
              <Button fullWidth variant="contained" color="primary">Guardar</Button>
             
            </Box>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

 export default CreateModal;
