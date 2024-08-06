import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const AlertComponent = ({ message, severity, onClose }) => {
  return (
    <Stack sx={{ width: '100%', mt: '1.5', mb:'1.5' }} spacing={2}>
      <Alert variant="filled" severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Stack>
  );
};

export default AlertComponent;