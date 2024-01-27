<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <table class="teamTable">
    <thead>
      <tr>
        <th v-if="display"><span id="champion">■</span>{{mobileStore.isMobile? '': 'Campeão'}}</th>
        <th v-if="display"><span id="libertadores">■</span>{{mobileStore.isMobile? '': 'Libertadores'}}</th>
        <th v-if="display"><span id="sulamericana">■</span>{{mobileStore.isMobile? '': 'Sul Americana'}}</th>
        <th v-if="display"><span id="rebaixamento">■</span>{{mobileStore.isMobile? '': 'Rebaixamento'}}</th>
      </tr>
    </thead>
    <td v-if="calculating && display" colspan="4" class="calculating">
      <h1><RefreshIcon width="25" /> Calculando</h1>
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
        <td v-if="chancesTable.libertadores && display">{{ Math.floor((chancesTable.libertadores[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.sulAmericana && display">{{ Math.floor((chancesTable.sulAmericana[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.rebaixamento && display">{{ Math.floor((chancesTable.rebaixamento[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
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
import mitt from "mitt"

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();
    const mobileStore = useIsMobileStore();
    return { winnersStore, mobileStore };
  },
  data() {
    return {
      progressBar: 0
    }
  },
  mounted () {
    const emitter = mitt()
    emitter.on("progress", (e) => {
      console.log("mudou", e)
    });
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
    }
  },
  components: { RefreshIcon },
});
</script>

<style scoped>
#champion{
  color: var(--champion);
}
#libertadores{
  color: var(--preLibertadores);
}
#sulamericana{
  color: var(--sulAmericana);
}
#rebaixamento{
  color: var(--rebaixamento);
}
.calculating {
  background: var(--brasileiraoBlue);
  color: white;
}
.calculating h1{
  position: fixed;
  top: 50%;
  transform: translate(80%, -50%);
  font-family:"Playfair Display", Arial, Helvetica, sans-serif;
}
@media screen and (max-width: 1450px) {
  .calculating h1{
    position: absolute;
    transform: translate(0, -50%);
    top:50%
  }
}
</style>
