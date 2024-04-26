import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

import { loginRequest, verifyTokenRequest } from '../helpers/authRequest'
import Cookies from 'js-cookie'




export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("use Auth must be used eithin an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)

    const signup = async (user) => {
        const response = await axios.post('http://186.64.113.208:3000/auth/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status == 200) {
                setUser(response.data)
                setIsAuthenticated(true)
                return response
            }
        }).catch((error) => {
            console.log(error)
            setIsAuthenticated(false)
            setUser(null)
            return error.response
        })

        return response



    }

    const signin = async (user) => {
        try {
            const response = await loginRequest(user)

            if (response.status == 200) {
                setUser(response.data)
                setIsAuthenticated(true)
                return response
            }
            return response
        } catch (error) {
            setIsAuthenticated(false)
            setUser(null)
            return error
        }

    }

    const logout = () => {
        Cookies.remove('token')
        setIsAuthenticated(false)
        setUser(null)
    }

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get()

           

            if (cookies.token) {
                try {
                    const res = await verifyTokenRequest(cookies.token)
                    
                    if (res.data) {
                        setIsAuthenticated(true)
                        setUser(res.data)
                        setLoading(false)
                       
                    } else {
                        setIsAuthenticated(false)
                        setLoading(false)
                        setUser(null)
                        return
                    }
                } catch (error) {
                    setIsAuthenticated(false)
                    setUser(null)
                    setLoading(false)
                }

            }else{
                setIsAuthenticated(false)
                setLoading(false)
                setUser(null)
                return
            }
        }

        checkLogin()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                logout,
                user,
                isAuthenticated,
                errors,
                loading
            }}>
            {children}
        </AuthContext.Provider>

    )
}

