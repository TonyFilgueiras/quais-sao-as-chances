<template>
  <div :class="{leagueTable: !mobileStore.isMobile}">
    <CustomSelect  v-if="mobileStore.isMobile" class="tableSelect" @selectedOption="updateTableSelected" :table="[{label: 'Tabela', value: 'standings'}, {label: 'Chances', value: 'chances'}]" />
    <LeagueHeader  :leagueInfo="leagueInfo" />
    <table class="tableContainer">
      <StandingsTableVue :display="selectedTable === 'standings' || !mobileStore.isMobile" :table="table" />
      <ChancesTableVue :display="selectedTable === 'chances' || !mobileStore.isMobile" :table="table" :chances-table="chancesTable" :calculating="calculating" :num-outcomes="numOutcomes" :progress-bar="progressBar"/>
    </table>
  </div>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "../interfaces/ITable";
import { useWinnersStore } from "@/stores/winners";
import StandingsTableVue from "./StandingsTable.vue";
import ChancesTableVue from "./ChancesTable.vue";
import type { PropType } from "vue";
import { useIsMobileStore } from "@/stores/isMobile";
import LeagueHeader from "./LeagueHeader.vue";
import type ILeagueInfo from "@/interfaces/ILeagueInfo";
import CustomSelect from "./CustomSelect.vue";

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
    leagueInfo: {
      type: Object as PropType<ILeagueInfo>,
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
  methods: {
    updateTableSelected(table: string) {
      this.selectedTable = table
    }
  },
  components: { StandingsTableVue, ChancesTableVue, LeagueHeader, CustomSelect },
};
</script>

<style>
.tableSelect{
  margin: auto;
}
.leagueTable{
  box-shadow: 0px 0px 2px 0px black;
  width: fit-content;
}
.tableContainer {
  border: 1px solid var(--brasileiraoSilver);
  overflow-x: auto;
  display: flex;
  margin: auto;
  width: fit-content;
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
.promotion,
.libertadores {
  background-color: var(--libertadores);
}
.sulAmericana {
  background-color: var(--sulAmericana);
}
@media screen and (max-width: 1450px) {
  .leagueTable{
    margin: auto;
  }
}
@media screen and (max-width: 760px) {
  .teamTable{
    height: 100vh;
    overflow: hidden;
    width:100vw;
  }
  .teamTable td {
    padding: 5px 10px;
  }
  .teamTable th{
    height: 30px;
  }
}
</style>
