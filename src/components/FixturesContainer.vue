<template>
  <div class="fixturesContainer" v-if="fixtures.length > 0">
    <nav class="fixturesNavigation">
      <ArrowIconVue @click="handleFixturesScroll(0)" width="40" color="var(--brasileiraoSilver)" :right="false" />
      Rodada: {{ roundDisplay }}
      <ArrowIconVue @click="handleFixturesScroll(1)" width="40" color="var(--brasileiraoSilver)" :right="true" />
    </nav>
    <div class="fixture" v-for="fixture in filteredFixtures" :key="fixture.id">
      <h2 :class="{ strikethrough: isPastFixture(fixture.date) }">
        {{ formattedFixtureDate(fixture.date) }}
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
          @mouseover="hoverHomeTeam(fixture)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'home')"
        >
          <p :class="['status', { statusHiddenHome: !fixture.result }]">
            {{ fixture.result === "home" ? "V" : fixture.result === "draw" ? "E" : fixture.result === "away" ? "D" : "" }}
          </p>
          <div>
            <h2>{{ fixture.home_team }}</h2>
            <img :src="fixture.home_logo" :alt="fixture.home_team" />
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
          @mouseover="hoverDraw(fixture)"
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
          @mouseover="hoverAwayTeam(fixture)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'away')"
        >
          <div>
            <img :src="fixture.away_logo" :alt="fixture.away_team" />
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
    this.settingGroundRound();
  },
  methods: {
    settingGroundRound() {
      this.minRound = Math.min(...this.fixtures.map((fixture) => fixture.round));
      this.maxRound = Math.max(...this.fixtures.map((fixture) => fixture.round));
      this.roundDisplay = this.minRound;
    },
    handleFixturesScroll(direction: 0 | 1) {
      switch (direction) {
        case 0:
          if (this.roundDisplay > this.minRound) {
            do {
              this.roundDisplay--;
            } while (this.filteredFixtures.length === 0);
          }
          break;
        case 1:
          if (this.roundDisplay < this.maxRound) {
            do {
              this.roundDisplay++;
            } while (this.filteredFixtures.length === 0);
          }
          break;
        default:
          break;
      }
    },
    selectWinner(fixture: IFixtures, winner: "draw" | "home" | "away") {
      fixture.result = winner;
      this.$emit("winnerSelected", fixture);
    },
    hoverHomeTeam(fixture: IFixtures) {
      fixture.homeTeamWinning = true;
      fixture.awayTeamLosing = true;
    },
    hoverAwayTeam(fixture: IFixtures) {
      fixture.awayTeamWinning = true;
      fixture.homeTeamLosing = true;
    },
    hoverDraw(fixture: IFixtures) {
      fixture.drawing = true;
      fixture.homeTeamWinning = false;
      fixture.homeTeamLosing = false;
      fixture.awayTeamWinning = false;
      fixture.awayTeamLosing = false;
    },
    resetStyles(fixture: IFixtures) {
      fixture.drawing = false;
      fixture.homeTeamWinning = false;
      fixture.homeTeamLosing = false;
      fixture.awayTeamWinning = false;
      fixture.awayTeamLosing = false;
    },
    isPastFixture(date: string): boolean {
      // Split the date string into its components
      const [dayMonthYear, time] = date.split(" ");
      const [day, month, year] = dayMonthYear.split("/").map(Number);
      const [hours, minutes] = time.split(":").map(Number);

      // Handle two-digit years by converting to four digits
      const fullYear = year < 100 ? 2000 + year : year;

      // Create a new Date object with the parsed values
      const fixtureDate = new Date(fullYear, month - 1, day, hours, minutes);

      const today = new Date();

      // Compare the fixture date with today's date
      return fixtureDate < today;
    },
    formattedFixtureDate(date: string): string {
      if (this.isPastFixture(date)) {
        return `${date} (adiado)`;
      }
      return date;
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
  font-size: 1rem;
  display: flex;
  transition: 0.5s;
  align-items: center;
}
.fixtureMatches {
  display: flex;
  justify-content: center;
}
img {
  height: 30px;
  width: auto;
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
