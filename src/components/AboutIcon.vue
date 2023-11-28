<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="transparent"
    :stroke="color"
    :width="width"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-help-circle"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
    <title>Sobre</title>
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    color: {
      type: String,
      default: "white",
    },
    width: {
      type: String, // Change the type based on your use case (Number, String, etc.)
      default: "100px", // Default width
    },
  },
};
</script>

<style scoped>
svg {
  width: auto; /* Adjust as needed */
  height: auto;
  transition: .3s;
  padding: 10px;
  border-radius: 50px;
}
svg:hover{
  cursor: pointer;
  transform: scale(1.1);
}
</style>