
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; // Ícono de Ticket
import ErrorIcon from '@mui/icons-material/Error';
import { green } from '@mui/material/colors';
import { useLocation } from 'react-router-dom';





export const Mensajes = () => {

    const { state } = useLocation();
    let mensaje = '';
    let titulo = '';
    let icono = '';
   

    if (state) {
        
        mensaje = state.mensaje
        titulo = state.titulo
        icono = state.icono
    }else{
        console.log('no vienen props')
    }

    

    return (
        <div className="container mx-auto mt-5">
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 3 }}>
                {/* Icono de ticket verde */}
                {icono == 'success' ? <CheckIcon sx={{ fontSize: 180, color: green[500], marginBottom: 2 }} /> : <ErrorIcon/>}
                

                {/* Título: Ticket Firmado */}
                <Typography variant="h4" component="div" color="text.primary" sx={{ marginBottom: 1 }}>
                    {titulo != '' ? titulo : 'Error'}
                </Typography>

                {/* Texto pequeño de ejemplo */}
                <Typography variant="body2" color="text.secondary">
                    {mensaje != '' ? mensaje : ''}
                </Typography>
            </Card>
        </div>

    )
}

