import { TextField, Button, Box, Paper, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import axios from '../../helpers/axios'
import React, { useState, useEffect } from 'react';


export const TableKardex = ({ article, onClose, onUpdate, onDelete }) => {

    console.log(article)

    const [dataKardex, setDataKardex] = useState({
        bodega: '',
        cantidad: 0,
        fecha: '',
        idticket: '',
        tipo_movimiento: ''
    })

    useEffect(() => {

        async function fetchKardex() {
            try {
                const response = await axios.get(`/materiales/kardex/${article.id}`);
               
                setDataKardex(response.data)

                console.log(response.data)
            } catch (error) {
                console.error('Error al obtener el stock por bodega:', error);

            }
        }

        fetchKardex()

    }, []);

    return (
        <Box component="form" sx={{ mt: 0.1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mt: 0.2 }}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Fecha</TableCell>
                                    <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Tipo Movimiento</TableCell>
                                    <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Cantidad</TableCell>
                                    <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>N° Ticket</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataKardex && dataKardex.map && dataKardex.map((row) => {

                                    return (
                                        <TableRow hover key={row.idticket}>
                                            <TableCell>{row.fecha}</TableCell>
                                            <TableCell>{row.tipo_movimiento}</TableCell>
                                            <TableCell>{row.cantidad}</TableCell>
                                            <TableCell>{row.idticket}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    )

}

export default TableKardex;