
import KpiRectangulos from '../components/Dashboard/KpiRectangulos.jsx'
import ChartMaterialSalida from '../components/Dashboard/ChartMaterialSalida.jsx'
import ChartTopMaterialSalida from '../components/Dashboard/ChartTopMaterialSalida.jsx'
import TableStockCritico from '../components/Dashboard/TableStockCritico.jsx'
import Header from '../components/Header.jsx'
import Grid from '@mui/material/Unstable_Grid2';

export default function Home() {
  return (
    <div className='container mx-auto mt-5'>
      <Header title={'CDS Sistema Control de Stock'} />

      <div className="bg-white shadow-md rounded-md py-5 px-5 ">

        <Grid container spacing={3}>

          <KpiRectangulos />
          <ChartMaterialSalida />
          <ChartTopMaterialSalida />
          <TableStockCritico />

        </Grid>



      </div>

    </div>
  )
}
