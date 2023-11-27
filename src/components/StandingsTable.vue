<template>
  <table class="teamTable">
    <thead>
      <tr>
        <th colspan="2">Time</th>
        <th>Pontos</th>
        <th>Jogos</th>
        <th>V</th>
        <th>E</th>
        <th>D</th>
        <th>SG</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(team, index) in table"
        :key="index"
        :class="{
          campeao: team.position === 1,
          libertadores:
            (team.position > 1 && team.position <= winnersStore.libertadoresSpot) ||
            team.team_name === winnersStore.libertadoresWinner ||
            team.team_name === winnersStore.copaDoBrasilWinner,
          preLibertadores:
            team.position > winnersStore.libertadoresSpot &&
            team.position <= winnersStore.preLibertadoresSpot &&
            team.team_name !== winnersStore.libertadoresWinner &&
            team.team_name !== winnersStore.copaDoBrasilWinner,
          sulAmericana:
            team.position > winnersStore.preLibertadoresSpot &&
            team.position <= winnersStore.sulAmericanaSpot &&
            team.team_name !== winnersStore.libertadoresWinner &&
            team.team_name !== winnersStore.copaDoBrasilWinner,
          rebaixamento:
            team.position > 16 && team.team_name !== winnersStore.libertadoresWinner && team.team_name !== winnersStore.copaDoBrasilWinner,
        }"
      >
        <td class="position">{{ team.position }}</td>
        <td class="teamName"><img :src="team.logo" alt="escudo" /> {{ team.team_name }}</td>
        <td class="points">{{ team.points }}</td>
        <td class="matches">{{ team.matches }}</td>
        <td>{{ team.wins }}</td>
        <td>{{ team.draws }}</td>
        <td>{{ team.losses }}</td>
        <td>{{ team.goal_difference }}</td>
        </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type ITable from "@/interfaces/ITable";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
    setup() {
    const winnersStore = useWinnersStore()

    return {winnersStore}
  },
    props: {
        table: {
            type: Array as PropType<ITable[]>,
        },
    },
});
</script>

