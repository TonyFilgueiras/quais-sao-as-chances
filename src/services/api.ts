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

// Cache for storing responses
const cache: Record<string, AxiosResponse<any>> = {};

// Request interceptor to check cache
http.interceptors.request.use(config => {
  const cacheKey = config.url!;
  if (cache[cacheKey]) {
    // Use cached response if available
    console.log('Using cached response for:', cacheKey);
    return Promise.resolve(cache[cacheKey].config);
  }
  return config;
});

// Response interceptor to cache responses
http.interceptors.response.use(response => {
    const cacheKey = response.config.url!;
    console.log(cacheKey)
    console.log(response)
  cache[cacheKey] = response;
  return response;
});

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