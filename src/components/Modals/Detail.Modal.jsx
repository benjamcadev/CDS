import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArticleDetailForm from '../UI/ArticleDetailForm';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 420,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  '@media (min-width:600px)': {
    p: 4,
  },
};

const DetailModal = ({ open, handleClose, article, onUpdate , onDelete }) => {

  return (
    <Modal open={open}>
      <Box sx={ style }>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="transition-modal-title" variant="h5" component="h2">
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