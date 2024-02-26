import type ITable from '@/interfaces/ITable'
import type IFixtures from '@/interfaces/IFixtures'
import type ILeagueInfo from '@/interfaces/ILeagueInfo'
import axios, { type AxiosResponse } from 'axios'
import type { Countries } from '@/stores/leagueChosen'
import type ILeaguesAvaiable from '@/interfaces/ILeaguesAvaiable'

const http = axios.create({
    //@ts-ignore
    baseURL: "/api",
})
export default {
    getLeagueTable(country: Countries, division: String) : Promise<AxiosResponse<ITable[]>>{
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