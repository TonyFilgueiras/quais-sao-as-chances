<template>
  <header>
    <div>
      <img :src="leagueInfo.logo" alt="logo">
      <h1>{{ leagueInfo.name }}</h1>
    </div>
    <div>
      <h1>{{leagueInfo.year}}</h1>
    </div>
  </header>
</template>
<script lang="ts">
import type ILeagueInfo from '@/interfaces/ILeagueInfo';
import { type PropType } from 'vue';

export default {
  props: {
    leagueInfo: {
      type: Object as PropType<ILeagueInfo>,
      required: true,
    },
  },
};
</script>
<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--brasileiraoBlue);
  color: white;
  padding: 10px 20px;
  font-size: clamp(0.5rem, 2vw, 1rem);
}
div{
  display: flex;
  align-items: center;
}
img{
  max-height: 50px;
  max-width: 50px;
  width: 10vw;
  margin-right: 20px;
}
</style>
