<script setup lang="ts">
import { ref } from 'vue';
import { useSelection } from '../composables/useSelection';
import { useItemsData } from '../composables/useItemsData';

const props = defineProps<{
  selectionKey: string;
}>();

const { getSelectedIds } = useSelection(props.selectionKey);
const { idMap } = useItemsData();
const exportStatus = ref('');

const handleExport = () => {
  const selectedIds = getSelectedIds();
  if (selectedIds.length === 0) {
    exportStatus.value = '没有已勾选的物品';
    setTimeout(() => { exportStatus.value = ''; }, 3000);
    return;
  }

  const items = selectedIds.map((id) => {
    const item = idMap.value[id];
    return {
      unique_id: Number(id),
      label: item?.name || '',
    };
  }).filter((item) => item.label);

  const data = {
    updated_at: Math.floor(Date.now() / 1000),
    items,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `acnh-catalog-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  exportStatus.value = `已导出 ${items.length} 个物品`;
  setTimeout(() => { exportStatus.value = ''; }, 3000);
};
</script>

<template>
  <div class="catalog-exporter">
    <button class="action-btn primary" @click="handleExport">
      <span>导出数据文件</span>
    </button>
    <div v-if="exportStatus" class="export-status" :class="{ warn: exportStatus.includes('没有') }">
      {{ exportStatus }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/view-styles';

.catalog-exporter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background-color: var(--gradient-success-light);
  color: #2e7d32;
  border: 1px solid var(--color-success);
  white-space: nowrap;
}

.export-status.warn {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ff9800;
}
</style>
