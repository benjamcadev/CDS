import Header from '../components/Header.jsx'
import TablaListadoCotizacion from '../components/TablaListadoCotizacion.jsx'

export const ListadoCotizacionPage = () => {


    return (
        <div className='container mx-auto mt-5'>
             <div className='mt-4'>
             <Header title={'Listado de Cotizaciones'} />

             <TablaListadoCotizacion />
             
             </div>
           

        </div>
    )
}