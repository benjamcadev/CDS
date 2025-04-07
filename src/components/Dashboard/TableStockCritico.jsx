
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { Fragment, useState, useEffect } from 'react';

export default function TableStockCritico() {

    const [materialesStockCritico, setMaterialesStockCritico] = useState([])


    useEffect(() => {

        async function fetchStockCritico() {
            try {
                /*const response = await axios.get('bodegas/', { withCredentials: true });
                setBodegas(response.data)*/

                setMaterialesStockCritico([
                    {
                        id: 500,
                        nombre: 'CINTA ADHESIVA GRIS 48MM X 27M ',
                        sap: '9032533',
                        cantidad_actual: 5,
                        stock_minimo: 20
                    }
                ])

            } catch (error) {
                console.error('Hubo un error fetch stock critico: ' + error);
            }
        }

        fetchStockCritico()

    }, [])

    return (
        <Fragment>

            <Grid lg={12} xs={12}>

                <Card sx={{ height: '100%' }}>
                    <CardHeader title="Materiales con Stock Critico" />
                    <CardContent>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader sx={{ minWidth: 800 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Material</TableCell>
                                                <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>SAP</TableCell>
                                                <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Cantidad Actual</TableCell>
                                                <TableCell style={{ backgroundColor: '#303f9f', color: 'white', fontSize: '18px' }}>Stock Minimo</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {materialesStockCritico.map((material) => {

                                                return (
                                                    <TableRow hover key={material.id}>
                                                        <TableCell>{material.nombre}</TableCell>
                                                        <TableCell>{material.sap}</TableCell>
                                                        <TableCell>{material.cantidad_actual}</TableCell>
                                                        <TableCell>{material.stock_minimo}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Fragment>
    )
}