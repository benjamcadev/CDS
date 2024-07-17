import { useState } from 'react';
import Header from '../components/Header.jsx'
import ListarMaterial from '../components/ListarMaterial.jsx'
import Modals from "../components/Modals/Create.Modals.jsx"
import SearchBar from '../components/UI/SearchBar.jsx';

export const ArticulosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className='container mx-auto mt-5'>
      <Header title={'Listado de Articulos Inventario Bodega'} />
      <div className='flex justify-between items-center mb-4'> 
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <Modals name="Crear Articulo" title="Crear Nuevo Articulo" />
      </div>

      <div className='mt-4'>
        <ListarMaterial />
      </div>
    </div>
  )
}


