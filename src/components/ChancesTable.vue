<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <table class="teamTable">
    <thead>
      <tr>
        <th>Campeão</th>
        <th>Libertadores</th>
        <th>Sul Americana</th>
        <th>Rebaixamento</th>
      </tr>
    </thead>
    <td v-if="calculating" colspan="4" class="calculating">Calculando</td>
    <tbody v-if="!calculating">
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
        <td v-if="chancesTable.first">{{ Math.floor((chancesTable.first[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.libertadores">{{ Math.floor((chancesTable.libertadores[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.sulAmericana">{{ Math.floor((chancesTable.sulAmericana[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.rebaixamento">{{ Math.floor((chancesTable.rebaixamento[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();

    return { winnersStore };
  },
  props: {
    table: {
      type: Array as PropType<ITable[]>,
      required: true,
    },
    chancesTable: {
      type: Object as PropType<IPositionChances>,
      required: true,
    },
    numOutcomes: {
      type: Number,
      required: true,
    },
    calculating: {
      type: Boolean,
    },
  },
});
</script>

<style scoped>
.calculating {
  background: cyan;
}
</style>
