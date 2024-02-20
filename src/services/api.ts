import type ITable from '@/interfaces/ITable'
import type IFixtures from '@/interfaces/IFixtures'
import type ILeagueInfo from '@/interfaces/ILeagueInfo'
import axios, { type AxiosResponse } from 'axios'
import type { Countries } from '@/stores/leagueChosen'
import type ILeaguesAvaiable from '@/interfaces/ILeaguesAvaiable'

const http = axios.create({
    //@ts-ignore
    baseURL: import.meta.env.VITE_API_IP,
})
export default {
    getLeagueTable(country: Countries, division: String) : Promise<AxiosResponse<ITable[]>>{
        console.log('Request URL:', '/api/leagues');
        return http.get(`/${country}/${division}/standings`)
    },
    getLeagueFixtures(country: Countries, division: String) :Promise<AxiosResponse<IFixtures[]>>{
        return http.get(`/${country}/${division}/fixtures`)
    },
    getLeagueInfo(country: Countries, division: String) : Promise<AxiosResponse<ILeagueInfo>>{
        return http.get(`/${country}/${division}/info`)
    },
    getLeaguesAvaiable(): Promise<AxiosResponse<ILeaguesAvaiable[]>>{
        return http.get(`/leagues`)
    }
}