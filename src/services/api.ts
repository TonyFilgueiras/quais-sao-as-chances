import type ITable from '@/interfaces/ITable'
import type IFixtures from '@/interfaces/IFixtures'
import type ILeagueInfo from '@/interfaces/ILeagueInfo'
import axios, { type AxiosResponse } from 'axios'
import type { Leagues } from '@/stores/leagueChosen'

const http = axios.create({
    baseURL: '/api',
})

export default {
    getLeagueTable(league: Leagues) : Promise<AxiosResponse<ITable[]>>{
        return http.get(`/${league}/standings`)
    },
    getLeagueFixtures(league: Leagues) :Promise<AxiosResponse<IFixtures[]>>{
        return http.get(`/${league}/fixtures`)
    },
    getLeagueInfo(league: Leagues) : Promise<AxiosResponse<ILeagueInfo>>{
        return http.get(`/${league}/info`)
    }
}