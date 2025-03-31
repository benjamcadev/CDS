import Header from '../components/Header.jsx'
import TablaCotizacion from '../components/TablaCotizacion.jsx'

//import { getArticulos } from '../helpers/getArticulos.js';

export const CotizacionPage = () => {

  return (
    <div className='container mx-auto mt-5'>
      <Header title={'Cotizacion'} />
         
      <div className='mt-4'>

        <TablaCotizacion />
       
      </div>
    </div>
  )
}