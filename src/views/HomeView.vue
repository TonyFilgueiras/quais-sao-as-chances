<template>
  <div class="homeView">
    <h1 v-if="error">{{ error }}</h1>
    <h1 v-if="loading">Carregando</h1>
    <div class="mainContainer" v-else>
      <ChampionshipTableVue :table="displayTable" :chancesTable="chancesTable" :calculating="calculating" :num-outcomes="numOutcomes" />
      <FixturesContainerVue :fixtures="fixtures" @winnerSelected="updateFixtures" />
    </div>
  </div>
</template>

<script lang="ts">
import ChampionshipTableVue from "@/components/ChampionshipTable.vue";
import FixturesContainerVue from "@/components/FixturesContainer.vue";
import type IFixtures from "@/interfaces/IFixtures";
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import api from "@/services/api";
import { updateTable } from "@/services/calculatePossibilities";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { ref } from "vue";
export default {
  setup() {

    const fixtures = ref<IFixtures[]>([]); // assuming you have a ref for fixtures
    const table = ref<ITable[]>([]); // assuming you have a ref for fixtures
    const displayTable = ref<ITable[]>([]); // assuming you have a ref for fixtures

    function updateFixtures(updatedFixture: IFixtures) {
      fixtures.value = fixtures.value.map((fixture) => (fixture.id === updatedFixture.id ? { ...fixture, ...updatedFixture } : fixture));
      displayTable.value = updateTable(table.value, fixtures.value);
    }
    
    return {
      fixtures,
      updateFixtures,
      table,
      displayTable,
      // other properties and methods
    };
  },
  data() {
    return {
      championships: [],
      loading: true,
      calculating: true,
      error: "",
      chancesTable: {} as IPositionChances,
      numOutcomes: 5000,
    };
  },
  watch: {
    displayTable() {
      console.log("ads")
      this.calculateChances();
    },
  },
  async mounted() {
    await this.fetchChampionshipTable();
    this.displayTable = this.table;
    await this.fetchChampionshipFixtures();
    this.updateWinnersTablePositions();
    
    await this.calculateChances();
  },
  methods: {
    async fetchChampionshipTable() {
      this.loading = true;
      this.error = "";
      try {
        const resp = await api.getChampionshipTable();
        this.table = resp.data;
      } catch (err: any) {
        this.error = err.message as string;
      } finally {
        this.loading = false;
      }
    },
    updateWinnersTablePositions() {
      const winnersStore = useWinnersStore();
      const libertadoresSpot = this.table.find((team) => team.team_name === "Fluminense");
      const copaDoBrasilSpot = this.table.find((team) => team.team_name === "Sao Paulo");
      winnersStore.updateWinnersTablePosition(libertadoresSpot!.position, copaDoBrasilSpot!.position);
      winnersStore.libertadoresSpots();
    },
    async fetchChampionshipFixtures() {
      this.loading = true;
      this.error = "";
      try {
        const resp = await api.getChampionshipFixtures();
        this.fixtures = resp.data;
      } catch (err: any) {
        this.error = err.message as string;
      } finally {
        this.loading = false;
      }
    },
    async calculateChances() {
      const worker = new Worker("src/worker/worker.ts", { type: 'module' })
      const winnersStore = useWinnersStore();
      this.calculating = true;
      const updatedFixtures = this.fixtures.filter((fixture) => !fixture.result);
      const params = {type:'randomizeOutcome', payload: [JSON.stringify(updatedFixtures), JSON.stringify(this.displayTable), JSON.stringify(winnersStore),this.numOutcomes, false]}
      worker.postMessage(params);
      // this.chancesTable = await worker.randomizeOutcome(updatedFixtures, this.displayTable, this.numOutcomes, false);
      console.log(worker)
      worker.onmessage = (message)=>{
        this.chancesTable=message.data
      }

      this.calculating = false;
    },
  },
  components: { ChampionshipTableVue, FixturesContainerVue },
};
</script>

<style scoped>
.mainContainer {
  display: flex;
}
.homeView {
  width: fit-content;
  margin: auto;
}
</style>