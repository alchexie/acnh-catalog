<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useMessageCardsData } from "../composables/useMessageCardsData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import MessageCard from "../components/MessageCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Grid from "../components/Grid.vue";

// 使用数据加载组合函数
const { allMessageCards, loading, error, loadData } = useMessageCardsData();

// 筛选状态
const searchQuery = ref("");

// 处理筛选变化
const handleFiltersChanged = (filters: { searchQuery: string; selectedFilters: Record<string, string | number> }) => {
  searchQuery.value = filters.searchQuery;
};

// 根据搜索筛选的消息卡片
const filteredMessageCards = computed(() => {
  let result = allMessageCards.value;

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
    <div v-if="loading" class="loading">
      {{ DATA_LOADING.MESSAGE_CARDS || "正在加载消息卡片数据..." }}
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else>
      <FilterSection
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredMessageCards.length }}{{ UI_TEXT.STATS.MESSAGE_CARDS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredMessageCards" :card-component="MessageCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
