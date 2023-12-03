import axios from 'axios'

const http = axios.create({
    baseURL: '/api',
})

export default {
    getChampionshipTable() {
        return http.get(`/api/standings`)
    },
    getChampionshipFixtures() {
        return http.get(`/api/fixtures`)
    },
}