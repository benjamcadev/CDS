import Header from '../components/Header.jsx'
import TablaListadoValeEntrada from '../components/TablaListadoValeEntrada.jsx'

export const ListadoValeEntradaPage = () => {


    return (
        <div className='container mx-auto mt-5'>
             <div className='mt-4'>
             <Header title={'Listado de Vale de Entrada'} />

             <TablaListadoValeEntrada />
             
             </div>
           

        </div>
    )
}