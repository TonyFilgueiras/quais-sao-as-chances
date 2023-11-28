<template>
  <HeaderBar />
  <HomeView />
</template>

<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import HomeView from "./views/HomeView.vue";
import HeaderBar from "./components/HeaderBar.vue";

export default {
  components: {
    HomeView,
    HeaderBar,
  },
};
</script>

<style>
:root {
  --champion: #00ff0088;
  --libertadores: #4444ff88;
  --preLibertadores: #44ffff88;
  --sulAmericana: #ffff0088;
  --neutro: #eeeeee88;
  --rebaixamento: #ff000088;
  --brasileiraoBlue: #004498;
  --brasileiraoGold: #bfa706;
  --brasileiraoSilver: #a5a4a9;
}
</style>
