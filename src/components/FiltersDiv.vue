<template>
  <div class="filtersContainer">
    <CustomSelect :table="table" label="Time" @selectedOption="updateSelectedTeam"/>
    <CustomSelect :table="teamOptions" label="Opção" @selectedOption="updateSelectedTeamOption"/>
    <StandardButton :class="{opacityZero : isButtonDisabled}" :text="mobileStore.isScreenSmall ? '✔':'Aplicar'" @click="applyFilter" :disabled="isButtonDisabled"/>
  </div>
</template>
<script lang="ts">
import type ITable from "@/interfaces/ITable";
import { type PropType } from "vue";
import StandardButton from "./StandardButton.vue";
import CustomSelect from "./CustomSelect.vue";
import { teamOptions } from "@/services/teamOptions";
import { useIsMobileStore } from "@/stores/isMobile";

export default {
  setup() {
    const mobileStore = useIsMobileStore();
    mobileStore.checkIfIsMobile();

    return{ mobileStore}
  },
  data() {
    return {
      teamSelected: {} as ITable,
      optionSelected: '',
      selectOpen: false,
      teamOptions: teamOptions
    };
  },
  props: {
    table: {
      type: Array as PropType<ITable[]>,
      required: true,
    },
  },
  computed: {
    sortedTable() {
      return this.table.slice().sort((a: ITable, b: ITable) => a.team_name.localeCompare(b.team_name));
    },
    isButtonDisabled() {
      return !this.teamSelected.team_name || !this.optionSelected;
    },
  },
  methods: {
    updateSelectedTeam(team: ITable) {
      this.teamSelected = team;
      console.log(this.teamSelected);
    },
    updateSelectedTeamOption(option: string) {
      this.optionSelected = option;
      console.log(this.optionSelected);
    },
    handleSelectToggle() {
      this.selectOpen = !this.selectOpen;
    },
    applyFilter() {
      this.$emit("filterApplied", this.teamSelected, this.optionSelected)
    },
  },
  components: { StandardButton, CustomSelect },
};
</script>

<style scoped>
.filtersContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  margin: 20px auto;
  width: 90vw;
  color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 0px black;
  background-color: var(--brasileiraoBlue);
}
.customTeamSelect {
  width: 200px;
}

.teamSelected {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--brasileiraoSilver);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--brasileiraoLightBlue);
  transition: 0.2s;
}
.teamSelected:hover {
  filter: brightness(110%);
}
.teamSelected:active {
  transform: scale(0.99);
}
.teamSelected img {
  margin-right: 5px;
  width: 30px;
}

.optionsContainer {
  position: absolute;
  background-color: var(--brasileiraoBlue);
  min-width: 200px;
  border: 1px solid var(--brasileiraoSilver);
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1;
}

.option {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.option img {
  margin-right: 5px;
  width: 30px; /* Adjust image size as needed */
}

.option:hover {
  background-color: #ffffff88;
}

.opacityZero{
  opacity: 0;
}

.opacityZero:hover{
  cursor: default;
}
</style>
