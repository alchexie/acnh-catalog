<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useVillagersData } from '../composables/useVillagersData';
import { DATA_LOADING } from '../constants';
import VillagersGrid from '../components/VillagersGrid.vue';
import VillagerFilterControls from '../components/VillagerFilterControls.vue';

// 使用村民数据加载组合函数
const { allVillagers, loading, error, loadData } = useVillagersData();


// 多条件筛选
const filters = ref({
  species: '',
  gender: '',
  personality: '',
  hobby: ''
});
const isFilterExpanded = ref(false);

const filteredVillagers = computed(() => {
  let result = allVillagers.value;
  if (filters.value.species) {
    result = result.filter(v => v.species === filters.value.species);
  }
  if (filters.value.gender) {
    result = result.filter(v => v.gender === filters.value.gender);
  }
  if (filters.value.personality) {
    result = result.filter(v => v.personality === filters.value.personality);
  }
  if (filters.value.hobby) {
    result = result.filter(v => v.hobby === filters.value.hobby);
  }
  return result;
});

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="villagers-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.VILLAGERS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="filter-section">
        <div class="stats">
          <div class="stats-content">
            <div class="stat-item">总村民数: <strong>{{ allVillagers.length.toLocaleString() }}</strong></div>
            <div class="stat-item">当前显示: <strong>{{ filteredVillagers.length.toLocaleString() }}</strong></div>
          </div>
          <div class="action-buttons">
            <button class="toggle-filter-btn" @click="isFilterExpanded = !isFilterExpanded">
              <span>{{ isFilterExpanded ? '收起筛选' : '展开筛选' }}</span>
              <span class="icon">{{ isFilterExpanded ? '▲' : '▼' }}</span>
            </button>
          </div>
        </div>
        <div v-if="isFilterExpanded" class="filter-controls-wrapper">
          <VillagerFilterControls :filters="filters" :allVillagers="allVillagers" />
        </div>
      </div>
      <VillagersGrid :villagers="filteredVillagers" />
    </template>
  </div>
</template>

<style scoped>
  .villagers-tab {
    width: 100%;
  }

  .villagers-tab {
    width: 100%;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stats-content {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    flex: 1;
    justify-content: center;
  }

  .stat-item {
    font-size: 1.1em;
    color: #4a9b4f;
    font-weight: 600;
    margin: 0;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .toggle-filter-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #3498db 0%, #5dade2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }

  .toggle-filter-btn:hover {
    background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .toggle-filter-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .toggle-filter-btn .icon {
    font-size: 12px;
  }

  .filter-controls-wrapper {
    background-color: white;
    border-radius: 0 0 10px 10px;
    padding: 20px;
    margin-top: -10px;
    padding-top: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
