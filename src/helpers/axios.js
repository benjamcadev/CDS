import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    //baseURL: 'http://bodega.ssll-dsal.cl:3000/',
    withCredentials: true
})

export default instance