import React from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
    const {user, isAuthenticated, loading} = useAuth()   
   
    
    if(loading) return <h1>Loading...</h1>
    if (!loading && !isAuthenticated) return <Navigate to={'/login'} replace />
  return (
     <Outlet /> //Este componente hace que continue hacia la pagina que solicite siempre y cuando este logeado
  )
}
