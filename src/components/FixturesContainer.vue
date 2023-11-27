<template>
  <div class="fixturesContainer">
    <nav class="fixturesNavigation">
      <button @click="handleFixturesScroll(0)">esquerda</button>
      Rodada: {{ roundDisplay }}
      <button @click="handleFixturesScroll(1)">direita</button>
    </nav>
    <div class="fixture" v-for="fixture in filteredFixtures" :key="fixture.id">
      <h2>{{ fixture.date }}</h2>
      <div class="fixtureMatches">
        <div
          :class="['homeTeam', { winning: fixture.homeTeamWinning}, {winner: fixture.result === 'home' }, { losing: fixture.homeTeamLosing },{loser: fixture.result ==='away'}, { drawing: fixture.drawing  || fixture.result === 'draw' }]"
          @mouseover="hoverHomeTeam(fixture)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'home')"
        >
          <h2>{{ fixture.home_team }}</h2>
          <img :src="fixture.home_logo" :alt="fixture.home_team" />
        </div>
        <h2
          :class="['draw', { homeWinning: fixture.homeTeamWinning },{homeWon: fixture.result === 'home'}, { homeLosing: fixture.homeTeamLosing },{homeLost: fixture.result==='away'}, {drew: fixture.result === 'draw'}]"
          @mouseover="hoverDraw(fixture)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'draw')"
        >
          X
        </h2>
        <div
          :class="['awayTeam', { winning: fixture.awayTeamWinning}, {winner: fixture.result === 'away' }, { losing: fixture.awayTeamLosing },{loser: fixture.result ==='home'}, { drawing: fixture.drawing || fixture.result === 'draw' }]"
          @mouseover="hoverAwayTeam(fixture)"
          @mouseout="resetStyles(fixture)"
          @click="selectWinner(fixture, 'away')"
        >
          <img :src="fixture.away_logo" :alt="fixture.away_team" />
          <h2>{{ fixture.away_team }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type IFixtures from "@/interfaces/IFixtures";
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
      // this.$emit("winnerSelected", [this.fixtures])
      this.$emit("winnerSelected", fixture)
    },
    hoverHomeTeam(fixture: IFixtures) {
      if (!fixture.result) {
        fixture.homeTeamWinning = true;
        fixture.awayTeamLosing = true;
      }
    },
    hoverAwayTeam(fixture: IFixtures) {
      if (!fixture.result) {
        fixture.awayTeamWinning = true;
        fixture.homeTeamLosing = true;
        
      }

    },
    hoverDraw(fixture: IFixtures) {
      if (!fixture.result) {
        fixture.drawing = true;
      }
    },
    resetStyles(fixture: IFixtures) {
      if (!fixture.result) {
        fixture.drawing = false;
        fixture.homeTeamWinning = false;
        fixture.homeTeamLosing = false;
        fixture.awayTeamWinning = false;
        fixture.awayTeamLosing = false;
      }
    },
  },
  computed: {
    filteredFixtures() {
      return this.fixtures.filter((fixture) => fixture.round === this.roundDisplay);
    },
  },
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
  margin-top: 20px;
  overflow: hidden;
}
.fixturesContainer nav {
  padding: 5px 0;
  display: flex;
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
  min-width: 200px;
  padding: 18px 0;
  text-align: center;
  transition: 0.5s;
}
.winning {
  cursor: pointer;
  background-color: #00ff0088;
}
.losing {
  cursor: pointer;
  background-color: #ff000088;
}
.winner{
  cursor: pointer;
  background-color: #008f0088;
}
.loser{
  cursor: pointer;
  background-color: #8a000088;
}
.fixtureMatches {
  display: flex;
  justify-content: center;
}
.homeTeam {
  display: flex;
  justify-content: end;
}
.homeTeam:hover,
.awayTeam:hover {
  cursor: pointer;
  background-color: #00ff0088;
}
.draw {
  padding: 18px;
  transition: --myColor1 0.5s, --myColor2 0.5s;
  background: linear-gradient(120deg, var(--myColor1)50%, var(--myColor2)50%);
}
.homeWinning {
  --myColor1: #00ff0088;
  --myColor2: #ff000088;
}
.homeLosing {
  --myColor1: #ff000088;
  --myColor2: #00ff0088;
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
.drew{
  cursor: pointer;
  --myColor1: #eeff0088;
  --myColor2: #eeff0088;
  
}
</style>
