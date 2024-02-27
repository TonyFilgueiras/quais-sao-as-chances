<template>
  <div class="homeView">
    <h1 v-if="error">{{ error }}</h1>
    <LoadingContainer v-if="loading" />
    <div v-else>
      <!-- <FilterNav v-if="fixtures.length > 0" /> -->
        <WarningBox v-if="fixtures.length == 0" warning-text="Campeonato encerrado"/>
      <div class="mainContainer">
        <LeagueTableVue
          :table="displayTable"
          :chancesTable="chancesTable"
          :calculating="calculating"
          :num-outcomes="numOutcomes"
          :progress-bar="progressBar"
          :league-info="leagueInfo!"
        />
        <FixturesContainerVue :fixtures="fixtures" @winnerSelected="updateFixtures" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LeagueTableVue from "@/components/LeagueTable.vue";
import { storeToRefs } from "pinia";
import FixturesContainerVue from "@/components/FixturesContainer.vue";
import LoadingContainer from "@/components/LoadingContainer.vue";
import type IFixtures from "@/interfaces/IFixtures";
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import api from "@/services/api";
import { updateTable } from "@/services/calculatePossibilities";
import { useWinnersStore } from "@/stores/winners";
import { type Countries, useLeagueChosenStore } from "@/stores/leagueChosen";
import { ref } from "vue";
import type ILeagueInfo from "@/interfaces/ILeagueInfo";
// import FilterNav from "@/components/FilterNav.vue";
import WarningBox from "@/components/WarningBox.vue";
export default {
  setup() {
    const fixtures = ref<IFixtures[]>([]);
    const table = ref<ITable[]>([]);
    const displayTable = ref<ITable[]>([]);
    const leagueInfo = ref<ILeagueInfo>();
    const leagueChosenStore = useLeagueChosenStore();
    const { countryChosen, divisionChosen } = storeToRefs(leagueChosenStore);

    function updateFixtures(updatedFixture: IFixtures) {
      fixtures.value = fixtures.value.map((fixture) => (fixture.id === updatedFixture.id ? { ...fixture, ...updatedFixture } : fixture));
      displayTable.value = updateTable(table.value, fixtures.value);
    }

    return {
      fixtures,
      updateFixtures,
      table,
      displayTable,
      leagueInfo,
      countryChosen,
      divisionChosen,
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
    async divisionChosen() {
      this.$router.push(`/${this.countryChosen}/${this.divisionChosen}`);
      await this.fetchData();
      this.calculateChances()
    },
  },
  async mounted() {
    await this.fetchData();
    if (this.error) return;
    this.updateWinnersTablePositions();

    await this.calculateChances();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = "";
      await this.fetchLeagueTable(this.countryChosen, this.divisionChosen);
      this.displayTable = this.table;
      await this.fetchLeagueFixtures(this.countryChosen, this.divisionChosen);
      await this.fetchLeagueInfo(this.countryChosen, this.divisionChosen);
      this.loading = false;
    },
    async fetchLeagueTable(country: Countries, division: String) {
      try {
        const resp = await api.getLeagueTable(country, division);
        this.table = resp.data;
        console.log("this.table")
        console.log(this.table)
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    async fetchLeagueFixtures(country: Countries, division: String) {
      try {
        const resp = await api.getLeagueFixtures(country, division);
        this.fixtures = resp.data;
        console.log("this.fixtures")
        console.log(this.fixtures)
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    async fetchLeagueInfo(country: Countries, division: String) {
      try {
        const resp = await api.getLeagueInfo(country, division);
        this.leagueInfo = resp.data;
        console.log("this.leagueInfo")
        console.log(this.leagueInfo)
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    updateWinnersTablePositions() {
      const winnersStore = useWinnersStore();
      try {
        const libertadoresSpot = this.displayTable.find((team: ITable) => team.team_name === winnersStore.brazil.libertadoresWinner);
        const copaDoBrasilSpot = this.displayTable.find((team: ITable) => team.team_name === winnersStore.brazil.copaDoBrasilWinner);
        const FACupSpot = this.displayTable.find((team: ITable) => team.team_name === winnersStore.england.FACupWinner);

        let libertadoresPosition = 20;
        let copaDoBrasilPosition = 20;
        let FACupPosition = 20;
        if (libertadoresSpot) {
          libertadoresPosition = libertadoresSpot.position;
        }
        if (copaDoBrasilSpot) {
          copaDoBrasilPosition = copaDoBrasilSpot.position;
        }
        if (FACupSpot) {
          FACupPosition = FACupSpot.position;
        }
        winnersStore.updateWinnersTablePosition(libertadoresPosition, copaDoBrasilPosition, FACupPosition);
        winnersStore.libertadoresSpots();
      } catch (err) {
        this.handleErrors(err);
      }
    },
    async calculateChances() {
      const worker = new Worker(new URL("../worker", import.meta.url), { type: "module" });
      const winnersStore = useWinnersStore();
      const copaDoBrasilWinner = winnersStore.brazil.copaDoBrasilWinner;
      const libertadoresWinner = winnersStore.brazil.libertadoresWinner;
      const FACupWinner = winnersStore.england.FACupWinner
      
      const preLibertadoresSpot = winnersStore.brazil.serieA.preLibertadoresSpot;
      const sulAmericanaSpot = winnersStore.brazil.serieA.sulAmericanaSpot;
      const championsSpot = winnersStore.england.premierLeague.championsSpot
      const europaSpot = winnersStore.england.premierLeague.europaSpot

      this.calculating = true;

      if (this.fixtures.length > 300) {
        this.numOutcomes = 10000
      }
      let updatedFixtures: IFixtures[] = []
      if (this.fixtures.length > 0) {
        updatedFixtures = this.fixtures.filter((fixture: IFixtures) => !fixture.result);
      }
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
        this.handleErrors("error no worker");
        this.calculating = false;
      };
      const params = {
        type: "randomizeOutcome",
        payload: [
          JSON.stringify(updatedFixtures),
          JSON.stringify(this.displayTable),
          copaDoBrasilWinner,
          libertadoresWinner,
          FACupWinner,
          preLibertadoresSpot,
          sulAmericanaSpot,
          championsSpot,
          europaSpot,
          this.countryChosen,
          this.divisionChosen,
          this.numOutcomes,
          false,
        ],
      };
      worker.postMessage(params);
    },
    handleErrors(err: any) {
      console.log(err)
      this.$router.push("/error");
    },
  },
  components: { LeagueTableVue, FixturesContainerVue, LoadingContainer,  WarningBox },
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
