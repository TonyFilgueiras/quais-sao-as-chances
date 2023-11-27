import axios from 'axios'

const http = axios.create({
    baseURL: '/api',
})

export default {
    getChampionshipTable() {
        return http.get(`/api/standings`, {
            headers: { 
                Authorization: `Bearer ${import.meta.env.VITE_APP_TEST_API_KEY}`
            }
        })
    },
    getChampionshipFixtures() {
        return http.get(`/api/fixtures`, {
            headers: { 
                Authorization: `Bearer ${import.meta.env.VITE_APP_TEST_API_KEY}`
            }
        })
    },
}