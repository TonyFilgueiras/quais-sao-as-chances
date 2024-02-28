import type ITable from '@/interfaces/ITable'
import type IFixtures from '@/interfaces/IFixtures'
import type ILeagueInfo from '@/interfaces/ILeagueInfo'
import type { Countries } from '@/stores/leagueChosen'
import type ILeaguesAvailable from '@/interfaces/ILeaguesAvailable'

export default {
    async getLeagueTable(country: Countries, division: String) : Promise<ITable[]>{
        try {
            const response = await fetch(`/quais-sao-as-chances/data/${country}/${division}/table_data.json`);
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data: ITable[] = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
            return [];
          }
    },
    async getLeagueFixtures(country: Countries, division: String) :Promise<IFixtures[]>{
        try {
            const response = await fetch(`/quais-sao-as-chances/data/${country}/${division}/fixtures_data.json`);
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data: IFixtures[] = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
            return [];
          }
    },
    async getLeagueInfo(country: Countries, division: String) : Promise<ILeagueInfo>{
        try {
            const response = await fetch(`/quais-sao-as-chances/data/${country}/${division}/league_info.json`);
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data: ILeagueInfo = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
            return {} as ILeagueInfo;
          }
    },
    async getLeaguesAvailable(): Promise<ILeaguesAvailable[]>{
        try {
            const response = await fetch("/quais-sao-as-chances/data/leagues_available.json");
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data: ILeaguesAvailable[] = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
            return [];
          }
    }
}