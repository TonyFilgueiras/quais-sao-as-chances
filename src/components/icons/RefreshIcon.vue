<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-refresh-cw"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
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
      default: "50px", // Default width
    },
  },
};
</script>

<style scoped>
svg {
  position: relative;
  top: 2px;
  width: auto; /* Adjust as needed */
  height: auto;
  transition: 0.3s;
  animation: rotate 1.5s ease-out infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(720deg);
  }
}
</style>
