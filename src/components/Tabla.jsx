import React, { useState } from 'react'

//IMPORTANDO ESTILOS MATERIAL UI
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


//IMPORTANDO COMPONENTE DE AUTOCOMPLETE COLUMNA DESCRIPCION EN DATAGRID
import AutocompleteSearch from './autocompleteSearch'


//COMPONENTE DE MATERIAL UI DATE TABLE
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons, } from '@mui/x-data-grid';


export default function Tabla({ rows, setRows, bodegas }) {


    const [bodegasId, setBodegasId] = useState([]);
    const [bodegasMaterial, setBodegasMaterial] = useState([])


    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;



        const handleClick = () => {
            const id = getLastId();
            setRows((oldRows) => [...oldRows, { id, item: id, unidad: '', descripcion: '', cantidad: '', bodega: '', isNew: true }]);
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



    //-------------------------------- DATA GRID  -------------------------------------//





    const [rowModesModel, setRowModesModel] = React.useState({});


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
            headerAlign: 'left',
            editable: true,
            flex: 0.4,
            minWidth: 120,
            type: 'singleSelect',
            valueOptions: ["Unidad", "Paquete"],
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
                        setRows={setRows}
                        rows={rows}
                        bodegasId={bodegasId}
                        setBodegasId={setBodegasId}
                        bodegasMaterial={bodegasMaterial}
                        setBodegasMaterial={setBodegasMaterial}
                    />
                )
            },

        },
        {
            field: 'cantidad',
            headerName: 'Cantidad',
            headerAlign: 'left',
            editable: true,
            flex: 0.3,
            minWidth: 130,
            type: 'number',
        },
        {
            field: 'bodega',
            headerName: 'Bodega',
            headerAlign: 'left',
            flex: 0.5,
            minWidth: 150,

            renderCell: (params) => {
                return (

                    <Select
                        sx={{ minWidth: 230 }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={''}
                        renderValue={(value) => {
                            return bodegas.map((option) => {
                                if (option.idbodegas == value) {
                                    return option.nombre
                                }
                            })
                        }}
                        onChange={(e) => {
                            let newArr = [...rows];
                            let obj = newArr.find(o => o.id === params.id);
                            obj.bodega = e.target.value
                            setRows(newArr)

                        }}
                    >

                        {bodegasMaterial.map(function (option, key) {
                            return (
                                <MenuItem sx={{ minWidth: 150 }} key={key} value={option.bodegas_idbodegas}>{option.nombreBodega} - Cantidad: {option.cantidad} </MenuItem>
                            )
                        })}


                    </Select>


                )
            },
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
    ];








    // -------------------------------- FIN DATA GRID   ---------------------------------//


    return (
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
    )
}
