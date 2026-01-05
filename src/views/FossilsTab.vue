<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useFossilsData } from "../composables/useFossilsData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import FossilCard from "../components/FossilCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";

// 使用化石数据加载组合函数
const { allFossils, loading, error, loadData } = useFossilsData();

// 过滤器配置（空配置，仅用于搜索）
const filters = computed(() => []);

// 使用通用筛选 composable
const { filteredData, handleFiltersChanged } = useFilter(allFossils);

// 分页相关
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } = usePagination(filteredData, perPageCount);

// 页面加载时获取数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.FOSSILS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <FilterSection
        :filters="filters"
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length }}{{ UI_TEXT.STATS.FOSSILS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="FossilCard" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredData.length"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>