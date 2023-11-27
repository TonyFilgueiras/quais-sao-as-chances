<template>
  <table class="tableContainer">
    <StandingsTableVue :table="table" />
    <ChancesTableVue :table="table" :chances-table="chancesTable" :calculating="calculating" :num-outcomes="numOutcomes" />
  </table>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "../interfaces/ITable";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import StandingsTableVue from "./StandingsTable.vue";
import ChancesTableVue from "./ChancesTable.vue";
import type { PropType } from "vue";
export default {
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
    calculating: {
      type: Boolean,
      required: true,
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
    };
  },
  components: { StandingsTableVue, ChancesTableVue },
};
</script>

<style>
.tableContainer {
  display: flex;
  max-width: 100vw;
}
.teamTable {
  border-collapse: collapse;
  margin-top: 20px;
}
.teamTable tr {
  /* height: 50px; */
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}

.teamTable th,
.teamTable td {
  padding: 10px;
  text-align: center;
}

.teamTable th {
  background-color: #f2f2f2;
  table-layout: fixed;
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
  background-color: var(--champion); /* Apply your champion color */
  /* color: white;*/
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
</style>
