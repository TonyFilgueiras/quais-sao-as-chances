<template>
  <header>
    <h1>Quais são as chances</h1>
    <!-- <MenuIcon color="white" width="30"/> -->
    <img v-if="!mobileStore.isMobile" src="@/assets/brasileirao-logo.png" alt="Brasileirao" title="Brasileirao" />
    <AboutIcon width="30" @click="toggleAboutModel" />
    <AboutModel :show-about-model="showAboutModel" @close="closeAboutModel"/>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AboutIcon from "./icons/AboutIcon.vue";
import AboutModel from "./AboutModel.vue";
import { useIsMobileStore } from "@/stores/isMobile";
// import MenuIcon from './MenuIcon.vue';

export default defineComponent({
  setup() {
    const mobileStore = useIsMobileStore()

    return {mobileStore}
  },
  data() {
    return {
      showAboutModel: false,
    };
  },
  methods: {
    toggleAboutModel() {
      this.showAboutModel = !this.showAboutModel;
    },
    closeAboutModel() {
      this.showAboutModel = false;
    },
    handleDocumentClick(event: MouseEvent) {
      if (this.showAboutModel && !this.$el.contains(event.target)) {
        this.closeAboutModel();
      }
    },
  },
  mounted() {
    // Add a click event listener on the entire document
    document.addEventListener("click", this.handleDocumentClick);
  },
  beforeUnmount() {
    // Remove the click event listener when the component is destroyed
    document.removeEventListener("click", this.handleDocumentClick);
  },
  components: { AboutIcon, AboutModel },
});
</script>

<style scoped>
header {
  background: var(--brasileiraoBlue);
  color: white;
  padding: 10px 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  font-size: clamp(0.9rem, 4vw, 1.5rem);
  font-family: "Playfair Display", Arial, Helvetica, sans-serif;
  font-weight: bold;
}
img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
}
</style>
