
import { useState, useEffect } from 'react'

//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar'
import Meteors from '../components/Meteors'

import logoPsinet from '/src/Logo-PSINet.png'
import logoPsinetPlanet from '/src/Logo-PSInet_planet.png'

//IMPORTANDO CONTEXT
import { useAuth } from '../context/AuthContext'

//REACT ROUTER
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage({showDarkMode, setShowDarkMode}) {

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


  const delay = 5;
  


  //USE EFFECT PARA RE DIRIGIR AL HOME SI ESTA LOGEADO CON COOKIES
  useEffect(() => {

    if (isAuthenticated) {
      navigate('/vale-salida/')
    }

  }, [isAuthenticated])

  useEffect(() => {

    let timer1 = setTimeout(() => setShowDarkMode(!showDarkMode), delay * 1000);
    return () => {
      //clearTimeout(timer1);
    };
  }, [])

  useEffect(() => {

    let timer2 = setInterval(() => setShowDarkMode(!showDarkMode), 15000);


    return () => {
      //clearTimeout(timer1);
      clearInterval(timer2)
    };
  }, [showDarkMode])

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
      setShowDarkMode(true)
      //response.data
      navigate("/vale-salida/")
    }



  }
  return (
    <div className="mx-auto my-11">
      {showDarkMode ?  '' : <Meteors number={50} />}
     

      <Alert
        alert={alert}
        setAlert={setAlert}
      />


      <div className={`rounded-md py-5 px-5 m-auto transition-all duration-700    ${showDarkMode ? "bg-white shadow-md " : "shadow-xl bg-gray-900 "} `}>
        <header className='flex h-20 rounded-md p-4 justify-center  bg-gray-900 '>
          <div className={` absolute transition-opacity ease-in duration-700 ${showDarkMode ? "opacity-100" : "opacity-0"}`}  >
            <img className=" h-10 w-17 md:h-12 " src={logoPsinet} alt="Your Company" />
          </div>

          <div className={` absolute transition-opacity ease-in duration-700 ${!showDarkMode ? "opacity-100" : "opacity-0"}`}>
            <img className=" h-10 w-17 md:h-12 " src={logoPsinetPlanet} alt="Your Company" />
          </div>
        </header>
        <div className="text-center mt-8 ">

          <h1 className={`text-3xl font-semibold transition-all duration-700 ${showDarkMode ? 'text-gray-900' : 'text-gray-200'} `}>Inicio Sesion</h1>
          <p className="mt-2 text-gray-500">Inicia sesión a continuación para acceder a tu cuenta</p>
        </div>
        
        <form onSubmit={handleSubmit}>
        

          <div className="grid gap-4 mt-8 sm:grid-cols-1 md:grid-cols-1">


           
            <div className={`mb-5 ${showDarkMode ? '' : ''}`} >
              <TextField
              variant='outlined'
              sx={{
                // Root class for the input field
                "& .MuiOutlinedInput-root": {
                  color: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  // Class for the border around the input field
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                    borderWidth: "2px",
                  },
                },
                // Class for the label of the input field
                "& .MuiInputLabel-outlined": {
                  color: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                  fontWeight: "bold",
                },
              }}
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
               sx={{
                // Root class for the input field
                "& .MuiOutlinedInput-root": {
                  color: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  // Class for the border around the input field
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                    borderWidth: "2px",
                  },
                },
                // Class for the label of the input field
                "& .MuiInputLabel-outlined": {
                  color: `${showDarkMode ? '#2e2e2e' : '#fff'}`,
                  fontWeight: "bold",
                },
              }}
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
