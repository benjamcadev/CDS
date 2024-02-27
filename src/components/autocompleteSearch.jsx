import { useState, useEffect, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';


import { options as topFilms } from '../helpers/options';
import { Details } from '@mui/icons-material';

function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}


export default function AutocompleteSearch({ id, rows, setRows }) {


    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState({});

    const loading = open && options.length === 0;


    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
                setOptions([...topFilms]);
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
            onInputChange={(e, newValue) => {
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
              }}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    fullWidth
                    {...params}

                    onKeyDown={(e) => {
                        e.key === " " && e.stopPropagation();
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


