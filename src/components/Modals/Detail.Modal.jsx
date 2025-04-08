import React from 'react';
import ArticleDetailForm from '../UI/ArticleDetailForm';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '40%', // Cambia a un porcentaje para adaptarse mejor
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto', // Añade overflow para permitir el desplazamiento si es necesario
  maxHeight: '90vh', //  modal no se extienda más allá de la vista
  '@media (min-width:600px)': {
    p: 2,
    maxWidth: '40%', // Cambia a un porcentaje para adaptarse mejor
  },
};

const DetailModal = ({ open, handleClose, article, onUpdate , onDelete }) => {

 

  return (
    <Modal open={open}>
      <Box sx={ style }>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="transition-modal-title" sx={{ fontWeight: 'font-bold' }} variant="h5" component="h2">
            Detalle del Artículo
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>    
        </Box>
        <ArticleDetailForm article={article} onClose={ handleClose } onUpdate={onUpdate} onDelete={ onDelete } />
      </Box>
    </Modal>
  );
};

export default DetailModal;