import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    //baseURL: 'https://bodega.ssll-dsal.cl/api/v1',
    withCredentials: true
})

export default instance