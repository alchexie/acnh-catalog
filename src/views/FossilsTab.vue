<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useFossilsData } from "../composables/useFossilsData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import FossilCard from "../components/FossilCard.vue";
import Pagination from "../components/Pagination.vue";

// 使用化石数据加载组合函数
const { allFossils, loading, error, loadData } = useFossilsData();

// 分页相关
const currentPage = ref(1);
const perPage = ref(100);

// 计算分页数据
const paginatedFossils = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return allFossils.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(allFossils.value.length / perPage.value);
});

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 页面加载时获取数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.FOSSILS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats">
        <p class="stat-item">
          {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allFossils.length
          }}{{ UI_TEXT.STATS.FOSSILS_UNIT }}
        </p>
      </div>
      <Grid :datas="paginatedFossils" :card-component="FossilCard" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :items-count="allFossils.length"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>