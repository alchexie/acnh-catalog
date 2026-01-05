<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useNPCsData } from "../composables/useNPCsData";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import NPCCard from "../components/NPCCard.vue";
import FilterSection from "../components/FilterSection.vue";

// 使用NPC数据加载组合函数
const { allNPCs, loading, error, loadData } = useNPCsData();

// 过滤器配置（空配置，仅用于搜索）
const filters = computed(() => []);

// 使用通用筛选 composable
const { filteredData, handleFiltersChanged } = useFilter(allNPCs);

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.NPCS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection
        :filters="filters"
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length }}{{ UI_TEXT.STATS.NPCS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredData" :card-component="NPCCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
