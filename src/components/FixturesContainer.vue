<template>
  <div class="fixturesContainer" v-if="fixtures.length > 0">
    <nav class="fixturesNavigation">
      <ArrowIconVue
        :class="{ disabledArrow: isRoundMinimumBeingShown() }"
        @click="handleFixturesScroll(0)"
        width="40"
        color="var(--brasileiraoSilver)"
        :right="false"
      />
      Rodada: {{ roundDisplay }}
      <ArrowIconVue
        :class="{ disabledArrow: isRoundMaximumBeingShown() }"
        @click="handleFixturesScroll(1)"
        width="40"
        color="var(--brasileiraoSilver)"
        :right="true"
      />
    </nav>
    <div class="fixture" v-for="fixture in filteredFixtures" :key="fixture.id">
      <h2 :class="{ strikethrough: isPastFixture(fixture), liveGame: isGameLive(fixture) }">
        {{ formattedFixtureDate(fixture) }}
      </h2>
      <div class="fixtureMatches">
        <div
          :class="[
            'homeTeam',
            { winning: fixture.homeTeamWinning },
            { winner: fixture.result === 'home' },
            { losing: fixture.homeTeamLosing },
            { loser: fixture.result === 'away' },
            { drawing: fixture.drawing || fixture.result === 'draw' },
          ]"
          @mouseover="hoverTeam(fixture, true, false)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'home')"
        >
          <p :class="['status', { statusHiddenHome: !fixture.result }]">
            {{ fixture.result === "home" ? "V" : fixture.result === "draw" ? "E" : fixture.result === "away" ? "D" : "" }}
          </p>
          <div>
            <h2>{{ fixture.home_team }}</h2>
            <img class="team_logo" :src="fixture.home_logo" :alt="fixture.home_team" />
          </div>
        </div>
        <h2
          :class="[
            'draw',
            { homeWinning: fixture.homeTeamWinning },
            { homeWon: fixture.result === 'home' },
            { homeLosing: fixture.homeTeamLosing },
            { homeLost: fixture.result === 'away' },
            { drew: fixture.result === 'draw' },
          ]"
          @mouseover="hoverTeam(fixture, false, true)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'draw')"
        >
          X
        </h2>
        <div
          :class="[
            'awayTeam',
            { winning: fixture.awayTeamWinning },
            { winner: fixture.result === 'away' },
            { losing: fixture.awayTeamLosing },
            { loser: fixture.result === 'home' },
            { drawing: fixture.drawing || fixture.result === 'draw' },
          ]"
          @mouseover="hoverTeam(fixture, false, false)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'away')"
        >
          <div>
            <img class="team_logo" :src="fixture.away_logo" :alt="fixture.away_team" />
            <h2>{{ fixture.away_team }}</h2>
          </div>
          <p :class="['status', { statusHiddenAway: !fixture.result }]">
            {{ fixture.result === "away" ? "V" : fixture.result === "draw" ? "E" : fixture.result === "home" ? "D" : "" }}
          </p>
        </div>
        <!-- <input type="checkbox" name="fsda" id="fdsa"> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type IFixtures from "@/interfaces/IFixtures";
import ArrowIconVue from "./icons/ArrowIcon.vue";
import parseDate from "@/services/parseDate";

export default defineComponent({
  data() {
    return {
      loading: true,
      error: "",
      roundDisplay: 0,
      minRound: 0,
      maxRound: 0,
    };
  },
  props: {
    fixtures: {
      type: Array as PropType<IFixtures[]>,
      required: true,
    },
  },
  async mounted() {
    this.initializeRoundSettings();
  },
  methods: {
    initializeRoundSettings() {
      this.minRound = Math.min(...this.fixtures.map((fixture) => fixture.round));
      this.maxRound = Math.max(...this.fixtures.map((fixture) => fixture.round));

      const nextFixture = this.fixtures
        .filter((fixture) => fixture.status.includes("NS") || fixture.status.includes("H"))
        .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())[0];

      this.roundDisplay = nextFixture ? nextFixture.round : this.minRound;
    },
    handleFixturesScroll(direction: 0 | 1) {
      if (direction === 0 && this.roundDisplay > this.minRound) {
        do {
          this.roundDisplay--;
        } while (this.filteredFixtures.length === 0);
      } else if (direction === 1 && this.roundDisplay < this.maxRound) {
        do {
          this.roundDisplay++;
        } while (this.filteredFixtures.length === 0);
      }
    },
    selectWinner(fixture: IFixtures, winner: "draw" | "home" | "away") {
      fixture.result = winner;
      this.$emit("winnerSelected", fixture);
    },
    hoverTeam(fixture: IFixtures, home: boolean, draw: boolean) {
      fixture.homeTeamWinning = home && !draw;
      fixture.awayTeamLosing = home && !draw;
      fixture.awayTeamWinning = !home && !draw;
      fixture.homeTeamLosing = !home && !draw;
      fixture.drawing = draw;
    },
    resetStyles(fixture: IFixtures) {
      fixture.homeTeamWinning = fixture.homeTeamLosing = fixture.awayTeamWinning = fixture.awayTeamLosing = fixture.drawing = false;
    },
    isRoundMinimumBeingShown() {
      return this.roundDisplay <= this.minRound;
    },
    isRoundMaximumBeingShown() {
      return this.roundDisplay >= this.maxRound;
    },
    isPastFixture(fixture: IFixtures): boolean {
      return parseDate(fixture.date) < new Date() && fixture.status === "PST";
    },
    isGameLive(fixture: IFixtures) {
      return fixture.status.includes("LIVE") || fixture.status.includes("H");
    },
    formattedFixtureDate(fixture: IFixtures): string {
      if (this.isPastFixture(fixture)) {
        return `${fixture.date} (adiado)`;
      }
      return fixture.date;
    },
  },
  computed: {
    filteredFixtures() {
      return this.fixtures.filter((fixture) => fixture.round === this.roundDisplay);
    },
  },
  components: { ArrowIconVue },
});
</script>

<style scoped>
@property --myColor1 {
  syntax: "<color>";
  initial-value: #ffffff;
  inherits: false;
}

@property --myColor2 {
  syntax: "<color>";
  initial-value: #ffffff;
  inherits: false;
}
.fixturesContainer {
  overflow: hidden;
}
.fixturesContainer nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fixture {
  text-align: center;
  font-size: 0.7rem;
  border-collapse: collapse;
  border: 1px solid #ddd;
}
.fixtureMatches div {
  font-size: 0.7rem;
  display: flex;
  transition: 0.5s;
  align-items: center;
}
.fixtureMatches {
  display: flex;
  justify-content: center;
}
.team_logo {
  /* border: 1px solid lime; */
  margin: 0px 5px;
  height: 30px;
  width: 30px;
  object-fit: contain;
}
.homeTeam,
.awayTeam {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
}
.status {
  color: gray;
  font-size: 2rem;
  font-weight: bold;
  padding: 5px;
  transform: translateX(0px);
  transition: 0.3s;
}
.statusHiddenHome {
  transform: translateX(-20px);
}
.statusHiddenAway {
  transform: translateX(20px);
}
.draw {
  padding: 18px;
  transition: --myColor1 0.5s, --myColor2 0.5s;
  background: linear-gradient(120deg, var(--myColor1) 50%, var(--myColor2) 50%);
}
.winner {
  cursor: pointer;
  background-color: #008f0088;
}
.loser {
  cursor: pointer;
  background-color: #8a000088;
}
.homeWon {
  --myColor1: #008f0088;
  --myColor2: #8a000088;
}
.homeLost {
  --myColor1: #8a000088;
  --myColor2: #008f0088;
}
.draw:hover {
  cursor: pointer;
  --myColor1: #eeff0088;
  --myColor2: #eeff0088;
}
.drawing {
  cursor: pointer;
  background: #eeff0088;
}
.drew {
  cursor: pointer;
  --myColor1: #eeff0088;
  --myColor2: #eeff0088;
}
.winning {
  cursor: pointer;
  background-color: #00ff0088;
}
.losing {
  cursor: pointer;
  background-color: #ff000088;
}
.homeWinning {
  --myColor1: #00ff0088;
  --myColor2: #ff000088;
}
.homeLosing {
  --myColor1: #ff000088;
  --myColor2: #00ff0088;
}
.strikethrough {
  color: gray;
  text-decoration: line-through;
}
@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
}
.liveGame {
  position: relative;
}

.liveGame:after {
  border-radius: 5px;
  padding: 3px 6px;
  content: "ao vivo";
  margin-left: 5px;
  background: #ff0000;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  color: white;
  font-family: sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  animation: glow 1.5s infinite;
}
.disabledArrow {
  opacity: 0;
  &:hover {
    cursor: default;
  }
}
@media screen and (max-width: 700px) {
  .fixtureMatches div {
    font-size: 0.7rem;
    align-items: center;
  }
  img {
    height: 30px;
    width: auto;
  }
  .status {
    display: none;
  }
  .homeTeam,
  .awayTeam {
    min-width: 40vw;
  }
  .homeTeam {
    justify-content: end;
  }
}
</style>
