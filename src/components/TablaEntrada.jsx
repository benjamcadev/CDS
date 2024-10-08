import  { useState } from 'react'
//IMPORTANDO COMPONENTE DE AUTOCOMPLETE COLUMNA DESCRIPCION EN DATAGRID
import AutocompleteSearch from './autocompleteSearch'

//IMPORTANDO ESTILOS MATERIAL UI
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

//COMPONENTE DE MATERIAL UI DATE TABLE
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import { Alert, Autocomplete, TextField } from '@mui/material';


export default function TablaEntrada({ rows, setRows, datos, bodegas, ubicaciones, alert, setAlert, idTicket }) {

    const [bodegasId, setBodegasId] = useState([]);
    const [bodegasMaterial, setBodegasMaterial] = useState([])
    //const [showAlert, setShowAlert] = useState(false);

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            if (rows.length >= 20) {
                MySwal.fire({
                    title: "Límite alcanzado",
                    text: "No se pueden agregar más de 20 artículos.",
                    icon: "warning",
                    confirmButtonColor: '#3085d6',
                    
                }).then(() => {
                    // Aquí se puede agregar alguna lógica si es necesario después de mostrar la alerta
                });
                return;
            }

            const id = getLastId();
            setRows((oldRows) => [
                ...oldRows,
                { id, item: id, unidad: '', descripcion: '', cantidad: '', bodega: '', ubicacion: '', reserva: '', idArticulo: '', isNew: true },
            ]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
        };


        return (
            <GridToolbarContainer className="mt-3">
                <Button
                    size="small"
                    variant='contained'
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleClick}
                    disabled={rows.length >= 21}
                >
                    Agregar Material
                </Button>
                
            </GridToolbarContainer>
        );
    }


    //-------------------------------- DATA GRID  -------------------------------------//

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
        if(newRow.cantidad <= 0) {newRow.cantidad = 1 } 
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'item',
            headerName: 'Item',
            headerAlign: 'left',
            type: 'number',
            flex: 0.1,
        },
        {
            field: 'unidad',
            headerName: 'Unidad',
            headerAlign: 'center',
            editable: true,
            flex: 0.4,
            minWidth: 120,
            type: 'singleSelect',
            valueOptions: ["Unidad", "Paquete"],
        },
        {
            field: 'descripcion',
            headerName: 'Descripcion',
            headerAlign: 'center',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <AutocompleteSearch
                    id={params.id}
                    setRows={setRows}
                    rows={rows}
                    bodegasId={bodegasId}
                    setBodegasId={setBodegasId}
                    bodegasMaterial={bodegasMaterial}
                    setBodegasMaterial={setBodegasMaterial}
                    alert={alert}
                    setAlert={setAlert}
                />
            ),
        },
        {
            field: 'cantidad',
            headerName: 'Cantidad',
            headerAlign: 'center',
            editable: true,
            flex: 0.3,
            minWidth: 130,
            type: 'number',
            renderCell: (params) => (params.value <= 0 ? 1 : params.value),
        },
        {
            field: 'bodega',
            headerName: 'Bodega',
            headerAlign: 'center',
            flex: 0.5,
            minWidth: 190,
            renderCell: (params) => (
                <Autocomplete
                    fullWidth
                    options={bodegas}
                    getOptionLabel={(option) => option.nombre || ''}
                    value={bodegas.find((bodega) => bodega.idbodegas === params.row.bodega) || null}
                    onChange={(event, newValue) => {
                        let newArr = [...rows];
                        let obj = newArr.find(o => o.id === params.id);
                        obj.bodega = newValue ? newValue.idbodegas : '';
                        setRows(newArr);
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params} label="Selecciona una bodega" variant="outlined" 
                            inputProps={{ ...params.inputProps, readOnly: true }}
                        />)}
                    isOptionEqualToValue={(option, value) => option.idbodegas === value.idbodegas}
                />
            ),
        },
        {
            field: 'ubicacion',
            headerName: 'Ubicacion',
            headerAlign: 'center',
            flex: 0.5,
            minWidth: 190,
            renderCell: (cellParams) => (
                <Autocomplete
                    fullWidth
                    options={ubicaciones}
                    getOptionLabel={(option) => option.ubicacion || 'No ubicacion'}
                    value={ubicaciones.find((ubicacion) => ubicacion.id_ubicacion_bodegas === cellParams.row.ubicacion) || null}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            let newArr = [...rows];
                            let obj = newArr.find((o) => o.id === cellParams.id);
                            if (obj) {
                                obj.ubicacion = newValue.id_ubicacion_bodegas;
                                setRows(newArr);
                            }
                        }
                    }}
                    renderInput={(inputParams) => ( 
                        <TextField 
                            {...inputParams} label="Selecciona una ubicacion" variant="outlined"
                            inputProps={{ ...inputParams.inputProps, readOnly: true }} 
                        />)}
                    isOptionEqualToValue={(option, value) => option.id_ubicacion_bodegas === value.id_ubicacion_bodegas}
                />
            ),
        },
    ];

    if (datos.tipoTicket !== 'Inventario' && datos.tipoTicket !== 'Devolucion') {
        columns.push({
            field: 'reserva',
            headerName: 'Reserva/OC',
            headerAlign: 'center',
            editable: true,
            flex: 0.4,
            minWidth: 120,
            type: 'number',
        });
    }

    columns.push({
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
    });
    
     
    
    //EN CASO DE VENIR UN NUMERO DE TICKET EN LA BARRA DE DIRECCIONES DESHABILITA LA COLUMNA ACCIONES
    if (idTicket) {
        columns.splice(5, 1)
    }

    // -------------------------------- FIN DATA GRID   ---------------------------------//

    return (
        <div className='' style={{ height: 700, width: "100%" }}>
            <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Listado De Materiales Entrada</label>

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
    )
}
