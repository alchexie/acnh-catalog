<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useConstructionData } from '../composables/useConstructionData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import ConstructionGrid from '../components/ConstructionGrid.vue';

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

// 当前选择的分类
const selectedCategory = ref<string>('all');

// 分类选项（根据实际数据动态生成）
const categories = computed(() => {
  const categorySet = new Set<string>();
  allConstruction.value.forEach(item => {
    if (item.category) {
      categorySet.add(item.category);
    }
  });
  
  const categoryList = [
    { value: 'all', label: '全部', icon: '🏗️' }
  ];
  
  Array.from(categorySet).sort().forEach(cat => {
    categoryList.push({ value: cat, label: cat, icon: '📦' });
  });
  
  return categoryList;
});

// 根据分类筛选的改建项目
const filteredConstruction = computed(() => {
  if (selectedCategory.value === 'all') {
    // 全部分类下按类型排序
    return [...allConstruction.value].sort((a, b) => {
      const catA = a.category || '未知';
      const catB = b.category || '未知';
      return catA.localeCompare(catB, 'zh-CN');
    });
  }
  return allConstruction.value.filter(item => item.category === selectedCategory.value);
});

// 各分类的数量统计
const categoryStats = computed(() => {
  const stats: Record<string, number> = {
    all: allConstruction.value.length
  };
  
  allConstruction.value.forEach(item => {
    if (item.category) {
      stats[item.category] = (stats[item.category] || 0) + 1;
    }
  });
  
  return stats;
});

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="construction-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CONSTRUCTION }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredConstruction.length }} 个改建项目</p>
      </div>
      <div class="category-filter">
        <button v-for="category in categories" :key="category.value" class="category-btn"
          :class="{ active: selectedCategory === category.value }" @click="selectedCategory = category.value">
          <span class="category-label">{{ category.label }}</span>
          <span class="category-count">({{ categoryStats[category.value] || 0 }})</span>
        </button>
      </div>
      <ConstructionGrid :construction="filteredConstruction" />
    </template>
  </div>
</template>

<style scoped>
.construction-tab {
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
  padding: 12px 20px;
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
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.category-icon {
  font-size: 1.3em;
}

.category-label {
  font-weight: 600;
}

.category-count {
  font-size: 0.9em;
  opacity: 0.8;
}
</style>
