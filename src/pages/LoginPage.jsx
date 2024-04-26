
import { useState, useEffect } from 'react'

//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar'

import logoPsinet from '/src/Logo-PSINet.png'

//IMPORTANDO CONTEXT
import { useAuth } from '../context/AuthContext'

//REACT ROUTER
import {Link, useNavigate} from 'react-router-dom'

export default function LoginPage() {

  //NAVEGACION
  let navigate = useNavigate()

  //STATE DEL LOGIN
  const [login, setLogin] = useState({
    correo: '',
    pass: ''
  })

  //STATE DE ALERT SNACKBAR
  const [alert, setAlert] = useState({
    estado: false,
    mensaje: 'Mensaje de prueba',
    titulo: '',
    detalle_tipo: '',
    time: null,
    responseReturn: false,
    value: ''
  });

  //TRAYENDO LA FUNCION DE REGISTAR DESDE EL CONTEXT
  const { signin, isAuthenticated, errors } = useAuth()

  
  //USE EFFECT PARA RE DIRIGIR AL HOME SI ESTA LOGEADO CON COOKIES
  useEffect(() => {
    
    if(isAuthenticated){
      navigate('/vale-salida/')
    }
  
  }, [isAuthenticated])
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const requestJson = JSON.stringify(login);

    //ENVIAR DATOS EN ENDPOINT
    const response = await signin(requestJson)

    if (response.status == 400) {
      setAlert({ ...alert, estado: true, mensaje: `${response.data.message}`, tipo: 'error', titulo: `${response.statusText}`, detalle_tipo: '', time: null });
      return
    }

    if (response.status == 200) {
      //response.data
      navigate("/vale-salida/")
  }
 


  }
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">

      <Alert
        alert={alert}
        setAlert={setAlert}
      />

      <div className="bg-white shadow-md rounded-md py-5 px-5 m-auto ">
        <header className='flex bg-gray-800 rounded-md p-4 justify-center'>
          <img className=" h-10 w-17 md:h-12" src={logoPsinet} alt="Your Company" />
        </header>

        <div className="text-center mt-8">

          <h1 className="text-3xl font-semibold text-gray-900">Inicio Sesion</h1>
          <p className="mt-2 text-gray-500">Inicia sesión a continuación para acceder a tu cuenta</p>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="grid gap-4 mt-8 sm:grid-cols-1 md:grid-cols-1">

            <div className="mb-5">
              <TextField
                required
                label='Correo'
                id='correo'
                size='normal'
                type='email'
                fullWidth
                value={login.correo}
                onChange={(e) => setLogin({ ...login, correo: e.target.value })}
              />
            </div>

            <div className="mb-5">
              <TextField
                required
                label='Contraseña'
                id='pass'
                size='normal'
                type='password'
                fullWidth
                value={login.pass}
                onChange={(e) => setLogin({ ...login, pass: e.target.value })}
              />
            </div>

          </div>

          <input
            type="submit"
            className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
            value={'Iniciar Sesion'}
          />
        </form>
        <footer className="mt-8">
          <p className="text-center text-sm text-gray-500">¿Olvidaste tu contraseña?
            <Link to="#!"
              className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"> Recuperar
            </Link>.
          </p>
        </footer>
      </div>
    </div>
  )
}
