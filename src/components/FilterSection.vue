<template>
  <div
    class="filter-section"
    :class="{ 'filter-expanded': isExpanded }"
  >
    <div class="stats stats-layout-flex">
      <div class="stats-content">
        <slot name="stats"></slot>
      </div>
      <div class="action-buttons">
        <slot name="action-buttons"></slot>
        <button class="action-btn primary" @click="toggle">
          <span>{{ isExpanded ? (props.collapseText || "收起筛选") : (props.expandText || "展开筛选") }}</span>
          <span class="icon">{{ isExpanded ? "▲" : "▼" }}</span>
        </button>
      </div>
    </div>
    <div v-if="isExpanded" class="filter-controls-wrapper">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索..."
          @input="handleSearch(($event.target as HTMLInputElement).value)"
        />
        <button class="action-btn danger" @click="handleClearFilters">清除筛选</button>
      </div>
      <div v-if="props.filters" class="filters-wrapper">
        <div
          v-for="filter in props.filters"
          :key="filter.value"
          class="filter-group"
        >
          <label v-if="props.filters.length > 1" class="filter-title">{{ filter.label }}</label>
          <!-- 单个筛选维度时显示按钮 -->
          <div v-if="props.filters.length === 1" class="category-filter">
            <button
              v-for="option in getFilterOptions(filter)"
              :key="option.value"
              class="category-btn"
              :class="{ active: getSelectedValue(filter.value) === option.value }"
              @click="handleFilterChange({ dimension: filter.value, value: option.value })"
            >
              <span class="category-label">{{ option.label }}</span>
            </button>
          </div>
          <!-- 多个筛选维度时显示下拉框 -->
          <select
            v-else
            class="filter-select"
            :value="getSelectedValue(filter.value)"
            @change="handleFilterChange({ dimension: filter.value, value: ($event.target as HTMLSelectElement).value })"
          >
            <option
              v-for="option in getFilterOptions(filter)"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <slot name="filter-controls"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  filtersChanged: [filters: { searchQuery: string; selectedFilters: Record<string, string | number> }];
}>();

const isExpanded = ref(false);

const searchQuery = ref('');
const selectedFilters = ref<Record<string, string | number>>({});

const props = defineProps<{
  expandText?: string;
  collapseText?: string;
  filters?: Array<{
    label: string;
    value: string;
    options: Array<{ value: string | number; label: string }>;
  }>;
}>();

// 默认选中全部选项
const initializeDefaultFilters = () => {
  if (props.filters) {
    const newFilters: Record<string, string | number> = {};
    props.filters.forEach(filter => {
      // 根据filter的第一个选项的类型决定"全部"选项的值
      const firstOption = filter.options[0];
      let allValue: string | number = 0; // 默认数字0

      if (firstOption && typeof firstOption.value === 'string') {
        allValue = 'all'; // 如果第一个选项是字符串，使用'all'
      }

      newFilters[filter.value] = allValue;
    });
    selectedFilters.value = newFilters;
    emit('filtersChanged', { searchQuery: searchQuery.value, selectedFilters: selectedFilters.value });
  }
};

// 监听filters变化，初始化默认选择
watch(() => props.filters, initializeDefaultFilters, { immediate: true });

// 为每个筛选维度生成包含"全部"选项的完整选项列表
const getFilterOptions = (filter: any) => {
  // 根据filter的第一个选项的类型决定"全部"选项的值
  const firstOption = filter.options[0];
  let allValue: string | number = 0; // 默认数字0

  if (firstOption && typeof firstOption.value === 'string') {
    allValue = 'all'; // 如果第一个选项是字符串，使用'all'
  }

  return [
    { value: allValue, label: '全部' },
    ...filter.options
  ];
};

const getSelectedValue = (dimension: string) => {
  return selectedFilters.value[dimension];
};

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  emit('filtersChanged', { searchQuery: searchQuery.value, selectedFilters: selectedFilters.value });
};

const handleFilterChange = (event: { dimension: string; value: string | number }) => {
  selectedFilters.value = { ...selectedFilters.value, [event.dimension]: event.value };
  emit('filtersChanged', { searchQuery: searchQuery.value, selectedFilters: selectedFilters.value });
};

const handleClearFilters = () => {
  searchQuery.value = '';
  // 将所有筛选重置为"全部"
  if (props.filters) {
    const clearedFilters: Record<string, string | number> = {};
    props.filters.forEach(filter => {
      // 根据filter的第一个选项的类型决定"全部"选项的值
      const firstOption = filter.options[0];
      let allValue: string | number = 0; // 默认数字0

      if (firstOption && typeof firstOption.value === 'string') {
        allValue = 'all'; // 如果第一个选项是字符串，使用'all'
      }

      clearedFilters[filter.value] = allValue;
    });
    selectedFilters.value = clearedFilters;
  } else {
    selectedFilters.value = {};
  }
  emit('filtersChanged', { searchQuery: '', selectedFilters: selectedFilters.value });
};
</script>

<style scoped>
@import "../styles/tab-styles.css";

.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-bar {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-bar input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.search-bar input:focus {
  outline: none;
  border-color: #4a9b4f;
}

.filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-title {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  margin: 0;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #4a9b4f;
}

.filter-select option {
  padding: 8px;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: #28a745;
  border: 1px solid #28a745;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  white-space: nowrap;
}

.category-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.category-btn.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.category-btn .category-label {
  font-weight: 500;
}
</style>