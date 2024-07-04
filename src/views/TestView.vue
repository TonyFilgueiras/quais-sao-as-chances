<!-- <template>
  <div>
    <button @click="fetchChampionship">champioship</button>
    <button @click="fetchStandings">Standings</button>
  </div>
</template>

<script lang="ts">
import { fetchChampionship, fetchChampionshipStandings } from "../services/api";

export default {
  methods: {
    async fetchChampionship() {
      try {
        const campeonatos = await fetchChampionship(10);
        console.log(campeonatos);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStandings() {
      try {
        const campeonatos = await fetchChampionshipStandings(10);
        console.log(campeonatos);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped></style> -->
