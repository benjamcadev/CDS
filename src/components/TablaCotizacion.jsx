//COMPONENTES DE MATERIAL UI
import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import { useAuth } from '../context/AuthContext';


//IMPORTANDO COMPONENTE DE AUTOCOMPLETE COLUMNA DESCRIPCION EN DATAGRID
import AutocompleteSearch from './autocompleteSearch'

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from './alertSnackbar'


//COMPONENTE DE MATERIAL UI DATE TABLE
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons, GridEditInputCell, renderEditInputCell } from '@mui/x-data-grid';

import dayjs from 'dayjs';

//LIBRERIA PARA HACER FETCH
import axios from '../helpers/axios'


export default function TablaCotizacion() {

    const { user } = useAuth();

    const [datosCotizacion, setDatosCotizacion] = useState({
        fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        descripcion: "",
        ceco: "",
        observaciones: "",
        usuario_idusuario: user.id,
        detalle: ""
    })

    //STATE DE LA TABLA
    const initialRows = [];
    const [rows, setRows] = useState(initialRows);

    //STATES PARA EL AUTOCOMPLETE
    const [bodegasId, setBodegasId] = useState([]);
    const [bodegasMaterial, setBodegasMaterial] = useState([])
    const [rowEdit, setRowEdit] = useState(false)

    //STATE DE ALERT SNACKBAR
    const [alert, setAlert] = useState({
        estado: false,
        mensaje: 'Mensaje de prueba',
        titulo: '',
        detalle_tipo: '',
        time: null,
        responseReturn: false,
        value: '',
        fileName: '',
    });

    //USEEFFECT PARA IR GRABANDO MODIFICACIONES DE LA TABLA 
    useEffect(() => {
        setDatosCotizacion({ ...datosCotizacion, detalle: rows })
    }, [rows])

    


    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;


        const handleClick = () => {
            const id = getLastId();
            setRows((oldRows) => [...oldRows, { id, item: id, descripcion: '', unidad: '', cantidad: 1, precio: 0, precioTotal: '', codigo: '', isNew: true }]);
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

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };


    const processRowUpdate = (newRow) => {
        //if (newRow.cantidad <= 0) { newRow.cantidad = 1 }
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
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
            defaultValue: 1,


        },
        {
            field: 'precio',
            headerName: 'Precio',
            headerAlign: 'left',
            align: 'right',
            flex: 0.3,
            minWidth: 130,
            editable: true,


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

                let valuePrecioTotal = params.row.precio * params.row.cantidad;
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
            getActions: ({ id }, params) => {

                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ]

            },
        },


    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        if (datosCotizacion.descripcion === '') {
            setAlert({
                ...alert, estado: true, mensaje: 'Falta completar una descripcion del trabajo', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000
            });
            return;
        }
        if (datosCotizacion.detalle.length === 0) {
            setAlert({
                ...alert, estado: true, mensaje: 'No has agregado materiales', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000
            });
            return;
        }

        // Enviar los datos
        enviarDatos();

    }

    const enviarDatos = async () => {
        const requestJson = JSON.stringify(datosCotizacion);



        //ACTIVAR MENSAJE DE ESPERA
        setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Generando Cotizacion...', detalle_tipo: '', time: null });
        //ENVIAR DATOS EN ENDPOINT
        const response = await axios.post('/cotizacion/', requestJson, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).catch((error) => {
            setAlert({ ...alert, estado: true, mensaje: `${error.message}`, tipo: 'error', titulo: `${error.code}`, detalle_tipo: '', time: null });

        })

        if (response.status == 200) {
            setAlert({ ...alert, estado: true, mensaje: `N° Cotizacion: ${response.data.idCotizacion}`, tipo: 'success', titulo: 'Cotizacion Realizada !', detalle_tipo: 'success_cotizacion', time: null, value: response.data.base64Excel, fileName: datosCotizacion.descripcion });
        }
    }


    return (
        <div className="bg-white shadow-md rounded-md py-5 px-5 ">

            <Alert
                alert={alert}
                setAlert={setAlert}
            />


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
                                onChange={(e) => setDatosCotizacion({ ...datosCotizacion, ceco: e.target.value })} />
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
                                /*editMode="row"
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={handleRowModesModelChange}
                                onRowEditStop={handleRowEditStop}*/
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
                    value={'finalizar cotizacion'}
                />


            </form>
        </div>
    );
}