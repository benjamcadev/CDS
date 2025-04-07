import CharBar from '../UI/ChartBar'
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import axios from '../../helpers/axios'
import { Fragment, useEffect, useState } from 'react';



export default function ChartMaterialSalida() {

    const [series, setSeries] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {

        async function fetchMaterialTopSalida() {
            try {
                const response = await axios.get('materiales/topsalida', { withCredentials: true });
                
                console.log(response)
                setSeries(response.data.cantidad)
                setCategories(response.data.nombre)

            } catch (error) {
                console.error('Hubo un error fetch materiales top: ' + error);
            }
        }

        fetchMaterialTopSalida()

    }, [])

    return (
        <Fragment>

            <Grid lg={12} xs={12}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader title="Top Materiales con Mayor Salida" />

                    <CardContent>
                        <CharBar 
                        sx={{ height: '100%' }} 
                        series= {series}
                        categories= {categories}
                        />
                    </CardContent>

                </Card>

            </Grid>

        </Fragment>
    )
}