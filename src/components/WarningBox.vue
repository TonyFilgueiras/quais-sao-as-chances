<template>
  <div>
    <h2>{{warningText}}</h2>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    warningText: {
      type: String, 
    },
  },
}
</script>
<style scoped>
  div{
    background-color: var(--sulAmericana);
  }
</style>