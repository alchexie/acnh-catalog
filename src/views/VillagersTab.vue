<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useVillagersData } from "../composables/useVillagersData";
import { usePagination } from "../composables/usePagination";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import VillagerCard from "../components/VillagerCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";
import { Gender, Hobby, Personality, Species } from "../types/villager";
import {
  getGenderName,
  getHobbyName,
  getPersonalityName,
  getSpeciesName,
} from "../services/dataService";

// 使用村民数据加载组合函数
const { allVillagers, loading, error, loadData } = useVillagersData();

// 筛选状态
const selectedFilters = ref<Record<string, string | number>>({});
const searchQuery = ref("");

// 过滤器配置
const filters = computed(() => [
  {
    label: "种族",
    value: "species",
    options: Object.values(Species).map((species) => ({
      value: species,
      label: getSpeciesName(species),
    })),
  },
  {
    label: "性别",
    value: "gender",
    options: Object.values(Gender).map((gender) => ({
      value: gender,
      label: getGenderName(gender),
    })),
  },
  {
    label: "性格",
    value: "personality",
    options: Object.values(Personality).map((personality) => ({
      value: personality,
      label: getPersonalityName(personality),
    })),
  },
  {
    label: "爱好",
    value: "hobby",
    options: Object.values(Hobby).map((hobby) => ({
      value: hobby,
      label: getHobbyName(hobby),
    })),
  },
]);

const handleFiltersChanged = (filters: {
  searchQuery: string;
  selectedFilters: Record<string, string | number>;
}) => {
  searchQuery.value = filters.searchQuery;
  selectedFilters.value = filters.selectedFilters;
  currentPage.value = 1; // 筛选变化时重置到第一页
};

const filteredVillagers = computed(() => {
  let result = allVillagers.value;

  // 种族筛选
  const speciesValue = Number(selectedFilters.value.species);
  if (speciesValue && speciesValue !== 0) {
    result = result.filter((v) => v.species === speciesValue);
  }
  // 性别筛选
  const genderValue = Number(selectedFilters.value.gender);
  if (genderValue && genderValue !== 0) {
    result = result.filter((v) => v.gender === genderValue);
  }
  // 性格筛选
  const personalityValue = Number(selectedFilters.value.personality);
  if (personalityValue && personalityValue !== 0) {
    result = result.filter((v) => v.personality === personalityValue);
  }
  // 爱好筛选
  const hobbyValue = Number(selectedFilters.value.hobby);
  if (hobbyValue && hobbyValue !== 0) {
    result = result.filter((v) => v.hobby === hobbyValue);
  }

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((villager) =>
      villager.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return result;
});

// 分页相关
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } =
  usePagination(filteredVillagers, perPageCount);

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.VILLAGERS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection :filters="filters" @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS
            }}{{ filteredVillagers.length.toLocaleString()
            }}{{ UI_TEXT.STATS.VILLAGERS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="VillagerCard" />
      <Pagination
        v-if="totalPageCount > 1"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredVillagers.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";

.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
