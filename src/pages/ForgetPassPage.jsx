import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar'


import { forgetPass } from '../helpers/authRequest'

//IMAGENES
import logoPsinet from '../public/images/Logo-PSINet.png'



export const ForgetPassPage = () => {

  //NAVEGACION
  let navigate = useNavigate()

  //STATE DEL LOGIN
  const [forget, setForget] = useState({
    correo: '',

  });

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


  const handleSubmit = async (e) => {
    e.preventDefault()
    const requestJson = JSON.stringify(forget);

    //ENVIAR DATOS EN ENDPOINT
    const response = await forgetPass(requestJson);

    if (response.status == 400) {
      setAlert({ ...alert, estado: true, mensaje: `${response.data.message}`, tipo: 'error', titulo: `${response.statusText}`, detalle_tipo: '', time: null });
      return
    }

    if (response.status == 200) {
      
      setAlert({ ...alert, estado: true, mensaje: `Correo enviado`, tipo: 'success', titulo: `Listo !`, detalle_tipo: '', time: null });
      setTimeout(function() {
        navigate('/login/')
      }, 6000);
      return
    }



  }


  return (
    <div className="mx-auto my-9">
      <Alert
        alert={alert}
        setAlert={setAlert}
      />

      <div className={` login-container rounded-md py-5 px-5 m-auto bg-white shadow-md   `}>

        <header className='flex h-20 rounded-md p-4 justify-center  bg-gray-900 '>
          <div className={` absolute transition-opacity ease-in duration-700 opacity-100 `}  >
            <img className=" h-11 w-18 md:h-12 " src={logoPsinet} alt="Your Company" />
          </div>
        </header>

        <div className="text-center mt-6 ">

          <h1 className={`text-2xl font-semibold text-black `}>CDS</h1>

          <p className="mt-2 text-gray-500">Ingresa tu correo para recuperar tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mt-8 sm:grid-cols-1 md:grid-cols-1">

            <div className={`mb-5`} >
              <TextField
                variant='outlined'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: `#fff'`, // Ajuste del color del texto
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `#fff`,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: `#fff`,
                    fontWeight: "bold",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0px 1000px #2e2e2e inset`,
                    WebkitTextFillColor: `#fff`,
                  },

                }}
                required
                label='Correo'
                id='correo'
                size='normal'
                type='email'
                fullWidth
                value={forget.correo}
                onChange={(e) => setForget({ ...forget, correo: e.target.value })}
              />
            </div>

          </div>

          <input
            type="submit"
            className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
            value={'Recuperar'}
          />

        </form>


      </div>
    </div>
  )
}
