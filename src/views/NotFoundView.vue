<template>
  <div>
    <h1>Ops... Não achamos a liga que você queria</h1>
    <h2>Aqui estão as ligas que temos disponiveis</h2>
  </div>
</template>
<script lang="ts">
import { useLeagueChosenStore } from '@/stores/leagueChosen';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const leagueChosenStore = useLeagueChosenStore()
    const {countryChosen,divisionChosen} = storeToRefs(leagueChosenStore)
    return {countryChosen,divisionChosen,leagueChosenStore}
  },
  watch: {
    divisionChosen() {
      this.$router.push(`/${this.countryChosen}/${this.divisionChosen}`);  
    }
  },
  mounted () {
    this.leagueChosenStore.chooseLeague('league', 'notfound')
  },
}
</script>
<style scoped>
 div{
  margin-top: 20px;
  text-align: center;
 }
 </style>