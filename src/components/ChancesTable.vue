<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <table :class="['teamTable', { hidden: !display }]">
    <thead>
      <tr>
        <th v-if="display"><span id="champion">■</span>{{ mobileStore.isMobile ? "" : "Campeão" }}</th>
        <th v-if="display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieA'">
          <span id="libertadores">■</span>{{ mobileStore.isMobile ? "" : "Libertadores" }}
        </th>
        <th v-if="display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieB'">
          <span id="promotion">■</span>{{ mobileStore.isMobile ? "" : "Promoção" }}
        </th>
        <th v-if="display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieA'">
          <span id="sulamericana">■</span>{{ mobileStore.isMobile ? "" : "Sul Americana" }}
        </th>
        <th v-if="display && leagueChosenStore.countryChosen == 'england' && leagueChosenStore.divisionChosen == 'premier-league'">
          <span id="promotion">■</span>{{ mobileStore.isMobile ? "" : "Champions" }}
        </th>
        <th v-if="display && leagueChosenStore.countryChosen == 'england' && leagueChosenStore.divisionChosen == 'premier-league'">
          <span id="sulamericana">■</span>{{ mobileStore.isMobile ? "" : "Europa League" }}
        </th>
        <th v-if="display"><span id="rebaixamento">■</span>{{ mobileStore.isMobile ? "" : "Rebaixamento" }}</th>
      </tr>
    </thead>
    <td v-if="calculating && display" colspan="4" class="calculating">
      <div class="calculatingContainer">
        <h1><RefreshIcon :width="mobileStore.isMobile ? '15' : '25'" /> Calculando</h1>
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
          libertadores: competitionQualified(team) == 'libertadores',
          promotion: competitionQualified(team) == 'promotion',
          preLibertadores: competitionQualified(team) == 'preLibertadores',
          sulAmericana: competitionQualified(team) == 'sulAmericana',
          rebaixamento: competitionQualified(team) == 'relegation',
        }"
      >
        <td v-if="chancesTable.first && display">{{ Math.floor((chancesTable.first[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%</td>
        <td v-if="chancesTable.libertadores && display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieA'">
          {{ Math.floor((chancesTable.libertadores[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.promotion && display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieB'">
          {{ Math.floor((chancesTable.promotion[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.sulAmericana && display && leagueChosenStore.countryChosen == 'brazil' && leagueChosenStore.divisionChosen == 'serieA'">
          {{ Math.floor((chancesTable.sulAmericana[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.championsLeague && display && leagueChosenStore.countryChosen == 'england' && leagueChosenStore.divisionChosen == 'premier-league'">
          {{ Math.floor((chancesTable.championsLeague[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.europaLeague && display && leagueChosenStore.countryChosen == 'england' && leagueChosenStore.divisionChosen == 'premier-league'">
          {{ Math.floor((chancesTable.europaLeague[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
        <td v-if="chancesTable.relegation && display">
          {{ Math.floor((chancesTable.relegation[team.team_name] / numOutcomes) * 10000) / 100 || 0 }}%
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import { useWinnersStore } from "@/stores/winners";
import { defineComponent, type PropType } from "vue";
import RefreshIcon from "./icons/RefreshIcon.vue";
import { useIsMobileStore } from "@/stores/isMobile";
import checkCompetitionQualified from "@/services/checkCompetitionQualified";
import { useLeagueChosenStore } from "@/stores/leagueChosen";

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();
    const leagueChosenStore = useLeagueChosenStore();
    const mobileStore = useIsMobileStore();
    return { winnersStore, leagueChosenStore, mobileStore };
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
  computed: {
    competitionQualified() {
      return checkCompetitionQualified(this.leagueChosenStore, this.winnersStore, this.table);
    },
  },
  components: { RefreshIcon },
});
</script>

<style scoped>
#champion {
  color: var(--champion);
}
#promotion {
  color: var(--libertadores);
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
  font-family: "Playfair Display", Arial, Helvetica, sans-serif;
  margin: 30vh auto;
}
.progressBarContainer {
  height: 20px;
  width: 100%;
}
.progressBar {
  height: 100%;
  border-radius: 3px;
  background-color: var(--brasileiraoGold);
}
@media screen and (max-width: 300px) {
  .calculatingContainer {
    font-size: 5px;
  }
}
</style>
