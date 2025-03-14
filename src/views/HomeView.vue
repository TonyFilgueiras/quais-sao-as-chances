<template>
  <div class="homeView">
    <h1 v-if="error">{{ error }}</h1>
    <LoadingContainer v-if="loading" />
    <div v-else>
      <FiltersDiv
        v-if="fixtures.length > 0"
        :table="displayTable"
        :fixtures="fixtures"
        @filterApplied="updateTeamFixtures"
        @filterCleared="clearFixturesFilters"
      />
      <WarningBox v-if="fixtures.length == 0" warning-text="Campeonato encerrado" />
      <!-- <WarningBox warning-text="Site não sendo mais atualizado!! 04/07" /> -->
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
import { fetchChampionshipFixtures, fetchChampionshipStandings, getCupWinner, fetchChampionships, getLibertadoresWinner } from "@/services/api";
import { updateTable } from "@/services/calculatePossibilities";
import { useWinnersStore } from "@/stores/winners";
import { type Countries, useLeagueChosenStore } from "@/stores/leagueChosen";
import { ref } from "vue";
import type ILeagueInfo from "@/interfaces/ILeagueInfo";
import FiltersDiv from "@/components/FiltersDiv.vue";
import WarningBox from "@/components/WarningBox.vue";
import updateTeamFixturesService from "@/services/updateTeamFixtures";

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
    function updateTeamFixtures(team: ITable, option: string) {
      fixtures.value = updateTeamFixturesService(team, option, fixtures.value);
      displayTable.value = updateTable(table.value, fixtures.value);
    }
    function clearFixturesFilters() {
      fixtures.value.forEach((fixture) => {
        if (fixture !== null && fixture !== undefined && fixture.status !== "FT" && !fixture.status.includes("H")) {
          fixture.home_score = null;
          fixture.away_score = null;
          delete fixture.result;
        }
      });

      displayTable.value = updateTable(table.value, fixtures.value);
    }

    return {
      fixtures,
      updateFixtures,
      updateTeamFixtures,
      clearFixturesFilters,
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
      season: 0,
      progressBar: 0,
      error: "",
      chancesTable: {} as IPositionChances,
      numOutcomes: 50000,
      worker: null as Worker | null,
    };
  },
  watch: {
    async divisionChosen() {
      this.$router.push(`/${this.countryChosen}/${this.divisionChosen}`);
      await this.fetchData();
      this.calculateChances();
    },
    displayTable() {
      this.updateWinnersTablePositions();
      this.calculateChances();
    },
  },
  async mounted() {
    await this.fetchData();
    if (this.error) return;
    this.updateWinnersTablePositions();

    await this.calculateChances();
    this.displayTable = updateTable(this.table, this.fixtures);
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = "";
      await this.getCurrentSeason(this.countryChosen, this.divisionChosen);
      await this.assingCupWinners(this.countryChosen, this.season);
      await this.fetchLeagueTable(this.countryChosen, this.divisionChosen, this.season);
      this.displayTable = this.table;
      await this.fetchLeagueFixtures(this.countryChosen, this.divisionChosen, this.season);
      this.loading = false;
    },
    async getCurrentSeason(country: Countries, division: string) {
      try {
        const response = await fetchChampionships(country, division);
        this.season = response.seasons[0].year;
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    async assingCupWinners(country: Countries, season: number) {
      try {
        const winnersStore = useWinnersStore()
        const cupWinner = await getCupWinner(country, season);
        const libertadoresWinner = await getLibertadoresWinner(country, season);
        winnersStore.setWinners(libertadoresWinner, cupWinner,country)

      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    async fetchLeagueTable(country: Countries, division: string, season: number) {
      try {
        // const resp = await api.getLeagueTable(country, division);
        const { leagueInfo, standingsTable } = await fetchChampionshipStandings(country, division,season);
        this.table = standingsTable;
        this.leagueInfo = leagueInfo;
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    async fetchLeagueFixtures(country: Countries, division: string,season:number) {
      try {
        const resp = await fetchChampionshipFixtures(country, division, season);
        this.fixtures = resp;
      } catch (err: any) {
        this.handleErrors(err);
      }
    },
    updateWinnersTablePositions() {
      const winnersStore = useWinnersStore();
      try {
        const libertadoresSpot = this.displayTable.find((team: ITable) => team.id === winnersStore.brazil.libertadoresWinner);
        const copaDoBrasilSpot = this.displayTable.find((team: ITable) => team.id === winnersStore.brazil.copaDoBrasilWinner);
        const FACupSpot = this.displayTable.find((team: ITable) => team.id === winnersStore.england.FACupWinner);

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
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      if (!this.worker) {
        this.worker = new Worker(new URL("../worker", import.meta.url), { type: "module" });
      }

      const winnersStore = useWinnersStore();
      const copaDoBrasilWinner = winnersStore.brazil.copaDoBrasilWinner;
      const libertadoresWinner = winnersStore.brazil.libertadoresWinner;
      const FACupWinner = winnersStore.england.FACupWinner;

      const preLibertadoresSpot = winnersStore.brazil.serieA.preLibertadoresSpot;
      const sulAmericanaSpot = winnersStore.brazil.serieA.sulAmericanaSpot;
      const championsSpot = winnersStore.england.premier.championsSpot;
      const europaSpot = winnersStore.england.premier.europaSpot;

      this.calculating = true;

      const undefinedResults = this.fixtures.filter((fixture) => fixture.result === undefined);

      if (undefinedResults.length > 300) {
        this.numOutcomes = 10000;
      } else if (undefinedResults.length > 200) {
        this.numOutcomes = 25000;
      } else {
        this.numOutcomes = 50000;
      }

      let updatedFixtures: IFixtures[] = [];
      if (this.fixtures.length > 0) {
        updatedFixtures = this.fixtures.filter((fixture: IFixtures) => !fixture.result);
      }
      this.progressBar = 0;
      this.worker!.onmessage = (message: MessageEvent<any>) => {
        if (message.data.type === "results") {
          this.chancesTable = message.data.results;
          this.calculating = false;
        } else if (message.data.type === "progress") {
          if (message.data.progress > this.progressBar) {
            this.progressBar = message.data.progress;
          }
        }
      };
      this.worker!.onerror = () => {
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
      this.worker!.postMessage(params);
    },
    handleErrors(err: any) {
      console.log(err);
      this.$router.push("/error");
    },
  },
  components: { LeagueTableVue, FixturesContainerVue, LoadingContainer, WarningBox, FiltersDiv },
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
