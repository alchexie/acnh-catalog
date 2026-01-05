<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useConstructionData } from "../composables/useConstructionData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ConstructionCard from "../components/ConstructionCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";
import { ConstructionType } from "../types/construction";
import { getConstrunctionTypeName } from "../services/dataService";

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

// 过滤器配置
const filters = computed(() => [
  {
    label: "类型",
    value: "type",
    options: Object.values(ConstructionType).map((type) => ({
      value: type,
      label: `${getConstrunctionTypeName(type)} (${
        allConstruction.value.filter((item) => item.type === type).length
      })`,
    })),
  },
]);

// 使用通用筛选 composable
const { filteredData, handleFiltersChanged } = useFilter(allConstruction);

// 排序后的筛选数据
const sortedFilteredData = computed(() => {
  return filteredData.value.sort((a: any, b: any) => a.id - b.id);
});

// 分页相关
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } = usePagination(sortedFilteredData, perPageCount);

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
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ sortedFilteredData.length }}{{ UI_TEXT.STATS.CONSTRUCTION_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="ConstructionCard" />
      <Pagination
        v-if="totalPageCount > 1"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="sortedFilteredData.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
