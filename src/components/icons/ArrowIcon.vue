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
    :class="right ? 'feather feather-chevron-right' : 'feather feather-chevron-left'"
  >
    <polyline :points="right? '9 18 15 12 9 6':'15 18 9 12 15 6'"></polyline>
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
    right: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
svg {
  width: auto; /* Adjust as needed */
  height: auto;
  transition: 0.3s;
  padding: 1px;
  border-radius: 50px;
}
svg:hover {
  cursor: pointer;
}
svg:active{
  transform: scale(0.8);
}
</style>
