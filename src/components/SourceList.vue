<script setup lang="ts">
import { computed } from "vue";
import { getSourceName } from "../services/dataService";

const props = defineProps<{
  sources: string[];
  sourceNotes?: string[];
  inline?: boolean; // 是否单行显示（用逗号分隔）
}>();

const sourceWithNotes = computed(() => {
  return props.sources.map((source, index) => ({
    name: getSourceName(source) || source,
    note: props.sourceNotes?.[index] || undefined,
  }));
});
</script>

<template>
  <span v-if="inline" class="source-list-inline">
    <template v-for="(source, index) in sourceWithNotes" :key="index">
      <span v-if="index > 0">, </span>
      <span :title="source.note" :class="{ 'has-note': source.note }">{{
        source.name
      }}</span>
    </template>
  </span>
  <span v-else class="source-list-multi">
    <span
      v-for="(source, index) in sourceWithNotes"
      :key="index"
      :title="source.note"
      :class="{ 'has-note': source.note }"
    >
      {{ source.name }}
    </span>
  </span>
</template>

<style scoped>
.source-list-multi {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.has-note {
  border-bottom: 1px dashed #999;
  cursor: help;
  display: inline-block;
}
</style>
