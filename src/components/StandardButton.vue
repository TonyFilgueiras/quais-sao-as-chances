<template>
  <button>{{ text }}</button>
</template>
<script lang="ts">
export default {
  props: {
    text: {
      type: String,
    },
  },
}
</script>
<style scoped>
button {
  background-color: var(--brasileiraoBlue);
  border: solid transparent;
  border-radius: 3px;
  border-width: 0 2px 4px 0;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: .8px;
  line-height: 20px;
  outline: none;
  padding: 10px 20px;
  text-align: center;
  text-transform: uppercase;
  transform: translateZ(0);
  transition: .2s;
}

button:after {
  background-clip: padding-box;
  background-color: var(--brasileiraoLightBlue);
  border: solid transparent;
  border-radius: 3px;
  border-width: 0 2px 4px 0;
  bottom: -4px;
  content: "";
  left: 0px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

button:hover {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

button:active {
  border-width: 4px 0px 0px 4px;
  background: none;
}
</style>