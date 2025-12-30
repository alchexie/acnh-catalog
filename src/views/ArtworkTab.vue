<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useArtworkData } from "../composables/useArtworkData";
import { usePagination } from "../composables/usePagination";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ArtworkCard from "../components/ArtworkCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";

// 使用艺术品数据加载组合函数
const { allArtwork, loading, error, loadData } = useArtworkData();

// 筛选状态
const searchQuery = ref("");

// 处理筛选变化
const handleFiltersChanged = (filters: { searchQuery: string; selectedFilters: Record<string, string | number> }) => {
  searchQuery.value = filters.searchQuery;
  currentPage.value = 1; // 搜索变化时重置到第一页
};

// 根据搜索筛选的艺术品
const filteredArtwork = computed(() => {
  let result = allArtwork.value;

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((artwork) =>
      artwork.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return result;
});

// 分页相关
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } = usePagination(filteredArtwork, perPageCount);

// 页面加载时获取数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.ARTWORKS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <FilterSection
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredArtwork.length }}{{ UI_TEXT.STATS.ARTWORKS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="ArtworkCard" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredArtwork.length"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
