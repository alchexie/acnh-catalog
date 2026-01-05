<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useMessageCardsData } from "../composables/useMessageCardsData";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import MessageCard from "../components/MessageCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Grid from "../components/Grid.vue";

// 使用数据加载组合函数
const { allMessageCards, loading, error, loadData } = useMessageCardsData();

// 过滤器配置（空配置，仅用于搜索）
const filters = computed(() => []);

// 使用通用筛选 composable
const { filteredData, handleFiltersChanged } = useFilter(allMessageCards);

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
        :filters="filters"
        @filters-changed="handleFiltersChanged"
      >
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length }}{{ UI_TEXT.STATS.MESSAGE_CARDS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredData" :card-component="MessageCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
