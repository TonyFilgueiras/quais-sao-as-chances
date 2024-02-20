<template>
  <div>
    <AlertIcon width="50px" :style="'margin-right: 20px'"/>
    <h2>{{warningText}}</h2>
  </div>
</template>
<script lang="ts">
import AlertIcon from './icons/AlertIcon.vue';

export default {
    props: {
        warningText: {
            type: String,
        },
    },
    components: { AlertIcon }
}
</script>
<style scoped>
  div{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sulAmericana);
    width: fit-content;
    padding: 10px 20px;
    max-width: 80vw;
    margin: 10px auto;
    color: var(--warning);
    border: 1px solid var(--warning);
  }
</style>