
import React from 'react';
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import dayjs from 'dayjs';

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

                // Convertir cada fecha en el array y reemplazar la fecha original con la formateada
                const respondeActualizado = response.data.map(item => {
                    const fechaFormateada = dayjs(item.fecha).format('DD/MM/YYYY HH:mm:ss');
                    return {
                        ...item,  // Copiar las demás propiedades del objeto
                        fecha: fechaFormateada, // Reemplazar la fecha original por la formateada
                    };
                });

                setCotizaciones(respondeActualizado)
            } catch (error) {
                console.error('Hubo un error fetch cotizaciones: ' + error);
            }
        }

        fetchCotizaciones()

    }, [])

    // Datos de ejemplo para las filas del DataGrid
    const rows = cotizaciones

    // Definición de las columnas
    const columns = [
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 200, },
        { field: 'fecha', headerName: 'Fecha', flex: 0.4 },
        { field: 'usuario', headerName: 'Usuario', flex: 0.3 },
        {
            field: 'descargar',
            headerName: 'Descargar',
            flex: 0.2,
            renderCell: (params) => {
                const handleDownload = async () => {
                    //traer el excel en base64
                    try {

                        const response = await axios.post('/cotizacion/get', { path_excel: params.row.path_excel }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });

                        console.log(response)
                        const link = document.createElement('a');
                        link.href = 'data:application/vnd.ms-excel;base64,' + response.data.base64;  // Obtiene el archivo base64
                        link.download = `${params.row.descripcion}.xlsx`; // Nombre del archivo
                        link.click();

                        
                    } catch (error) {
                        console.error('Hubo un error al traer cotizacion excel: ' + error);
                    }
                    
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