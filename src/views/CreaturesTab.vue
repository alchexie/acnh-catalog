<script setup lang="ts">
import { onMounted } from 'vue';
import { useCreaturesData } from '../composables/useCreaturesData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import CreaturesGrid from '../components/CreaturesGrid.vue';

// 使用生物数据加载组合函数
const { allCreatures, loading, error, loadData } = useCreaturesData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="creatures-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CREATURES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allCreatures.length }}{{ UI_TEXT.STATS.CREATURES_UNIT }}</p>
      </div>
      <CreaturesGrid :creatures="allCreatures" />
    </template>
  </div>
</template>

<style scoped>
.creatures-tab {
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
