import { useState } from 'react'
import ValeSalida from './pages/ValeSalida'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ProtectedRoute'


function App() {

  return (
    <div className="flex w-full h-full">
      <AuthProvider> {/* el AuthProvider tiene una especie de useState globales de los cuales podemos acceder de las rutas que estan en el  */}

        <Sidebar />


        <Routes>


          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/vale-salida/' element={<ValeSalida />} />
            <Route path='/vale-salida/:idTicket' element={<ValeSalida />} />
          </Route>


        </Routes>


      </AuthProvider>



    </div>

  )
}

export default App
