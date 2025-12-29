<script setup lang="ts">
import { computed } from "vue";
import { Gender, Hobby, Personality, Species, type Villager } from "../types/villager";
import { getGenderName, getHobbyName, getPersonalityName, getSpeciesName } from "../services/dataService";

const props = defineProps<{
  filters: Record<string, string|number>;
  allVillagers: Villager[];
}>();

const emit = defineEmits<{
  (e: "update:filters", value: Record<string, string|number>): void;
  (e: "filter-change"): void;
}>();

const localFilters = computed({
  get: () => props.filters,
  set: (value) => {
    emit("update:filters", value);
    emit("filter-change");
  },
});
</script>

<template>
  <div class="villager-filter-controls">
    <label>种族：</label>
    <select v-model="localFilters.species">
      <option :value="0">全部</option>
      <option v-for="sp in Object.values(Species)" :key="sp" :value="sp">
        {{ getSpeciesName(sp) }}
      </option>
    </select>
    <label>性别：</label>
    <select v-model="localFilters.gender">
      <option :value="0">全部</option>
      <option v-for="g in Object.values(Gender)" :key="g" :value="g">
        {{ getGenderName(g) }}
      </option>
    </select>
    <label>性格：</label>
    <select v-model="localFilters.personality">
      <option :value="0">全部</option>
      <option v-for="p in Object.values(Personality)" :key="p" :value="p">
        {{ getPersonalityName(p) }}
      </option>
    </select>
    <label>爱好：</label>
    <select v-model="localFilters.hobby">
      <option :value="0">全部</option>
      <option v-for="h in Object.values(Hobby)" :key="h" :value="h">
        {{ getHobbyName(h) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.villager-filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.villager-filter-controls label {
  font-weight: 600;
  margin-right: 4px;
}
.villager-filter-controls select {
  min-width: 100px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
