<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useConstructionData } from "../composables/useConstructionData";
import { usePagination } from "../composables/usePagination";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ConstructionCard from "../components/ConstructionCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";
import { ConstructionType } from "../types/construction";
import { getConstrunctionTypeName } from "../services/dataService";

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

// 筛选状态
const selectedFilters = ref<Record<string, string | number>>({});
const searchQuery = ref("");

// 过滤器配置
const filters = computed(() => [
  {
    label: "类型",
    value: "category",
    options: Object.values(ConstructionType).map((type) => ({
      value: type,
      label: `${getConstrunctionTypeName(type)} (${
        allConstruction.value.filter((item) => item.type === type).length
      })`,
    })),
  },
]);

const handleFiltersChanged = (filters: { searchQuery: string; selectedFilters: Record<string, string | number> }) => {
  searchQuery.value = filters.searchQuery;
  selectedFilters.value = filters.selectedFilters;
  currentPage.value = 1; // 筛选变化时重置到第一页
};

// 根据分类筛选的改建项目
const filteredConstruction = computed(() => {
  let result = allConstruction.value;

  // 类型筛选
  if (selectedFilters.value.category && selectedFilters.value.category !== 0) {
    result = result.filter((item) => item.type === selectedFilters.value.category);
  }

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((construction) =>
      construction.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return result.sort((a, b) => a.id - b.id);
});

// 分页相关
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } = usePagination(filteredConstruction, perPageCount);

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CONSTRUCTION }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection
        :filters="filters"
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredConstruction.length }}{{ UI_TEXT.STATS.CONSTRUCTION_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="ConstructionCard" />
      <Pagination
        v-if="totalPageCount > 1"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredConstruction.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
