
import React from 'react';
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

//LIBRERIA PARA HACER FETCH
import axios from '../helpers/axios'


export default function TablaListadoCotizacion() {

    //use state para guardar las cotizaciones

     const [cotizaciones, setCotizaciones] = useState([])

    //USE EFFECT PARA LA CARGA DE DATA

    useEffect(() => {
    
        async function fetchCotizaciones() {
          try {
            const response = await axios.post('cotizacion/list/', { withCredentials: true });
            setCotizaciones(response.data)
          } catch (error) {
            console.error('Hubo un error fetch cotizaciones: ' + error);
          }
        }
    
        fetchCotizaciones()
    
      }, [])

    // Datos de ejemplo para las filas del DataGrid
    const rows = [
        { id: 1, descripcion: 'Archivo 1', fecha: '2025-03-31', usuario: 'Usuario A', base64: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAEpzSiFqNjzE3XGU8FtBQjOw5vHM+P9XtIfqrcdtshFhNlrluU5Elv2v5Ig3AeWQ==' },
        { id: 2, descripcion: 'Archivo 2', fecha: '2025-03-30', usuario: 'Usuario B', base64: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAEpzSiFqNjzE3XGU8FtBQjOw5vHM+P9XtIfqrcdtshFhNlrluU5Elv2v5Ig3AeWQ==' },
        // Agrega más filas según sea necesario
    ];

    // Definición de las columnas
    const columns = [
        { field: 'descripcion', headerName: 'Descripción', width: 180 },
        { field: 'fecha', headerName: 'Fecha', width: 180 },
        { field: 'usuario', headerName: 'Usuario', width: 180 },
        {
            field: 'descargar',
            headerName: 'Descargar',
            width: 150,
            renderCell: (params) => {
                const handleDownload = () => {
                    const link = document.createElement('a');
                    link.href = params.row.base64;  // Obtiene el archivo base64
                    link.download = `${params.row.descripcion}.xlsx`; // Nombre del archivo
                    link.click();
                };

                return (
                    <IconButton onClick={handleDownload} color="primary">
                        <DownloadIcon />
                    </IconButton>
                );
            },
        },
    ];

    return (
        <div className="bg-white shadow-md rounded-md py-5 px-5 ">
            <div className="grid gap-4 mt-10 mb-10 grid-cols-1" >
                <div className="mb-5">
                    <div className='' style={{ height: 600, width: "100%" }}>
                        <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Listado de Cotizaciones</label>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}