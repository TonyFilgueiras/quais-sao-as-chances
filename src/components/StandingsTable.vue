<template>
  <table class="teamTable">
    <thead>
      <tr>
        <th colspan="2">Time</th>
        <th>Pontos</th>
        <th :class="{hidden: !display}" v-if="display">Jogos</th>
        <th :class="{hidden: !display}" v-if="display">V</th>
        <th :class="{hidden: !display}" v-if="display">E</th>
        <th :class="{hidden: !display}" v-if="display">D</th>
        <th :class="{hidden: !display}" v-if="display">SG</th>
      </tr>
    </thead>
    <tbody>
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
        <td class="position">{{ team.position }}</td>
        <td class="teamName"><img v-if="!mobileStore.isMobile" :src="team.logo" alt="escudo" /> {{ team.team_name }}</td>
        <td class="points">{{ team.points }}</td>
        <td v-if="display" :class="['matches', {hidden: !display}]">{{ team.matches }}</td>
        <td :class="{hidden: !display}" v-if="display">{{ team.wins }}</td>
        <td :class="{hidden: !display}" v-if="display">{{ team.draws }}</td>
        <td :class="{hidden: !display}" v-if="display">{{ team.losses }}</td>
        <td :class="{hidden: !display}" v-if="display">{{ team.goal_difference }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type ITable from "@/interfaces/ITable";
import checkCompetitionQualified from "@/services/checkCompetitionQualified";
import { useIsMobileStore } from "@/stores/isMobile";
import { useLeagueChosenStore } from "@/stores/leagueChosen";
import { useWinnersStore } from "@/stores/winners";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  setup() {
    const winnersStore = useWinnersStore();
    const leagueChosenStore = useLeagueChosenStore()
    const mobileStore = useIsMobileStore();

    return { winnersStore,leagueChosenStore, mobileStore };
  },
  props: {
    table: {
      type: Array as PropType<ITable[]>,
      required: true,
    },
    display: {
      type: Boolean,
    }
  },
  computed: {
    competitionQualified() {
      return checkCompetitionQualified(this.leagueChosenStore, this.winnersStore, this.table)
    }
  },
});
</script>@/stores/winners