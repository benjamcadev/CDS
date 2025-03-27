//COMPONENTES DE MATERIAL UI
import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

//IMPORTANDO COMPONENTE DE AUTOCOMPLETE COLUMNA DESCRIPCION EN DATAGRID
import AutocompleteSearch from './autocompleteSearch'


//COMPONENTE DE MATERIAL UI DATE TABLE
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons, GridEditInputCell, renderEditInputCell } from '@mui/x-data-grid';


export default function TablaCotizacion() {

    const [datosCotizacion, setDatosCotizacion] = useState({
        fecha: "",
        descripcion: "",
        ceco: "",
        observaciones: "",
        detalle: ""
    })

    //STATE DE LA TABLA
    const initialRows = [];
    const [rows, setRows] = useState(initialRows);

    //STATES PARA EL AUTOCOMPLETE
    const [bodegasId, setBodegasId] = useState([]);
    const [bodegasMaterial, setBodegasMaterial] = useState([])

    //STATE DE ALERT SNACKBAR
    const [alert, setAlert] = useState({
        estado: false,
        mensaje: 'Mensaje de prueba',
        titulo: '',
        detalle_tipo: '',
        time: null,
        responseReturn: false,
        value: ''
    });

    //USEEFFECT PARA IR GRABANDO MODIFICACIONES DE LA TABLA 
      useEffect(() => {
        setDatosCotizacion({ ...datosCotizacion, detalle: rows })
      }, [rows])


      function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;


        const handleClick = () => {
            const id = getLastId();
            setRows((oldRows) => [...oldRows, { id, item: id, descripcion: '', unidad: '', cantidad: '', precio: '', precioTotal: '', codigo: '', isNew: true }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
        };

        return (
            <GridToolbarContainer className="mt-3">
                <Button size="small" variant='contained' color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Agregar Material
                </Button>
            </GridToolbarContainer>
        );
    }

    const [rowModesModel, setRowModesModel] = useState({});


    const getLastId = () => {

        let lastId = 0
        for (let i = 0; i < rows.length; i++) {
            lastId = rows[i].id;

        }
        return lastId + 1
    }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    
    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    };

    
    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };


    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        
        //if (newRow.cantidad <= 0) { newRow.cantidad = 1 }
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
    };
    
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    //COLUMNAS
    const columns = [
        {
            field: 'item',
            headerName: 'Item',
            headerAlign: 'left',
            type: 'number',
            flex: 0.1,

        },
        {
            field: 'descripcion',
            headerName: 'Descripcion',
            headerAlign: 'left',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
                return (
                    <AutocompleteSearch
                        id={params.id}
                        rows={rows}
                        setRows={setRows}
                        bodegasId={bodegasId}
                        setBodegasId={setBodegasId}
                        bodegasMaterial={bodegasMaterial}
                        setBodegasMaterial={setBodegasMaterial}
                        alert={alert}
                        setAlert={setAlert}
                    />
                )
            },

        },
        {
            field: 'unidad',
            headerName: 'Unidad',
            headerAlign: 'left',
            editable: true,
            flex: 0.4,
            minWidth: 120,
            type: 'singleSelect',
            valueOptions: ["Unidad", "Paquete"],
        },
        {
            field: 'cantidad',
            headerName: 'Cantidad',
            headerAlign: 'left',
            editable: true,
            flex: 0.3,
            minWidth: 130,
            type: 'number',

            renderCell: (params) => {

                return (
                    (params.value <= 0) ? 1 : params.value
                )

            }
        },
        {
            field: 'precio',
            headerName: 'Precio Unitario',
            headerAlign: 'left',
            align: 'right',
            editable: true,
            flex: 1,
            minWidth: 130,
            type: 'string',

            renderCell: (params) => {
                
                return ( 
                    params.value
                )
            }

            
        },
        {
            field: 'precioTotal',
            headerName: 'Precio Total',
            headerAlign: 'left',
            align: 'right',
            editable: false,
            flex: 0.3,
            minWidth: 130,
            

            renderCell: (params) => {

                let valuePrecioTotal = params.row.precioUnitario * params.row.cantidad;
                let newArr = [...rows];
                let obj = newArr.find(o => o.id === params.id);
                obj.precioTotal = valuePrecioTotal;
                
               
                return ( 
                    valuePrecioTotal    
                )

            }
        },
        {
            field: 'codigo',
            headerName: 'Codigo SAP',
            headerAlign: 'left',
            align: 'right',
            type: "string",
            editable: false,
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
              
                return ( 
                    params.value   
                )
            }

        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            headerAlign: 'left',
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,

                    ];
                }

                return [

                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },


    ]

    const handleSubmit = (e) => {
        e.preventDefault();
    }


    return (
        <div className="bg-white shadow-md rounded-md py-5 px-5 ">
            <form className="" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">

                    <div className="mb-5">
                        <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Descripcion del Trabajo</label>
                        <TextField
                            id="descripcion"
                            size="normal"
                            value={datosCotizacion.descripcion}
                            fullWidth
                            multiline
                            onChange={(e) => setDatosCotizacion({ ...datosCotizacion, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 uppercase font-bold" htmlFor="descripcion">Observaciones</label>
                        <TextField
                            id="observaciones"
                            size="normal"
                            value={datosCotizacion.observaciones}
                            fullWidth
                            multiline
                            onChange={(e) => setDatosCotizacion({ ...datosCotizacion, observaciones: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">

                        <div className="mb-5">
                            <label className="block text-gray-700 uppercase font-bold" htmlFor="codelcoSolicitante">CECO</label>
                            <TextField
                                id="ceco"
                                size="normal"
                                fullWidth
                                variant="outlined"
                                value={datosCotizacion.ceco}
                                onChange={(e) => setDatos({ ...datosCotizacion, solCodelco: e.target.value })} />
                        </div>
                    </div>

                </div>


                <div className="grid gap-4 mt-10 mb-10 grid-cols-1" >
                    <div className="mb-5">
                        <div className='' style={{ height: 600, width: "100%" }}>
                            <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Listado de Materiales</label>

                            <DataGrid
                                rows={rows}
                                columns={columns}
                                editMode="row"
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={handleRowModesModelChange}
                                onRowEditStop={handleRowEditStop}
                                processRowUpdate={processRowUpdate}
                                slots={{
                                    toolbar: EditToolbar,
                                }}
                                slotProps={{
                                    toolbar: { setRows, setRowModesModel },
                                }}
                                localeText={{ noRowsLabel: "No hay materiales agregados" }}
                            />
                        </div>

                    </div>

                </div>



                <input
                    type="submit"
                    className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
                    value={'cerrar vale'}
                />


            </form>
        </div>
    );
}