import React from 'react'
import Header from '../components/Header.jsx'
import FormularioValeEntrada from '../components/FormularioValeEntrada.jsx'


export default function ValeEntrada() {
  return (
    <div className='container mx-auto mt-5'>
      <Header title={'Vale Entrada de Materiales'} />
    
      <FormularioValeEntrada 
      />
    </div>
  )
}