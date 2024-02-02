import {useState} from 'react'
import Header from './components/Header'
import Formulario from './components/Formulario'

function App() {


  const [vale, setVale] = useState({})

  return (
    <div className='container mx-auto mt-5'>
      <Header />

      <Formulario 
      vale={vale}
      setVale={setVale
      }/>


    </div>





  )
}

export default App
