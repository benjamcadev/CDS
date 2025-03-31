import React from 'react'
import { useNavigate } from "react-router-dom"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


export default function alertSnackbar({ alert, setAlert }) {

    let navigate = useNavigate()



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, estado: false });
    };

    const handleAceptar = () => {
        //RE DIRECCIONAR AL TICKET EN LA BARRA DE DIRECCIONES
        if (alert.detalle_tipo == 'success_ticket') {
            setAlert({ ...alert, estado: false, responseReturn: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate("/vale-salida/" + alert.value)
        }

        if (alert.detalle_tipo == 'success_ticket_pendiente') {
            setAlert({ ...alert, estado: false, responseReturn: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate("/mensajes/", {
                state: { mensaje: 'Ticket firmado, ya puedes cerrar esta pagina', titulo: 'Ticket Firmado', icono: 'success' }
            })
        }

    }

    const handleDescargar = () => {
        // Decodificar base64
        const binaryData = atob(alert.value); // Decodificar el string Base64 en un array de bytes
        const byteArray = new Uint8Array(binaryData.length); // Crear un array de bytes
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i); // Llenar el array de bytes
        }

        // Crear un Blob con el tipo de archivo Excel 
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob); // Crear un objeto URL a partir del Blob

        // Crear un enlace y simular el clic para descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        link.download = alert.fileName + '.xlsx'; // Nombre del archivo que se descargará
        document.body.appendChild(link);
        link.click(); // Hacer clic en el enlace para iniciar la descarga

        // Limpiar el DOM (borrar el enlace)
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Revocar la URL
    }


    return (
        <div className="">
            <Snackbar className="mb-8" open={alert.estado} autoHideDuration={alert.time} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
                <Alert
                    onClose={handleClose}
                    severity={alert.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}

                >
                    <AlertTitle>{alert.titulo}</AlertTitle>
                    <div className="flex mt-4 font-bold justify-center items-center text-lg">  {alert.mensaje}</div>

                    {alert.detalle_tipo == 'success_cotizacion' ?
                        <div className="mt-3 flex justify-center items-center">
                            <FileDownloadIcon
                            onClick={handleDescargar}
                            />
                            <Button onClick={handleDescargar} color="inherit" size="large">
                                Descargar
                            </Button>
                        </div> : ''}

                    {alert.detalle_tipo == 'success_ticket' || alert.detalle_tipo == 'success_ticket_pendiente' ?
                        <div className="mt-3   flex justify-center items-center">
                            <Button onClick={handleAceptar} color="inherit" size="normal">
                                Aceptar
                            </Button>
                        </div> : ''}

                </Alert>
            </Snackbar>
        </div>
    )
}
