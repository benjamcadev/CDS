import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const SearchBar = ({ value, onChange, onEnter }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <TextField
      type="text"
      placeholder="Buscar Artículo..."
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyPress}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon />
          </InputAdornment>
        ),
        className: "w-[300%]", // Puedes ajustar el ancho del input aquí
      }}
      className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchBar;