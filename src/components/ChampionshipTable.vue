<template>
  <div>
    <select v-if="mobileStore.isMobile" v-model="selectedTable" name="championship" id="championship">
      <option value="standings">Tabela</option>
      <option value="chances">Chances</option>
    </select>
    <table class="tableContainer">
      <StandingsTableVue :display="selectedTable === 'standings' || !mobileStore.isMobile" :table="table" />
      <ChancesTableVue :display="selectedTable === 'chances' || !mobileStore.isMobile" :table="table" :chances-table="chancesTable" :calculating="calculating" :num-outcomes="numOutcomes" :progress-bar="progressBar"/>
    </table>
  </div>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "../interfaces/ITable";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import StandingsTableVue from "./StandingsTable.vue";
import ChancesTableVue from "./ChancesTable.vue";
import type { PropType } from "vue";
import { useIsMobileStore } from "@/stores/isMobile";
export default {
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
    calculating: {
      type: Boolean,
      required: true,
    },
    progressBar: {
      type: Number
    },
    numOutcomes: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      error: "",
      selectedTable: "standings",
    };
  },
  components: { StandingsTableVue, ChancesTableVue },
};
</script>

<style>
select{
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.tableContainer {
  border: 1px solid var(--brasileiraoSilver);
  overflow-x: auto;
  display: flex;
  max-width: 100vw;  
}
/* width */
table::-webkit-scrollbar {
  height: 4px;
}

/* Track */
table::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
table::-webkit-scrollbar-thumb {
  background: var(--brasileiraoBlue);
  border-radius: 8px;
  transition: .3s;
}
.teamTable {
  border-collapse: collapse;
}
.teamTable tr {
  border-bottom: 1px solid var(--brasileiraoSilver);
  border-top: 1px solid var(--brasileiraoSilver);
}

.teamTable th,
.teamTable td {
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 10px;
  text-align: center;
}

.teamTable th {
  background-color: var(--brasileiraoSilver);
}
.teamName {
  display: flex;
  align-items: center;
  gap: 5px;
}
.position,
.points {
  font-weight: bold;
}
.campeao {
  background-color: var(--champion);
}
.rebaixamento {
  background-color: var(--rebaixamento);
}
.preLibertadores {
  background-color: var(--preLibertadores);
}
.libertadores {
  background-color: var(--libertadores);
}
.sulAmericana {
  background-color: var(--sulAmericana);
}
@media screen and (max-width: 700px) {
  .teamTable{
    height: 100vh;
    overflow: hidden;
  }
  .teamTable td {
    padding: 5px;
  }
}
</style>
