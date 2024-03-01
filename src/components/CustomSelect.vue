<template>
  <div class="customSelect">
    <div class="optionSelected" @click="handleSelectToggle">
      <img v-if="isTeamOption && optionSelected.label" :src="optionSelected.logo" />
      <span>{{
        optionSelected.label ? (isTeamOption && mobileStore.isScreenSmall ? "" : `${optionSelected.label}`) : label ? label : teamOptions[0].label
      }}</span>
    </div>
    <div :class="['optionsContainer', { optionsShown: selectOpen }]">
      <div v-for="(option, index) in teamOptions" :key="index" class="option" @click="selectOption(option)">
        <img v-if="isTeamOption" :src="option.logo" />
        <span :class="{ hidden: isTeamOption && mobileStore.isScreenSmall }">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type ITable from "@/interfaces/ITable";
import { type ITeamOptions } from "@/services/teamOptions";
import { useIsMobileStore } from "@/stores/isMobile";
import { type PropType } from "vue";

export default {
  setup() {
    const mobileStore = useIsMobileStore();
    mobileStore.checkIfIsMobile();

    return { mobileStore };
  },
  props: {
    table: {
      type: Array as PropType<ITable[] | ITeamOptions[]>,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      optionSelected: { label: "", value: "", logo: "" } as ITeamOptions,
      selectOpen: false,
    };
  },
  computed: {
    sortedTable(): ITable[] {
      return this.table.slice().sort((a: any, b: any) => a.team_name.localeCompare(b.team_name)) as ITable[];
    },
    teamOptions(): ITeamOptions[] {
      if (Array.isArray(this.table) && this.table.length > 0 && this.hasITableProperties(this.table[0])) {
        return this.sortedTable.map((team: ITable) => ({
          logo: team.logo,
          label: team.team_name,
          value: team,
        }));
      } else {
        return this.table as ITeamOptions[];
      }
    },
    isTeamOption() {
      return this.hasITableProperties(this.table[0]);
    },
  },
  methods: {
    selectOption(option: ITeamOptions) {
      this.selectOpen = false;
      this.optionSelected = option;
      this.$emit("selectedOption", option.value);
    },
    handleSelectToggle() {
      this.selectOpen = !this.selectOpen;
    },
    hasITableProperties(obj: any): obj is ITable {
      return "logo" in obj && "team_name" in obj;
    },
    handleDocumentClick(event: MouseEvent) {
      if (!this.$el.contains(event.target)) {
        if (this.selectOpen) {
          this.selectOpen = false;
        }
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick);
  },
};
</script>

<style scoped>
.customSelect {
  width: 25vw;
  max-width: 300px;
}

.optionSelected {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--brasileiraoSilver);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--brasileiraoLightBlue);
  transition: 0.2s;
  color: white;
}
.optionSelected:hover {
  filter: brightness(110%);
}
.optionSelected:active {
  transform: scale(0.99);
}

img {
  margin-right: 5px;
  width: 30px;
}

.optionsContainer {
  display: none;
  color: white;
  position: absolute;
  background-color: var(--brasileiraoBlue);
  width: 25vw;
  max-width: 300px;
  transform-origin: top;
  transform: scaleY(0.1);
  border: 1px solid var(--brasileiraoSilver);
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1;
  transition: 0.2s;
}
.optionsShown {
  display: block;
  animation: showContent 0.5s ease forwards;
}
.option {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.option:hover {
  background-color: #ffffff88;
}

@media screen and (max-width: 400px) {
  .customSelect {
    font-size: 0.5rem;
  }
  img {
    margin: 0px auto;
    width: 30px;
  }
}
</style>
