<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Item, FilterOptions } from './types';
import { loadTranslations, loadItemsData, loadCatalogData, processItemsData } from './services/dataService';
import { filterItems, sortItems } from './services/filterService';
import { CONFIG } from './config';
import FilterControls from './components/FilterControls.vue';
import ItemsGrid from './components/ItemsGrid.vue';
import Pagination from './components/Pagination.vue';
import StatsDisplay from './components/StatsDisplay.vue';

const allItems = ref<Item[]>([]);
const filteredItems = ref<Item[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(CONFIG.PAGINATION.DEFAULT_PER_PAGE);
const sortValue = ref(CONFIG.SORT_OPTIONS.ID_ASC);
const loading = ref(true);
const error = ref('');

const filters = ref<FilterOptions>({
  searchTerm: '',
  category: '',
  ownedFilter: 'all',
  versionFilter: '',
  sourceFilter: '',
  sizeFilter: '',
  tagFilter: '',
  colorFilter: '',
  seriesFilter: ''
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value));

const itemsToDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = Math.min(startIndex + itemsPerPage.value, filteredItems.value.length);
  return filteredItems.value.slice(startIndex, endIndex);
});

async function loadData() {
  try {
    loading.value = true;
    await loadTranslations();
    const acnhItems = await loadItemsData();
    const ownedData = await loadCatalogData();
    
    allItems.value = processItemsData(acnhItems, ownedData);
    filteredItems.value = [...allItems.value];
    loading.value = false;
  } catch (err) {
    console.error('加载数据失败:', err);
    error.value = '加载数据失败，请确保数据文件存在';
    loading.value = false;
  }
}

function handleFilterChange() {
  filteredItems.value = filterItems(allItems.value, filters.value);
  filteredItems.value = sortItems(filteredItems.value, sortValue.value);
  currentPage.value = 1;
}

function handleSortChange() {
  filteredItems.value = sortItems(filteredItems.value, sortValue.value);
}

function handlePageChange(page: number) {
  currentPage.value = page;
}

function handlePerPageChange(value: number | 'all') {
  itemsPerPage.value = value === 'all' ? filteredItems.value.length : value;
  currentPage.value = 1;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="container">
    <header>
      <h1>🍃 动物森友会物品目录 🍃</h1>
      <p class="subtitle">浏览和搜索你喜欢的物品</p>
    </header>

    <div v-if="loading" class="loading">正在加载物品数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <FilterControls
        v-model:filters="filters"
        v-model:sortValue="sortValue"
        v-model:perPage="itemsPerPage"
        :all-items="allItems"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @per-page-change="handlePerPageChange"
      />

      <StatsDisplay
        :total-items="allItems.length"
        :displayed-items="filteredItems.length"
        :owned-items="allItems.filter(item => item.owned).length"
      />

      <ItemsGrid :items="itemsToDisplay" />

      <Pagination
        v-if="totalPages > 1 || itemsPerPage !== filteredItems.length"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredItems.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #4a9b4f;
  font-size: 2.5em;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
  margin-top: 10px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}
</style>
