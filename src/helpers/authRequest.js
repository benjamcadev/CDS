import axios from './axios'

export const loginRequest = async (user) => {
    const response = await axios.post('/auth/login', user, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status == 200) {
            return response
        }
    }).catch((error) => {
       
        return error.response
    })

    return response
}

export const verifyTokenRequest = (token) => {
    const response = axios.get('/auth/verify')
    return response
}

