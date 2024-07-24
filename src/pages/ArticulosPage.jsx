import Header from '../components/Header.jsx'
import ListarMaterial from '../components/ListarMaterial.jsx'

//import { getArticulos } from '../helpers/getArticulos.js';

export const ArticulosPage = () => {

  return (
    <div className='container mx-auto mt-5'>
      <Header title={'Listado de Articulos Inventario Bodega'} />
         
      <div className='mt-4'>
        <ListarMaterial />
      </div>
    </div>
  )
}


