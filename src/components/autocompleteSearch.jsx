import { useState, useEffect, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import axios from 'axios'


import { options as topFilms } from '../helpers/options';
import { VerticalAlignBottom } from '@mui/icons-material';


function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}


export default function AutocompleteSearch({ id, rows, setRows,bodegasId, setBodegasId, bodegasMaterial, setBodegasMaterial, alert, setAlert }) {


    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState({});
    
  

    const loading = open && options.length === 0;

    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json" 
       }
       

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
               
                setOptions([]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);



    return (
        <Autocomplete
            id="asynchronous-demo"
           
            freeSolo
            fullWidth
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
              
            }}
            onChange={(e,value) => {
                if(value)
                {setBodegasId([value.id])}
               
            }}
           
            onInputChange={async (e, newValue) => {
                
                // setInputValue((old) => [...old, newValue]);
                setInputValue((old) => {
                  return {
                    ...old,
                    [id]: newValue,
                  };
                });
                // [...selectedRowIds, clickedRowId]
                let newArr = [...rows];
                let obj = newArr.find(o => o.id === id);
                obj.descripcion = newValue
                setRows(newArr)

                

                //ACA INVOQUEMOS EL ENDPOINT
               
                   let bodyContent = JSON.stringify({
                     "search_value": newValue
                   });
                   
                   let reqOptions = {
                     url: "http://186.64.113.208:3000/materiales/find",
                     method: "POST",
                     headers: headersList,
                     data: bodyContent,
                   }
                   
                   let response = await axios.request(reqOptions)
                   .catch(function (error) {
                    if (error.response.status == 404) {
                       // console.log(error.response.data)
                        setAlert({...alert, estado: true, mensaje: error.response.data.message , tipo: 'error', titulo: 'Error'})
                    }
                    console.log(error);
                  });

                  if (response.status == 200) {setOptions(response.data)}
                
                
                   

              }}
            isOptionEqualToValue={(option, value) => 
            {
                
                option.Descripcion === value.Descripcion
            }
            }
            getOptionLabel={(option) => {
               
               
               if(option.Codigo_SAP){return option.Descripcion + ' ' + option.Codigo_SAP}
               if(option.SKU){return  option.Descripcion + ' ' + option.SKU}

              

               return  option.Descripcion 
            } 

            
                
             }
            options={options}
            loading={loading}
            
           
            renderOption={(props, option) => (
                
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>

                  {option.Descripcion} - {option.Codigo_SAP} - (Cantidad: {option.Stock}) 
                </Box>
              )}

            renderInput={(params) => (
                <TextField
                
                    fullWidth
                    {...params}

                    onKeyDown={(e) => {
                        e.key === " " && e.stopPropagation();
                      }}
                    onBlur={async (e) => {
                       
                        //ENDPOINT BUSCAR BODEGAS DEL MATERIAL
                        let reqOptions = {
                            url: "http://186.64.113.208:3000/bodegas/find/"+bodegasId[0],
                            method: "GET",
                            headers: headersList,
                          }

                          
                          let response = await axios.request(reqOptions);
                          setBodegasMaterial(response.data)
                          
                    }}  
                      
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
        />
    )

}


