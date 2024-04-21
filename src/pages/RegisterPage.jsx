import { useRef, useState, useEffect } from 'react'
//COMPONENTES DE MUI
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
//COMPONENTE HEADER
import Header from '../components/Header';
//HELPERS
import { getTypesUser } from '../helpers/getTypesUser'
// IMPORTAR COMPONENTE DE ALERT SNACKBAR
import Alert from '../components/alertSnackbar'
//LIBRERIA PARA HACER FETCH
import axios from 'axios'

import {useAuth} from '../context/AuthContext'


export default function RegisterPage() {

    const [register, setRegister] = useState({
        nombre: '',
        correo: '',
        usuario: '',
        pass: '',
        tipo_usuario: ''
    })

    const [tiposUsuarios, setTiposUsuarios] = useState('')
    const [loadingTiposUsuarios, setLoadingTiposUsuarios] = useState(true)

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
    const {signup, user} = useAuth()

    console.log(user)


    useEffect(() => {

        async function fetchTiposUsuarios() {
            try {
                const response = await getTypesUser();
               if (response.status == 200) {
                 setTiposUsuarios(response.data)
                setLoadingTiposUsuarios(false)
               }else{
                setAlert({ ...alert, estado: true, mensaje: `Error en fetchTiposUsuarios ${response.message}`, tipo: 'error', titulo: `${response.code}`, detalle_tipo: '', time: null });
               }
              
            } catch (error) {
                console.error('Hubo un error fetch getTypesUser: ' + error);
            }
        }

        fetchTiposUsuarios()

    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()

        const requestJson = JSON.stringify(register);
        //ACTIVAR MENSAJE DE ESPERA
        setAlert({ ...alert, estado: true, mensaje: `Favor esperar`, tipo: 'info', titulo: 'Registrando Usuario...', detalle_tipo: '', time: null });
        //ENVIAR DATOS EN ENDPOINT
        const response = await signup(requestJson)

        console.log(response)

        if (response.status == 400) {
            setAlert({ ...alert, estado: true, mensaje: `${response.data.message}`, tipo: 'error', titulo: `${response.statusText}`, detalle_tipo: '', time: null });
        }

        if (response.status == 200) {
            //response.data
            setAlert({ ...alert, estado: true, mensaje: 'Usuario Registrado Exitosamente', tipo: 'success', titulo: 'Usuario Registrado !', detalle_tipo: '', time: 8000 });
        }
       
        
             
        
        


    }

    return (
        <div className='container mx-auto mt-5'>

            <Alert
                alert={alert}
                setAlert={setAlert}
            />

            <Header
                title={'Registrar Usuario'}
            />


            <div className="bg-white shadow-md rounded-md py-5 px-5 ">
                <form onSubmit={handleSubmit}>

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">

                        <div className="mb-5">
                            <TextField
                                required
                                label='Nombre'
                                id='nombre'
                                size='normal'

                                fullWidth
                                value={register.nombre}
                                onChange={(e) => setRegister({ ...register, nombre: e.target.value })}
                            />
                        </div>

                        <div className="mb-5">
                            <TextField
                                required
                                label='Correo'
                                id='correo'
                                size='normal'

                                type='email'
                                fullWidth
                                value={register.correo}
                                onChange={(e) => setRegister({ ...register, correo: e.target.value })}
                            />
                        </div>

                        <div className="mb-5">
                            <TextField
                                required
                                label='Usuario'
                                id='usuario'
                                size='normal'

                                type='text'
                                fullWidth
                                value={register.usuario}
                                onChange={(e) => setRegister({ ...register, usuario: e.target.value })}
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
                                value={register.pass}
                                onChange={(e) => setRegister({ ...register, pass: e.target.value })}
                            />
                        </div>


                        <div className="mb-5">
                            <FormControl fullWidth>
                                <InputLabel id="tipo_usuario_label">Tipo Usuario</InputLabel>
                                <Select
                                    labelId="tipo_usuario_label"
                                    id="tipo_usuario"
                                    value={register.tipo_usuario}
                                    required
                                    label='Tipo Usuario'
                                    onChange={(e) => setRegister({ ...register, tipo_usuario: e.target.value })}
                                >
                                    {
                                        !loadingTiposUsuarios ?
                                            tiposUsuarios.map((usuario) => (

                                                <MenuItem
                                                    key={usuario.idestado_usuario}
                                                    value={usuario.idestado_usuario}
                                                >
                                                    {usuario.detalle}
                                                </MenuItem>
                                            )) : ''}

                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <input
                        type="submit"
                        className="bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all rounded"
                        value={'Registrar'}
                    />
                </form>
            </div>

        </div>

    )
}
