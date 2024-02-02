import React from 'react'
import logoPsinet from '../assets/Logo-PSINET.png'

export default function Header() {
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
                <h1 className="sm:text-xl md:text-3xl font-bold tracking-tight text-gray-50 ">Vale Salida de Materiales</h1>
              </div>

            </div>
          </div>


        </div>

      </div>

    </nav>


  )
}
