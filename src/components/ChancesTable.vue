<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <table :class="['teamTable', {hidden: !display}]">
    <thead>
      <tr>
        <th v-if="display"><span id="champion">■</span>{{ mobileStore.isMobile ? "" : "Campeão" }}</th>
        <th v-if="display"><span id="libertadores">■</span>{{ mobileStore.isMobile ? "" : "Libertadores" }}</th>
        <th v-if="display"><span id="sulamericana">■</span>{{ mobileStore.isMobile ? "" : "Sul Americana" }}</th>
        <th v-if="display"><span id="rebaixamento">■</span>{{ mobileStore.isMobile ? "" : "Rebaixamento" }}</th>
      </tr>
    </thead>
    <td v-if="calculating && display" colspan="4" class="calculating">
      <div class="calculatingContainer">
        <h1><RefreshIcon :width="mobileStore.isMobile? '15':'25'" /> Calculando</h1>
        <div class="progressBarContainer" :style="{ width: `${progressBar}%` }">
          <div class="progressBar"></div>
        </div>
        <h2>{{ progressBar }} %</h2>
      </div>
    </td>
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
        <td v-if="chancesTable.first && display">{{ Math.floor((chancesTable.first[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.libertadores && display">
          {{ Math.floor((chancesTable.libertadores[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.sulAmericana && display">
          {{ Math.floor((chancesTable.sulAmericana[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.rebaixamento && display">
          {{ Math.floor((chancesTable.rebaixamento[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { defineComponent, type PropType } from "vue";
import RefreshIcon from "./icons/RefreshIcon.vue";
import { useIsMobileStore } from "@/stores/isMobile";
// import mitt from "mitt"

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();
    const mobileStore = useIsMobileStore();
    return { winnersStore, mobileStore };
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
    display: {
      type: Boolean,
    },
    progressBar: {
      type: Number,
    },
  },
  components: { RefreshIcon },
});
</script>

<style scoped>
#champion {
  color: var(--champion);
}
#libertadores {
  color: var(--preLibertadores);
}
#sulamericana {
  color: var(--sulAmericana);
}
#rebaixamento {
  color: var(--rebaixamento);
}
.calculating {
  background: var(--brasileiraoBlue);
  color: white;
}
.calculatingContainer {
  position: fixed;
  top: 50%;
  transform: translate(80%, -50%);
  font-family: "Playfair Display", Arial, Helvetica, sans-serif;
}
.progressBarContainer{
  height: 20px;
  width: 100%;
}
.progressBar{
  height: 100%;
  border-radius: 3px;
  background-color: var(--brasileiraoGold);
}
@media screen and (max-width: 760px) {
  .calculatingContainer{
    position: absolute;
    font-size: 5px;
    transform: translate(20%, -50%);
    top:50%
  }
}
</style>
