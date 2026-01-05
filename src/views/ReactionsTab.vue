<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useReactionsData } from "../composables/useReactionsData";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ReactionCard from "../components/ReactionCard.vue";
import FilterSection from "../components/FilterSection.vue";

// 使用表情反应数据加载组合函数
const { allReactions, loading, error, loadData } = useReactionsData();

// 过滤器配置（空配置，仅用于搜索）
const filters = computed(() => []);

// 使用通用筛选 composable
const { filteredData, handleFiltersChanged } = useFilter(allReactions);

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
        :filters="filters"
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredData" :card-component="ReactionCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
