<template>
  <header>
    <MenuIcon :width="mobileStore.isMobile? '25':'30'" @click="toggleMenuSidebar"/>
    <h1>Quais são as chances</h1>
    <AboutIcon :width="mobileStore.isMobile? '25':'30'" @click="toggleAboutModel" />
    <AboutModel :show-about-model="showAboutModel" @close="closeAboutModel"/>
    <MenuSidebar :show-menu-sidebar="showMenuSidebar" @close="closeMenuSidebar"/>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AboutIcon from "./icons/AboutIcon.vue";
import AboutModel from "./AboutModel.vue";
import { useIsMobileStore } from "@/stores/isMobile";
import MenuIcon from "./icons/MenuIcon.vue";
import MenuSidebar from "./MenuSidebar.vue"

export default defineComponent({
  setup() {
    const mobileStore = useIsMobileStore()

    return {mobileStore}
  },
  data() {
    return {
      showAboutModel: false,
      showMenuSidebar: false,
    };
  },
  methods: {
    toggleAboutModel() {
      this.showAboutModel = !this.showAboutModel;
    },
    toggleMenuSidebar() {
      this.showMenuSidebar = !this.showMenuSidebar
    },
    closeAboutModel() {
      this.showAboutModel = false;
    },
    closeMenuSidebar() {
      this.showMenuSidebar =false
    },
    handleDocumentClick(event: MouseEvent) {
      if (!this.$el.contains(event.target)) {
        if (this.showAboutModel) {
          this.closeAboutModel();
        }
        if (this.showMenuSidebar) {
          this.closeMenuSidebar()
        }
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
  components: { AboutIcon, AboutModel, MenuIcon, MenuSidebar },
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
@media screen and (max-width: 500px) {
  header{
    padding: 10px;
  }
}
</style>
