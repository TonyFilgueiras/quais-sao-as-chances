<template>
  <div>
    <img src="@/assets/work-in-progress.png" alt="Brasileirao" title="Brasileirao" />
    <h1>Ops... Parece que estamos com problemas no nosso site</h1>
    <h1>Estamos trabalhando o mais rapido possivel para concertar isso!</h1>
    <StandardButton text="Refrescar" @click="$router.push('/')"/>
  </div>
</template>
<script lang="ts">
import StandardButton from '@/components/StandardButton.vue';
import { useLeagueChosenStore } from '@/stores/leagueChosen';
import {storeToRefs} from "pinia"
export default {
  setup() {
    const leagueChosenStore = useLeagueChosenStore()
    const {leagueChosen} = storeToRefs(leagueChosenStore)

    return {leagueChosen}
  },
  watch: {
    leagueChosen() {
      this.$router.push("/")
    }
  },
  components: {
    StandardButton,
  },
};
</script>
<style scoped>
div {
  text-align: center;
  margin-top: 20px;
}
button{
  margin-top: 20px;
}
</style>
