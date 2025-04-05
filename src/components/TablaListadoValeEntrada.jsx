import { useState, useEffect } from 'react'

//LIBRERIA PARA HACER FETCH
import axios from '../helpers/axios'

import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from './alertSnackbar'

export default function TablaListadoValeEntrada() {

    //USESTATE PARA GUARDAR INFO DE LA TABLA
    const [valesEntrada, setValesEntrada] = useState([])


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

    //carga de data del endpoint

    useEffect(() => {

        async function fetchValesEntrada() {
            try {
                const response = await axios.post('/ticket/entrada/list/', { withCredentials: true });

                // Convertir cada fecha en el array y reemplazar la fecha original con la formateada
                const responseActualizado = response.data.map(item => {
                    const fechaFormateada = dayjs(item.fecha).format('DD/MM/YYYY HH:mm:ss');
                    return {
                        ...item,  // Copiar las demás propiedades del objeto
                        fecha: fechaFormateada, // Reemplazar la fecha original por la formateada
                    };
                });

                setValesEntrada(responseActualizado)


            } catch (error) {
                console.error('Hubo un error fetch vale de entrada: ' + error);
            }
        }

        fetchValesEntrada()

    }, [])


    //copiamos el state a las rows
    const rows = valesEntrada

    const columns = [
        { field: 'id', headerName: 'N° Ticket', flex: 0.2, },
        { field: 'motivo', headerName: 'Descripción', flex: 1, minWidth: 200, },
        { field: 'responsable_bodega', headerName: 'Responsable Recepción', flex: 0.4 },
        { field: 'fecha_creacion', headerName: 'Fecha', flex: 0.4 },
        {
            field: 'tipo_ticket_idtipo_ticket',
            headerName: 'Tipo Ticket',
            flex: 0.4,
            renderCell: (params) => {
                return (
                    params.row.tipo_ticket_idtipo_ticket == 1 ?
                        <Button variant="contained" color="primary" size="small">
                            Devolucion
                        </Button> :
                        (params.row.tipo_ticket_idtipo_ticket == 2 ?
                            <Button variant="contained" color="secondary" size="small">
                                Compra
                            </Button> :
                            (params.row.tipo_ticket_idtipo_ticket == 3 ?
                                <Button variant="contained" color="success" size="small">
                                    Inventario
                                </Button> : ''))
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

                        const response = await axios.post('/ticket/entrada/get', { pdf_path: params.row.pdf_path }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });

                        if (response.data.base64 == '') {
                            setAlert({
                                ...alert, estado: true, mensaje: 'No se encuentra archivo PDF', tipo: 'error', titulo: 'Error', detalle_tipo: 'error_validation', time: 8000
                            });
                            return;
                        }
                        const link = document.createElement('a');
                        link.href = 'data:application/pdf;base64,' + response.data.base64;  // Obtiene el archivo base64
                        link.download = `${params.row.id} - ${params.row.motivo}.pdf`; // Nombre del archivo
                        link.click();


                    } catch (error) {
                        console.error('Hubo un error al traer vale entrada pdf: ' + error);
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
            <Alert
                alert={alert}
                setAlert={setAlert}
            />


            <div className="grid gap-4 mt-10 mb-10 grid-cols-1" >
                <div className="mb-5">
                    <div className='' style={{ height: 600, width: "100%" }}>
                        <label className="block text-gray-700 uppercase font-bold" htmlFor="fecha">Listado de Vales de Entrada</label>
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