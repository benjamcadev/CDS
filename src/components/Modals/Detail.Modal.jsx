import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArticleDetailForm from '../UI/ArticleDetailForm';



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

const DetailModal = ({ open, handleClose, article }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={ style }>

        
        <Typography variant="h6" component="h2">
          Detalle del Artículo
        </Typography>
        <ArticleDetailForm article={article} />
      </Box>
    </Modal>
  );
};

export default DetailModal;