import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx'
import ListarMaterial from '../components/ListarMaterial.jsx'
import Modals from "../components/Modals/Create.Modals.jsx"
import SearchBar from '../components/UI/SearchBar.jsx';
import CreateModal from '../components/Modals/Create.Modals.jsx';
//import { getArticulos } from '../helpers/getArticulos.js';

export const ArticulosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearchTerm(searchTerm);
  };

  return (
    <div className='container mx-auto mt-5'>
      <Header title={'Listado de Articulos Inventario Bodega'} />
   
      
      <div className='mt-4'>
        <ListarMaterial />
      </div>
    </div>
  )
}


