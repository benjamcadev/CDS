import axios from './axios'

export const loginRequest = async (user) => {
    const response = await axios.post('/auth/login/', user, {
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

export const forgetPass = async (email) => {
    const response = await axios.post('/auth/forget/', email, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
       
        if (res.status == 200) {
           
            return res
        }
    }).catch((error) => {
       
        return error.response
    })

    return response

}

export const changePass = async (newPassword) => {

    const response = await axios.post('/auth/changepass/', newPassword, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
       
        if (res.status == 200) {
           
            return res
        }
    }).catch((error) => {
       
        return error.response
    })

    return response
}

