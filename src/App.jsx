
import ValeSalida from './pages/ValeSalida'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {

  const Home = () => <h1>Home</h1>

  return (
    <div>
      {/* Aca montamos un componente header global que vaya en todas las paginas */}

      <AuthProvider>
      
          <Routes>

            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/vale-salida/' element={<ValeSalida />} />
            <Route path='/vale-salida/:idTicket' element={<ValeSalida />} />

          </Routes>
      

      </AuthProvider>



    </div>

  )
}

export default App
