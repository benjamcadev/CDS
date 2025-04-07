
import Grid from '@mui/material/Unstable_Grid2';

import RectMateriales from './RectMateriales'
import RectValeSalida from './RectValeSalida'
import ReactValeEntrada from './RectValeEntrada'
import RectCotizacion from './RectCotizacion'
import { Fragment } from 'react';

export default function KpiRectangulos() {

    return (
        <Fragment>

            <Grid lg={3} sm={6} xs={12}>
                <RectMateriales />
            </Grid>


            <Grid lg={3} sm={6} xs={12}>
                <RectValeSalida />
            </Grid>

            <Grid lg={3} sm={6} xs={12}>
                <ReactValeEntrada />
            </Grid>

            <Grid lg={3} sm={6} xs={12}>
                <RectCotizacion />
            </Grid>
        </Fragment>












    )


}