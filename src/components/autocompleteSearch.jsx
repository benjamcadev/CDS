import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function AutocompleteSearch() {
  const [value, setValue] = React.useState(null);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={top100Films}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: 400 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="" />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    {
      title: "LAPIZ CORRECTOR PUNTA METALICA X 1UN PROARTE"
    },
    {
      title: "TACO 9X9CM X 1UN"
    },
    {
      title: 'APRETADORES BINDER CLIP 12UN 5/8\" 41MM ISOFIT'
    },
    {
      title: 'APRETADORES DOBLE CLIP 1\" 12UN 25MM SELLOFFICE'
    },
    {
      title: "GOMA DE MIGA 20 SOFT X 1UN PROARTE"
    },
    {
      title: "APRETADORES DOBLE CLIP 51MM X 12UN TORRE"
    },
    {
      title: "APRETADORES CLIPS DOBLES 32MM X 12UN ADIX"
    },
    {
      title: "CORCHETES 26/6 X 5000UN ISOFIT"
    },
    {
      title: "CORCHETES 26/6 X 5000UN NOVUS"
    },
    {
      title: "PORTA CLIPS CUADRADO NEGRO X 1UN SELLOFFICE"
    },
    {
      title: "DISPENSADOR NALCLIPS + 10 RECARGAS 48MM X 1UN SELLOFFICE"
    },
    {
      title: "SACACORCHETES METALICO X 1UN HAND OFFICE"
    },
    {
      title: "SACACORCHETES METALICO X 1UN BESTHAND QUALITY"
    },
    {
      title: "SACACORCHETES METALICO PALANCA X 1UN FULTONS"
    },
    {
      title: "REPUESTOS NALCLIP 48MM X 50UN SELLOFFICE"
    },
    {
      title: "CORCHETERA METALICA MEDIANA 20H NEGRA X 1UN ADIX"
    },
    {
      title: "CORCHETERA STAPLER CM-50 85MM X 1 UN ISOFIT"
    },
    {
      title: "CORCHETERA STAPLER CM-20 55MM X 1 UN ISOFIT"
    },
    {
      title: "CLIPS PUNTA REDONDA 33MM X 100UN TORRE"
    },
    {
      title: "PERFORADORA PUNCH PM-30 X 1UN ISOFIT"
    },
    {
      title: "PERFORADORA PUNCH PM-40 X 1UN ISOFIT"
    },
    {
      title: "CUBO DE NOTAS POST-IT 400 HOJAS 76X76MM X 1UN STICH&WRITE"
    },
    {
      title: "MARCADOR DE PAGINA CON REGLA 200 HOJAS X 1UN STICH & WRITE"
    },
    {
      title: "PEGAMENTO EN BARRA STICK 36GRS X 1UN PROARTE"
    },
    {
      title: "PEGAMENTO EN BARRA GLUE STICK 36GRS X 1UN MONAMI"
    },
    {
      title: "PEGAMENTO EN BARRA PELIFIX STICK 10GRS X 1UN PELIKAN"
    },
    {
      title: "LAPICERA ROJA 1,0MM MEDIANA BIC X 1UN"
    },
    {
      title: "LAPICERA ROJA 1,0MM FULTONS X 1UN"
    },
    {
      title: "LAPICERA NEGRA 1,0MM MEDIANA BIC X 1UN"
    },
    {
      title: "PORTAMINAS 5000 0,7 X 1UN ISOFIT"
    },
    {
      title: "PORTAMINAS H-185 0,5MM X 1UN PILOT"
    },
    {
      title: "PORTAMINAS 0,7MM X 1UN MONAMI"
    },
    {
      title: "PORTAMINAS AX105 1,5MM X 1UN PENTEL"
    },
    {
      title: "MASKING CINTA 24X40MMX 1UN SELLOCINTA"
    },
    {
      title: "MASKING CINTA 48X40MM X 1UN USATAPE"
    },
    {
      title: "MINAS DE REPUESTO 0,7MM X 1UN PENTEL"
    },
    {
      title: "MINAS DE REPUESTO 0,5MM X 1UN FABER-CASTELL"
    },
    {
      title: "MINAS DE REPUESTO 0,5MM X 1UN ISOFIT"
    },
    {
      title: "MINAS DE REPUESTO 0,7MM X 1UN ISOFIT"
    },
    {
      title: "LAPIZ GRAFITO CON GOMA HB2 X 1UN BIC"
    },
    {
      title: "LAPICERA DE GEL ROJA 0,7 X 1 UN PILOT"
    },
    {
      title: "PLUMON PIZARRA BLANCA 2,0MM NEGRO X 1UN ARTLINE 500"
    },
    {
      title: "PLUMON PIZARRA BLANCA 2,0MM ROJO X 1UN ARTLINE 500"
    },
    {
      title: "PLUMON PIZARRA BLANCA 2,0MM AZUL X 1UN ARTLINE 500"
    },
    {
      title: "PLUMON PIZARRA BLANCA S70 AZUL X 1UN ARTEL"
    },
    {
      title: "PLUMON PIZARRA BLANCA S70 ROJO X 1UN ARTEL"
    },
    {
      title: "PLUMON PIZARRA BLANCA S70 NEGRO X 1UN ARTEL"
    },
    {
      title: "PLUMON PERMANENTE INDUSTRIAL PROPAINT MARKER AZUL X 1UN MONAMI"
    },
    {
      title: "PLUMON PERMANENTE INDUSTRIAL PROPAINT MARKER NEGRO X 1UN MONAMI"
    },
    {
      title: "PLUMON PIZARRA AZUL X 1UN PROARTE"
    },
    {
      title: "PLUMON PIZARRA NEGRO X 1UN PROARTE"
    },
    {
      title: "PLUMON PERMANENTE NEGRO X 1UN PROARTE"
    },
    {
      title: "PLUMON PERMANENTE AZUL X 1UN PROARTE"
    },
    {
      title: "PLUMON COLOR MORADO PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR NARANJO PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR CAFÉ PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR NEGRO PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR ROJO PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR AZUL PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR VERDE PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON COLOR AMARILLO PERMANENTE PUNTA FINA X 1UN PILOT"
    },
    {
      title: "PLUMON PIZARRA BLANCA MEDIANO NEGRO X 1UN PILOT"
    },
    {
      title: "PLUMON PIZARRA BLANCA MEDIANO ROJO X 1UN PILOT"
    },
    {
      title: "PLUMON PIZARRA BLANCA MEDIANO AZUL X 1UN PILOT"
    },
    {
      title: "LAPIZ GRAFITO N2HB X 1UN PROARTE"
    },
    {
      title: "PLUMON PERMANENTE PUNTA FINA ROJO X 1UN SHARPIE"
    },
    {
      title: "PLUMON PERMANENTE PUNTA FINA VERDE X 1UN SHARPIE"
    },
    {
      title: "PLUMON PERMANENTE PUNTA FINA AZUL X 1UN SHARPIE"
    },
    {
      title: "PORTAMINAS 0,5MM X 1UN ART ATTACK"
    },
    {
      title: "DESTACADOR AMARILLO X 1UN ISOFIT"
    },
    {
      title: "DESTACADOR AMARILLO X 1UN TRATTO VIDEO"
    },
    {
      title: "DESTACADOR ROSADO X 1UN ISOFIT"
    },
    {
      title: "PLUMON PERMANENTE PUNTA GRUESA SCA-6600 AZUL X 1UN PILOT"
    },
    {
      title: "DEDOS DE GOMA X 1UN ADIX"
    },
    {
      title: "PLUMON DESTACADOR FLUORECENTE ROSADO X 1UN PILOT"
    },
    {
      title: "CINTA TEFLON 3/4 X 0,075MM"
    },
    {
      title: "GRASA SILICONADA NET. 5G X 1UN"
    },
    {
      title: "TIJERA 21CM MANO DERECHA X 1UN AHLE"
    },
    {
      title: "CARTONERO ROJO SIN HOJA X 1UN STANLEY"
    },
    {
      title: "TIJERA 22,9CM X 1UN RHEIN"
    },
    {
      title: "VIDRIO MIC 500 X 1UN BOSCH"
    },
    {
      title: "VIDRIO CUADRADO 11X10CM X 1UN SIN MARCA"
    },
    {
      title: "SOBRE PAPEL BLANCO 15X12CM X 1UN SIN MARCA"
    },
    {
      title: "TIJERA 19CM X 1UN ISOFIT"
    },
    {
      title: "CUADERNO UNIVERSITARIO MATEMATICA 7MM 100H.X 1UN COLON"
    },
    {
      title: "LIBRO ASISTENCIA TRABAJADOR 100 HOJAS X 1UN RHEIN"
    },
    {
      title: "ARCHIVADOR OFICIO/A4/CARTA X 1UN DIMERC OFFICE"
    },
    {
      title: "RESMA OFICIO 500 HOJAS 216X330MM X 1UN REPORT"
    },
    {
      title: "RESMA OFICIO 500 HOJAS 216X330MM X 1UN CHAMEX"
    },
    {
      title: "RESMA A3 500 HOJAS 297X420MM X 1UN CHAMEX "
    },
    {
      title: "RESMA CARTA 500 HOJAS 216279MM X 1UN EQUALIT"
    },
    {
      title: "RESMA OFICIO 500 HOJAS 216X330MM X 1UN EQUALIT"
    },
    {
      title: "SEPARADORES OFICIO SIN MARCA X 1UN"
    },
    {
      title: "SEPARADORES CARTA 6UN X 1UN RHEIN"
    },
    {
      title: "SEPARADORES CARTA BLANCO X 1UN DIMERC"
    },
    {
      title: "SACO UNIVERSAL X 1UN SIN MARCA"
    },
    {
      title: "FUNDAS OFICIO X 1UN ADIX"
    },
    {
      title: "FUNDA OFICIO X 1UN SIN MARCA"
    },
    {
      title: "SOBRE AMERICANO K-70 PAPEL KRAFT X 1UN IN MARCA"
    },
    {
      title: "SOBRE OFICIO BLANCO X 1UN SIN MARCA"
    },
    {
      title: "SOBRE CARTA BLANCO X 1UN SIN MARCA"
    },
    {
      title: "SOBRE A4 BLANCO X 1UN SIN MARCA"
    },
    {
      title: "SOBRE PEQUEÑO BLANCO X 1UN SIN MARCA"
    },
    {
      title: "CORCHETERA METALICA MEDIANA X 1UN RHEIN"
    },
    {
      title: "NOTAS ADHESIVAS BANDERA 125UN 12X45MM X 1UN EL LUCERO"
    },
    {
      title: "ARCHIVADOR 6CM 350 HOJAS X 1UN OFFICE NUOVO"
    },
    {
      title: "CARGADOR Y PILAS RECARGABLES AA X 1UN PHILCO"
    },
    {
      title: "SEPARADORES OFICIO 33X23CM X 1UN OFFICE NUOVO"
    },
    {
      title: "PILAS DURACELL AA RECARGABLE 4UN X 1UN "
    },
    {
      title: "PILAS AAA 4UN PACK X 1UN PANASONIC"
    },
    {
      title: "LAPICERA BIC AZUL X 1UN BIC"
    },
    {
      title: "LAPICERA NEGRA X 1UN PAPERMATE"
    },
    {
      title: "POSIT X 1UN DELI"
    },
    {
      title: "ARCHIVADOR CARTA 2 ANILLOS X 1UN ISOFIT"
    },
    {
      title: "PDU RACKEABLR 12 ENCHUFES 10A CON INTERRUPTOR X 1UN SIN MARCA"
    }
  ];