
import CharLine from '../UI/ChartLine'
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import axios from '../../helpers/axios'
import { Fragment, useState, useEffect } from 'react';

export default function ChartMaterialSalida() {


    const [series, setSeries] = useState([])
    const [categories, setCategories] = useState([])

    const transformData = (data) => {
        // Agrupamos los datos por categoría
        const categories = [...new Set(data.map(item => item.categoria))];
        
        // Preparamos la estructura final para las series
        const series = categories.map(categoria => {
          // Filtramos los datos para cada categoría
          const categoryData = data.filter(item => item.categoria === categoria);
          
          // Creamos un objeto con la categoría y sus correspondientes datos por mes
          const dataByMonth = categoryData.reduce((acc, { cantidad, mes }) => {
            // Aseguramos que el mes esté presente como clave
            acc[mes] = Number(cantidad);
            return acc;
          }, {});
      
          // Creamos un array de datos para esta categoría, con ceros donde no haya datos
          const months = [...new Set(data.map(item => item.mes))].sort();
          const dataForCategory = months.map(month => dataByMonth[month] || 0);
      
          return {
            name: categoria,
            data: dataForCategory
          };
        });
      
        // Retornamos las series y los meses para usarlos en el gráfico
        return {
          series,
          categories: [...new Set(data.map(item => item.mes))].sort() // Meses ordenados
        };
      };

    useEffect(() => {

        async function fetchMaterialSalidaCategorias() {
            try {
                const response = await axios.get('categorias/getChartData', { withCredentials: true });
                const { series, categories } = transformData(response.data);
                setSeries(series)
                setCategories(categories)

            } catch (error) {
                console.error('Hubo un error fetch total vales salida: ' + error);
            }
        }

        fetchMaterialSalidaCategorias()

    }, [])

    

    return (
        <Fragment>

            <Grid lg={12} xs={12}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader title="Salida de Material por Categoria" />

                    <CardContent>
                        <CharLine 
                        sx={{ height: '100%' }} 
                        categories={categories}
                        series={series}
                        />
                    </CardContent>

                </Card>

            </Grid>

        </Fragment>

    )
}