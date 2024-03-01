<template>
  <div class="customSelect">
    <div class="optionSelected" @click="handleSelectToggle">
      <img v-if="isTeamOption && optionSelected" :src="optionSelected.logo" />
      {{ optionSelected ? `${optionSelected.label}` : label? label: teamOptions[0].label }}
    </div>
    <div :class="['optionsContainer', { optionsShown: selectOpen }]">
      <div v-for="(option, index) in teamOptions" :key="index" class="option" @click="selectOption(option)">
        <img v-if="isTeamOption" :src="option.logo">
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ITable from "@/interfaces/ITable";
import { ITeamOptions } from "@/services/teamOptions";
import { type PropType } from "vue";

export default {
  props: {
    table: {
      type: Array as PropType<ITable[] | ITeamOptions[]>,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    selectedOption: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      optionSelected: null,
      selectOpen: false,
    };
  },
  computed: {
    sortedTable() {
      return this.table.slice().sort((a: ITable, b: ITable) => a.team_name.localeCompare(b.team_name));
    },
    teamOptions(): ITeamOptions[] {
      if (Array.isArray(this.table) && this.table.length > 0 && this.hasITableProperties(this.table[0])) {
        return this.sortedTable.map((team: ITable) => ({
          logo: team.logo,
          label: team.team_name,
          value: team,
        }));
      } else {
        return this.table
      }
    },
    isTeamOption() {
      return this.hasITableProperties(this.table[0])
    },
  },
  methods: {
    selectOption(option: ITeamOptions) {
      this.selectOpen = false
      this.optionSelected = option;
      this.$emit("selectedOption", option.value)
    },
    handleSelectToggle() {
      this.selectOpen = !this.selectOpen;
    },
    hasITableProperties(obj: any): obj is ITable {
      return 'logo' in obj && 'team_name' in obj;
    },
    handleDocumentClick(event: MouseEvent) {
      if (!this.$el.contains(event.target)) {
        if (this.selectOpen) {
          this.selectOpen = false
        }
      } 
    },
  },
  mounted () {
    document.addEventListener("click", this.handleDocumentClick);
  },
};
</script>

<style scoped>
.customSelect {
  width: 300px;
}

.optionSelected {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--brasileiraoSilver);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--brasileiraoLightBlue);
  transition: .2s;
}
.optionSelected:hover{
  filter: brightness(110%);
}
.optionSelected:active{
  transform: scale(0.99);
}
.optionSelected img {
  margin-right: 5px;
  width: 30px;
}

.optionsContainer {
  display: none;
  position: absolute;
  background-color: var(--brasileiraoBlue);
  width: 300px;
  transform-origin: top;
  transform: scaleY(0.1);
  border: 1px solid var(--brasileiraoSilver);
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1;
  transition: .2s;
}
.optionsShown{
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

.option img {
  margin-right: 5px;
  width: 30px; /* Adjust image size as needed */
}

.option:hover {
  background-color: #ffffff88;
}
</style>
