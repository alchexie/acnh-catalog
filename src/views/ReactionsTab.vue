<script setup lang="ts">
import { onMounted } from 'vue';
import { useReactionsData } from '../composables/useReactionsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import ReactionsGrid from '../components/ReactionsGrid.vue';

// 使用表情反应数据加载组合函数
const { allReactions, loading, error, loadData } = useReactionsData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="reactions-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.REACTIONS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allReactions.length }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}</p>
      </div>
      <ReactionsGrid :reactions="allReactions" />
    </template>
  </div>
</template>

<style scoped>
.reactions-tab {
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
  color: #9c27b0;
  font-weight: 600;
  margin: 0;
}
</style>
