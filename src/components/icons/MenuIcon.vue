<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :width="width"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </div>
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
div {
  transition: .3s;
  padding: 8px 10px;
  border-radius: 50px;
}
div:hover{
  cursor: pointer;
  background-color: #ffffff2f;
}
div:active{
  transform: scale(0.9);
}
</style>
