import type ITable from '@/interfaces/ITable'
import type IFixtures from '@/interfaces/IFixtures'
import type ILeagueInfo from '@/interfaces/ILeagueInfo'
import axios, { type AxiosResponse } from 'axios'

const http = axios.create({
    baseURL: '/api',
})

export default {
    getLeagueTable() : Promise<AxiosResponse<ITable[]>>{
        return http.get(`/brasileirao-a/standings`)
    },
    getLeagueFixtures() :Promise<AxiosResponse<IFixtures[]>>{
        return http.get(`/brasileirao-a/fixtures`)
    },
    getLeagueInfo() : Promise<AxiosResponse<ILeagueInfo>>{
        return http.get(`/brasileirao-a/info`)
    }
}