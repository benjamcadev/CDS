import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChipBodega({datos, setDatos, bodegas, idTicket}) {
  const theme = useTheme();
  
  return (
    <div>
     
        
        <Select
          id="bodega-multiple-chip"
          multiple
          fullWidth
          value={datos.bodegas}
          disabled={datos.bodegas.length > 0 && idTicket ? true : false}
          onChange={(e) => setDatos({ ...datos, bodegas: e.target.value })}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {bodegas.map((bodega) => (
            <MenuItem
              key={bodega.idbodegas}
              value={bodega.nombre}
              style={getStyles(bodega.nombre, datos.bodegas, theme)}
            >
              {bodega.nombre}
            </MenuItem>
          ))}
        </Select>
     
    </div>
  );
}