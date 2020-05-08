import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {'Access-Control-Allow-Origin': 'Authorization'}
})

export default api