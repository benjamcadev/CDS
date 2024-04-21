import { createContext, useState, useContext } from 'react'
import axios from 'axios'



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

    const signup = async (user) => {
        const response = await axios.post('http://localhost:3000/auth/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status == 200) {
                setUser(response.data)
                return response
            }
           
          
          
        }).catch((error) => {
            console.log(error)
            return error.response
           
           

        })

        return response

       
       
    }

    return (
        <AuthContext.Provider 
        value={{
            signup,
            user
        }}>
            {children}
        </AuthContext.Provider>

    )
}

