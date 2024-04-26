import React from 'react'
import logoPsinet from '/src/Logo-PSINet.png'

//IMPORTANDO CONTEXT
import { useAuth } from '../context/AuthContext'

import { Link } from 'react-router-dom'

export default function Header({ title }) {

  //TRAYENDO LA FUNCION DE REGISTAR DESDE EL CONTEXT
  const { user, logout, isAuthenticated } = useAuth()


  return (
    <nav className="bg-gray-800 rounded-md mb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-17 md:h-12" src={logoPsinet} alt="Your Company" />
            </div>
            <div className="">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="sm:text-xl md:text-3xl font-bold tracking-tight text-gray-50 ">{title}</h1>
              </div>

            </div>
          </div>

          {isAuthenticated &&
            <div>
              <Link className='text-gray-50 sm:text-xs md:text-lg' to='/' onClick={() => { logout() }}>Cerrar Sesion</Link>
            </div>}



        </div>

      </div>

    </nav>


  )
}
