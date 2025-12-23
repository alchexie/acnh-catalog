<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRecipesData } from '../composables/useRecipesData';
import { useItemsData } from '../composables/useItemsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import RecipesGrid from '../components/RecipesGrid.vue';
import Pagination from '../components/Pagination.vue';

// 使用DIY配方数据加载组合函数
const { allRecipes, loading, error, loadData } = useRecipesData();

// 加载物品数据以便查找材料
const { loadData: loadItemsData } = useItemsData();


// 分类筛选
const selectedCategory = ref('all');
const categories = computed(() => {
  const set = new Set<string>();
  allRecipes.value.forEach(r => r.category && set.add(r.category));
  return ['all', ...Array.from(set)];
});
const filteredRecipes = computed(() => {
  if (selectedCategory.value === 'all') return allRecipes.value;
  return allRecipes.value.filter(r => r.category === selectedCategory.value);
});

// 分页相关
const itemsPerPage = ref(20);
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / itemsPerPage.value);
});
const recipesToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRecipes.value.slice(start, end);
});
const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
  loadItemsData();
});
</script>

<template>
  <div class="recipes-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.RECIPES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredRecipes.length }} 个配方</p>
      </div>
      <div class="category-filter">
        <button v-for="cat in categories" :key="cat" class="category-btn"
          :class="{ active: selectedCategory === cat }" @click="selectedCategory = cat">
          <span class="category-label">{{ cat === 'all' ? '全部' : cat }}</span>
          <span class="category-count">({{ cat === 'all' ? allRecipes.length : allRecipes.filter(r => r.category === cat).length }})</span>
        </button>
      </div>
      <RecipesGrid :recipes="recipesToDisplay" />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredRecipes.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #4caf50;
}
.category-btn.active {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}
.category-label {
  font-weight: 600;
}
.category-count {
  font-size: 0.9em;
  opacity: 0.8;
}
.recipes-tab {
  width: 100%;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}

.stats {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-item {
  font-size: 1.1em;
  color: #4caf50;
  font-weight: 600;
  margin: 0;
}
</style>
