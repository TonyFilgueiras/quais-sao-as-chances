<template>
  <div class="homeView">
    <h1 v-if="error">{{ error }}</h1>
    <LoadingContainer v-if="loading" />
    <div class="mainContainer" v-else>
      <LeagueTableVue
        :table="displayTable"
        :chancesTable="chancesTable"
        :calculating="calculating"
        :num-outcomes="numOutcomes"
        :progress-bar="progressBar"
        :league-info="leagueInfo"
      />
      <FixturesContainerVue :fixtures="fixtures" @winnerSelected="updateFixtures" />
    </div>
  </div>
</template>

<script lang="ts">
import LeagueTableVue from "@/components/LeagueTable.vue";
import FixturesContainerVue from "@/components/FixturesContainer.vue";
import LoadingContainer from "@/components/LoadingContainer.vue";
import type IFixtures from "@/interfaces/IFixtures";
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import api from "@/services/api";
import { updateTable } from "@/services/calculatePossibilities";
import { useWinnersStore } from "@/stores/libertadoresSpot";
import { ref } from "vue";
import type ILeagueInfo from "@/interfaces/ILeagueInfo";
export default {
  setup() {
    const fixtures = ref<IFixtures[]>([]);
    const table = ref<ITable[]>([]);
    const displayTable = ref<ITable[]>([]);
    const leagueInfo = ref<ILeagueInfo>()

    function updateFixtures(updatedFixture: IFixtures) {
      fixtures.value = fixtures.value.map((fixture) => (fixture.id === updatedFixture.id ? { ...fixture, ...updatedFixture } : fixture));
      displayTable.value = updateTable(table.value, fixtures.value);
    }

    return {
      fixtures,
      updateFixtures,
      table,
      displayTable,
      leagueInfo
    };
  },
  data() {
    return {
      championships: [],
      loading: true,
      calculating: true,
      progressBar: 0,
      error: "",
      chancesTable: {} as IPositionChances,
      numOutcomes: 50000,
    };
  },
  watch: {
    displayTable() {
      this.updateWinnersTablePositions();
      this.calculateChances();
    },
  },
  async mounted() {
    this.fetchData();
    if (this.error) return;
    this.updateWinnersTablePositions();

    await this.calculateChances();
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.error = ''
      await this.fetchLeagueTable();
      this.displayTable = this.table;
      await this.fetchLeagueFixtures();
      await this.fetchLeagueInfo()
      this.loading = false;
    },
    async fetchLeagueTable() {
      try {
        const resp = await api.getLeagueTable();
        this.table = resp.data;
      } catch (err: any) {
        this.handleErrors();
      }
    },
    updateWinnersTablePositions() {
      const winnersStore = useWinnersStore();
      const libertadoresSpot = this.displayTable.find((team :ITable) => team.team_name === "Fluminense");
      const copaDoBrasilSpot = this.displayTable.find((team :ITable) => team.team_name === "Sao Paulo");
      winnersStore.updateWinnersTablePosition(libertadoresSpot!.position, copaDoBrasilSpot!.position);
      winnersStore.libertadoresSpots();
    },
    async fetchLeagueFixtures() {
      try {
        const resp = await api.getLeagueFixtures();
        this.fixtures = resp.data;
      } catch (err: any) {
        this.handleErrors();
      } 
    },
    async fetchLeagueInfo() {
      try {
        const resp = await api.getLeagueInfo();
        this.leagueInfo = resp.data
      } catch (err: any) {
        this.handleErrors();
      }
    },
    async calculateChances() {
      const worker = new Worker("/src/worker/worker.ts", { type: "module" });
      const winnersStore = useWinnersStore();
      this.calculating = true;
      const updatedFixtures = this.fixtures.filter((fixture) => !fixture.result);
      this.progressBar = 0;
      worker.onmessage = (message) => {
        if (message.data.type === "results") {
          this.chancesTable = message.data.results;
          this.calculating = false;
        } else if (message.data.type === "progress") {
          if (message.data.progress > this.progressBar) {
            this.progressBar = message.data.progress;
          }
        }
      };
      worker.onerror = () => {
        this.handleErrors();
        this.calculating = false;
      };
      const params = {
        type: "randomizeOutcome",
        payload: [JSON.stringify(updatedFixtures), JSON.stringify(this.displayTable), JSON.stringify(winnersStore), this.numOutcomes, false],
      };
      worker.postMessage(params);
    },
    handleErrors() {
      this.$router.push("/error");
    },
  },
  components: { LeagueTableVue, FixturesContainerVue, LoadingContainer },
};
</script>

<style scoped>
.mainContainer {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
@media screen and (max-width: 1450px) {
  .mainContainer {
    flex-direction: column;
  }
}
</style>
