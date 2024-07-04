import axios, { type AxiosResponse } from 'axios';
import type { Championships } from '@/interfaces/IApiData';

const API_URL = 'https://api.api-futebol.com.br/v1';
// const API_TEST_TOKEN = import.meta.env.VITE_TEST_API_KEY;
// const API_TOKEN = import.meta.env.VITE_API_KEY;

const availableChampionships = {
  Brasileirao: 10,
  BrasileiraoB: 14,
};

// Fetch all championships
// export const fetchChampionships = async (): Promise<Championships[]> => {
//   try {
//     const response: AxiosResponse<Championships[]> = await axios.get(`${API_URL}/campeonatos`, {
//       headers: {
//         Authorization: `Bearer ${API_TEST_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching championships:', error);
//     throw error;
//   }
// };

// Fetch a specific championship by ID
// export const fetchChampionship = async (championshipId: number): Promise<Championships> => {
//   try {
//     const response: AxiosResponse<Championships> = await axios.get(`${API_URL}/campeonatos/${championshipId}`, {
//       headers: {
//         Authorization: `Bearer ${API_TEST_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching championship with ID ${championshipId}:`, error);
//     throw error;
//   }
// };

// export const fetchChampionshipStandings = async (championshipId: number): Promise<Championships> => {
//   try {
//     const response: AxiosResponse<Championships> = await axios.get(`${API_URL}/campeonatos/${championshipId}/tabela`, {
//       headers: {
//         Authorization: `Bearer ${API_TEST_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching championship with ID ${championshipId}:`, error);
//     throw error;
//   }
// };
