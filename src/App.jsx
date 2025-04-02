import { useState } from 'react'
import ValeSalida from './pages/ValeSalida'
import ValeEntrada from './pages/ValeEntrada'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { CotizacionPage } from './pages/CotizacionPage'
import { ListadoCotizacionPage } from './pages/ListadoCotizacion'
import { ListadoValeSalidaPage } from './pages/ListadoValeSalida'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import { ArticulosPage } from './pages/ArticulosPage'
import { ForgetPassPage } from './pages/ForgetPassPage'
import { ChangePass } from './pages/ChangePass'
import { ValePendiente } from './pages/ValePendiente'
import { Mensajes } from './pages/Mensajes'


function App() {

  const [showDarkMode, setShowDarkMode] = useState(true);

  return (
    <div className={`flex min-h-screen transition-all duration-700 ${showDarkMode ? '' : 'bg-gray-900'}`} >
      <AuthProvider> {/* el AuthProvider tiene una especie de useState globales de los cuales podemos acceder de las rutas que estan en el  */}

        <Sidebar />


        <Routes>


          <Route path='/login' element={<LoginPage showDarkMode={showDarkMode} setShowDarkMode={setShowDarkMode} />} />  
          <Route path='/forget' element={<ForgetPassPage />} />
          <Route path='/changepass' element={<ChangePass />} />
          <Route path='/vale-pendiente' element={<ValePendiente />} />
          <Route path='/mensajes' element={<Mensajes />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/vale-salida' element={<ValeSalida />} />
            <Route path='/vale-salida/:idTicket' element={<ValeSalida />} />
            <Route path='/vale-entrada' element={<ValeEntrada />} />
            <Route path='/Articulos' element={<ArticulosPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/cotizacion' element={<CotizacionPage />} />
            <Route path='/listado-cotizacion' element={<ListadoCotizacionPage />} />
            <Route path='/listado-vale-salida' element={<ListadoValeSalidaPage />} />
          </Route>


        </Routes>


      </AuthProvider>



    </div>

  )
}

export default App;