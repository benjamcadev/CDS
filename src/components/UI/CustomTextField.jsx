import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

const CustomTextField = ({ id, label, type = 'text', variant = 'outlined', fullWidth = true, value: initialValue, onChange, ...props }) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event);
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