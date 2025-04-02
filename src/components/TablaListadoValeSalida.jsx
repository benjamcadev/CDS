import { useState, useEffect } from 'react'

//LIBRERIA PARA HACER FETCH
import axios from '../helpers/axios'

import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function TablaListadoValeSalida() {

    //USESTATE PARA GUARDAR INFO DE LA TABLA
    const [valesSalidas, setValesSalidas] = useState([])

    //carga de data del endpoint

    useEffect(() => {

        async function fetchValesSalidas() {
            try {
                const response = await axios.post('/ticket/salida/list/', { withCredentials: true });

                // Convertir cada fecha en el array y reemplazar la fecha original con la formateada
                const responseActualizado = response.data.map(item => {
                    const fechaFormateada = dayjs(item.fecha_creacion).format('DD/MM/YYYY HH:mm:ss');
                    return {
                        ...item,  // Copiar las demás propiedades del objeto
                        fecha_creacion: fechaFormateada, // Reemplazar la fecha original por la formateada
                    };
                });

                setValesSalidas(responseActualizado)


            } catch (error) {
                console.error('Hubo un error fetch cotizaciones: ' + error);
            }
        }

        fetchValesSalidas()

    }, [])


    // Datos de ejemplo para las filas del DataGrid
    const rows = valesSalidas

    const columns = [
        { field: 'id', headerName: 'N° Ticket', flex: 0.2, },
        { field: 'motivo', headerName: 'Descripción', flex: 1, minWidth: 200, },
        { field: 'solicitante', headerName: 'Solicitante', flex: 0.4 },
        { field: 'nombre', headerName: 'Responsable', flex: 0.4 },
        { field: 'fecha_creacion', headerName: 'Fecha', flex: 0.4 },
        {
            field: 'estado_ticket_idestado_ticket',
            headerName: 'Estado',
            flex: 0.3,
            renderCell: (params) => {

                return (
                    params.row.estado_ticket_idestado_ticket == 1 ?
                        <Button variant="outlined" color="error" size="small">
                            Abierto
                        </Button> :

                        <Button variant="outlined" color="success" size="small">
                            Cerrado
                        </Button>

                );
            }
        },
        {
            field: 'descargar',
            headerName: 'Descargar',
            flex: 0.2,
            renderCell: (params) => {
                const handleDownload = async () => {
                    //traer el excel en base64
                    try {

                        const response = await axios.post('/ticket/salida/get', { pdf_path: params.row.pdf_path }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });


                        const link = document.createElement('a');
                        link.href = 'data:application/pdf;base64,' + response.data.base64;  // Obtiene el archivo base64
                        link.download = `${params.row.id} - ${params.row.descripcion}.pdf`; // Nombre del archivo
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

    ]

    return (
        <div className="bg-white shadow-md rounded-md py-5 px-5 ">
            <div className="grid gap-4 mt-10 mb-10 grid-cols-1" >
                <div className="mb-5">
                    <div className='' style={{ height: 600, width: "100%" }}>
                        <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Listado de Vales de Salida</label>
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