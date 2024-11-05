
import React, { useEffect, useState } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'

//IMAGENES
import logoPsinet from '../public/images/Logo-PSINet.png'

// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar'

//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';

import { changePass } from '../helpers/authRequest';


export const ChangePass = () => {

    const [searchParams] = useSearchParams();

    //NAVEGACION
    let navigate = useNavigate()

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const token = searchParams.get("token");


    //STATE DEL LOGIN
    const [newpass, setNewPass] = useState({
        newPassword: '',
        reNewPassword: '',
        idUsuario: id,
        tokenUsuario: token,
        correo: email

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


    useEffect(() => {
        if (id == undefined || email == undefined || token == undefined) {
            navigate('/login/')
        }

    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();


        if (newpass.newPassword.length >= 6) {
            if (newpass.newPassword == newpass.reNewPassword) {

                const requestJson = JSON.stringify(newpass);

                //ENVIAR DATOS EN ENDPOINT
                const response = await changePass(requestJson);

                if (response.status == 400) {
                    setAlert({ ...alert, estado: true, mensaje: `${response.data.message}`, tipo: 'error', titulo: `${response.statusText}`, detalle_tipo: '', time: null });
                    return
                }

                if (response.status == 200) {

                    setAlert({ ...alert, estado: true, mensaje: `Contraseña cambiada`, tipo: 'success', titulo: `Listo !`, detalle_tipo: '', time: null });
                    setTimeout(function() {
                        navigate('/login/')
                      }, 6000);
                    return
                }else{}

                setAlert({ ...alert, estado: true, mensaje: `${response.data.message}`, tipo: 'error', titulo: `${response.statusText}`, detalle_tipo: '', time: null });


            } else {

                setAlert({ ...alert, estado: true, mensaje: `Contraseñas no coinciden`, tipo: 'error', titulo: `Error`, detalle_tipo: '', time: null });
            }
        }else{
            setAlert({ ...alert, estado: true, mensaje: `Contraseña no contiene 6 caracteres como minimo`, tipo: 'error', titulo: `Error`, detalle_tipo: '', time: null });
        }



    }




    return (
        <div className="mx-auto my-9">
            <Alert
                alert={alert}
                setAlert={setAlert}
            />

            <div className={` login-container rounded-md py-5 px-5 m-auto bg-white shadow-md w-96   `}>

                <header className='flex h-20 rounded-md p-4 justify-center  bg-gray-900 '>
                    <div className={` absolute transition-opacity ease-in `}  >
                        <img className=" h-11 w-18 md:h-12 " src={logoPsinet} alt="Your Company" />
                    </div>
                </header>

                <div className="text-center mt-6 ">

                    <h1 className={`text-2xl font-semibold text-black `}>CDS</h1>

                    <p className="mt-2 text-gray-500">Ingresa tu nueva contraseña.</p>
                    <p className="mt-2 text-gray-500 bg-amber-300 rounded-md font-bold ">Minimo debe contener 6 caracteres.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mt-8 sm:grid-cols-1 md:grid-cols-1">

                        <div className={`mb-5`} >
                            <TextField
                                variant='outlined'
                                required
                                label='Nueva Contraseña'
                                id='password'
                                size='normal'
                                type='password'
                                fullWidth
                                value={newpass.newPassword}
                                onChange={(e) => setNewPass({ ...newpass, newPassword: e.target.value })}
                            />
                        </div>

                        <div className={`mb-5`} >
                            <TextField
                                variant='outlined'
                                required
                                label='Re Ingresa Nueva Contraseña'
                                id='repassword'
                                size='normal'
                                type='password'
                                fullWidth
                                value={newpass.reNewPassword}
                                onChange={(e) => setNewPass({ ...newpass, reNewPassword: e.target.value })}
                            />
                        </div>

                    </div>

                    <input
                        type="submit"
                        className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
                        value={'Cambiar Contraseña'}
                    />

                </form>


            </div>
        </div>
    )
}
