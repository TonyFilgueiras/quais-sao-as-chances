<template>
  <HeaderBar />
  <router-view />
</template>

<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import HeaderBar from "./components/HeaderBar.vue";
import { useIsMobileStore } from "./stores/isMobile";

export default {
  components: {
    HeaderBar,
  },
  setup() {
    const mobileStore = useIsMobileStore();
    mobileStore.checkIfIsMolile();

    return{ mobileStore}
  },
  data() {
    return {
      screenWidth: window.innerWidth,
    };
  },
  mounted() {
    
    window.addEventListener("resize", this.handleResize);
  },
  watch: {
    screenWidth() {
      this.mobileStore.checkIfIsMolile();
    },
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
