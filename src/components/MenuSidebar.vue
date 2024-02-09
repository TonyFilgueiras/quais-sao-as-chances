<template>
  <div :class="['menuSidebar', { sidebarHidden: !showMenuSidebar }]">
    <StandardButton text="X" @click="closeMenuSidebar" />
    <ul>
      <li v-for="league in leagues" :key="league.name" @click="leagueChosenStore.chooseLeague(league.country, league.division)">
        {{ league.name }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import api from "@/services/api";
import StandardButton from "./StandardButton.vue";
import { useLeagueChosenStore } from "@/stores/leagueChosen";
import type ILeaguesAvaiable from "@/interfaces/ILeaguesAvaiable"

export default {
  setup() {
    const leagueChosenStore = useLeagueChosenStore();
    return { leagueChosenStore };
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
      leagues: [] as ILeaguesAvaiable[]
    }
  },
  mounted () {
    this.fetchLeagues();
  },
  methods: {
    closeMenuSidebar() {
      this.$emit("close");
    },
    async fetchLeagues() {
      try {
        const resp = await api.getLeaguesAvaiable();
        this.leagues = resp.data;
      } catch (err: any) {
        this.handleErrors();
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
  transition: 0.2s;
}
li:hover {
  cursor: pointer;
  background-color: #ffffff88;
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
