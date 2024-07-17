import { TextField } from '@mui/material';
import { useState } from 'react';

const CustomTextField = ({ id, label, type = 'text', variant = 'outlined', fullWidth = true, validate, ...props }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (!validate || validate(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};

export default CustomTextField;
