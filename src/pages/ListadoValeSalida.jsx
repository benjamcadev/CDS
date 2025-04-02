import Header from '../components/Header.jsx'
import TablaListadoValeSalida from '../components/TablaListadoValeSalida.jsx'

export const ListadoValeSalidaPage = () => {


    return (
        <div className='container mx-auto mt-5'>
             <div className='mt-4'>
             <Header title={'Listado de Vale de Salidas'} />

             <TablaListadoValeSalida />
             
             </div>
           

        </div>
    )
}