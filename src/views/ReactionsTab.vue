<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useReactionsData } from "../composables/useReactionsData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ReactionCard from "../components/ReactionCard.vue";
import FilterSection from "../components/FilterSection.vue";

// 使用表情反应数据加载组合函数
const { allReactions, loading, error, loadData } = useReactionsData();

// 筛选状态
const searchQuery = ref("");

// 处理筛选变化
const handleFiltersChanged = (filters: { searchQuery: string; selectedFilters: Record<string, string | number> }) => {
  searchQuery.value = filters.searchQuery;
};

// 根据搜索筛选的表情反应
const filteredReactions = computed(() => {
  let result = allReactions.value;

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((reaction) =>
      reaction.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return result;
});

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.REACTIONS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredReactions.length }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredReactions" :card-component="ReactionCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
