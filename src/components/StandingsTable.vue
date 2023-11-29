<template>
  <table class="teamTable">
    <thead>
      <tr>
        <th colspan="2">Time</th>
        <th>Pontos</th>
        <th v-if="display">Jogos</th>
        <th v-if="display">V</th>
        <th v-if="display">E</th>
        <th v-if="display">D</th>
        <th v-if="display">SG</th>
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
        <td class="teamName"><img v-if="!mobileStore.isMobile" :src="team.logo" alt="escudo" /> {{ team.team_name }}</td>
        <td class="points">{{ team.points }}</td>
        <td v-if="display" class="matches">{{ team.matches }}</td>
        <td v-if="display">{{ team.wins }}</td>
        <td v-if="display">{{ team.draws }}</td>
        <td v-if="display">{{ team.losses }}</td>
        <td v-if="display">{{ team.goal_difference }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type ITable from "@/interfaces/ITable";
import { useIsMobileStore } from "@/stores/isMobile";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();
    const mobileStore = useIsMobileStore();

    return { winnersStore, mobileStore };
  },
  props: {
    table: {
      type: Array as PropType<ITable[]>,
    },
    display: {
      type: Boolean,
    }
  },
});
</script>