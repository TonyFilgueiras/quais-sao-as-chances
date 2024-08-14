<template>
  <div>
    <button @click="fetchStandings">Standings</button>
    <button @click="fetchFixtures">Fixtures</button>
  </div>
</template>

<script lang="ts">
import { fetchChampionshipStandings, fetchChampionshipFixtures } from "../services/api";

export default {
  methods: {
    async fetchStandings() {
      try {
        const campeonatos = await fetchChampionshipStandings(71, 2024);
        console.log(campeonatos);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchFixtures() {
      try {
        const fixtures = await fetchChampionshipFixtures(71, 2024);
        console.log(fixtures);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped></style>
