<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useNPCsData } from "../composables/useNPCsData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import NPCCard from "../components/NPCCard.vue";
import FilterSection from "../components/FilterSection.vue";

// 使用NPC数据加载组合函数
const { allNPCs, loading, error, loadData } = useNPCsData();

// 筛选状态
const searchQuery = ref("");

// 处理筛选变化
const handleFiltersChanged = (filters: { searchQuery: string; selectedFilters: Record<string, string | number> }) => {
  searchQuery.value = filters.searchQuery;
};

// 根据搜索筛选的NPC
const filteredNPCs = computed(() => {
  let result = allNPCs.value;

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((npc) =>
      npc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
    <div v-if="loading" class="loading">{{ DATA_LOADING.NPCS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredNPCs.length }}{{ UI_TEXT.STATS.NPCS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredNPCs" :card-component="NPCCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
