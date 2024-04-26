
import ValeSalida from './pages/ValeSalida'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

function App() {

  const Home = () => <h1>Home</h1>

  return (
    <div>
      {/* Aca montamos un componente header global que vaya en todas las paginas */}

      <AuthProvider> {/* el AuthProvider tiene una especie de useState globales de los cuales podemos acceder de las rutas que estan en el  */}

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
