<template>
  <div :class="['menuSidebar', { sidebarHidden: !showMenuSidebar }]">
    <StandardButton text="X" @click="closeMenuSidebar" />
    <!-- <ul> -->
      <!-- <li id="leagues">Ligas -->
        <ul class="leaguesContainer" ref="leaguesContainer">
          <li v-for="league in leagues" class="league" :key="league.name" @click="changeLeague(league)">
            <img :src="league.img">
            {{ league.name }}
          </li>
        </ul>
      <!-- </li> -->
    <!-- </ul> -->
  </div>
</template>
<script lang="ts">
import api from "@/services/fetchData";
import StandardButton from "./StandardButton.vue";
import { useLeagueChosenStore } from "@/stores/leagueChosen";
import type ILeaguesAvailable from "@/interfaces/ILeaguesAvailable"

export default {
  setup() {
    const leagueChosenStore = useLeagueChosenStore();

    return { leagueChosenStore, };
  },
  props: {
    showMenuSidebar: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      leagues: [] as ILeaguesAvailable[]
    }
  },
  mounted () {
    this.fetchLeagues();
  },
  methods: {
    closeMenuSidebar() {
      this.$emit("close");
    },
    changeLeague(league: ILeaguesAvailable) {
      this.leagueChosenStore.chooseLeague(league.country, league.division)
      this.closeMenuSidebar()
    },
    async fetchLeagues() {
      try {
        const resp = await api.getLeaguesAvailable();
        this.leagues = resp;
      } catch (err: any) {
        this.$router.push("/error");
      }
    }
  },
  components: { StandardButton },
};
</script>

<style scoped>
div {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 400px;
  background-color: var(--brasileiraoBlue);
  box-shadow: 1px 0 100px 0 black;
  transition: 0.3s;
  z-index: 999;
}
button {
  margin: 10px 0 20px 10px;
}
li {
  width: 100%;
  padding: 20px 10px;
  transition: 0.5s;
}
li:hover {
  cursor: pointer;
  background-color: #ffffff88;
}

img{
  height: 25px;
  margin: 10px;
}

.league{
  display: flex;
  align-items: center;
}

/* .leaguesContainer {
  display: none;
  margin-left: -10px;
  margin-top: 20px;
  transform-origin: top;
  transform: scaleY(0.1);
  width: 100%;
  position: absolute;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  z-index: 1;
  opacity: 0;
} */

/* Style for the parent list item */
#leagues {
  position: relative;
}

/* Show dropdown when hover over parent list item */
#leagues:hover .leaguesContainer {
  display: block;
  animation: showContent 0.5s ease forwards;
}
#leagues:hover + li{
  margin-top: 250px;
}



.sidebarHidden {
  transform: translateX(-150%);
}

@media screen and (max-width: 400px) {
  div {
    width: 200px;
  }
}
</style>
@/services/fetchData