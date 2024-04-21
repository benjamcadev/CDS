import React from 'react'
import Header from '../components/Header.jsx'
import FormularioValeSalida from '../components/FormularioValeSalida.jsx'



export default function ValeSalida() {
  return (
    <div className='container mx-auto mt-5'>
    <Header 
    title={'Vale Salida de Materiales'}
    />
    
    <FormularioValeSalida />


  </div>
  )
}
