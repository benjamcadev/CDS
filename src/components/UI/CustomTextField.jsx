import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

const CustomTextField = ({ id, label, type = 'text', variant = 'outlined', fullWidth = true, value: initialValue, onChange, ...props }) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const handleChange = (e) => {
    if (type === "number") {
      const newValue = e.target.value;
      if (newValue === "" || (Number(newValue) >= 0 && Number.isInteger(Number(newValue)))) {
        onChange(e);
      }
    } else {
      onChange(e);
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