import { createContext, useState, useContext } from 'react'
import axios from 'axios'

import {loginRequest} from '../helpers/authRequest'
import { Try } from '@mui/icons-material'



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

    return (
        <AuthContext.Provider 
        value={{
            signup,
            signin,
            user,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>

    )
}

