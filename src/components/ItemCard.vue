<script setup lang="ts">
import { computed } from 'vue';
import type { Item } from '../types';
import { getSourceName, getTagName } from '../services/dataService';
import { useItemVariants } from '../composables/useItemVariants';
import { useColorDisplay } from '../composables/useColorDisplay';

const props = defineProps<{
  item: Item;
}>();

// 使用物品变体管理组合函数（基于 ItemModel）
const {
  itemModel,
  currentVariant,
  displayImage,
  displayId,
  displayColors,
  displayName,
  hasMultipleVariants,
  hasPatterns,
  selectVariant,
  selectPattern,
  vIndex,
  pIndex
} = useItemVariants(props.item);

// 使用颜色显示组合函数
const { conicGradientStyle: colorBlockStyle } = useColorDisplay(displayColors);

// 使用 ItemModel 的便捷方法获取信息
const version = computed(() => itemModel.value.getVersion());
const size = computed(() => itemModel.value.getSize());
const sources = computed(() => itemModel.value.getSources());
const seriesName = computed(() => itemModel.value.getSeriesName());
const tag = computed(() => itemModel.value.getTag());
</script>

<template>
  <div class="item-card" :class="{ 'item-owned': item.owned }">
    <div v-if="version !== '未知版本'" class="version-badge">
      {{ version }}
    </div>
    
    <img :src="displayImage" :alt="item.name" class="item-image" loading="lazy">
    
    <div class="item-name">{{ displayName }}</div>
    <div class="item-id">ID: {{ displayId || 'N/A' }}</div>
    
    <div v-if="sources.length > 0" class="source-info">
      📍 {{ sources.map(s => getSourceName(s)).join(', ') }}
    </div>
    
    <div v-if="size !== '未知尺寸' || displayColors.length > 0" class="size-tag-info">
      <span v-if="size !== '未知尺寸'">📏 {{ size }}</span>
      <span v-if="displayColors.length > 0" class="color-block" :style="{ background: colorBlockStyle }"></span>
    </div>
    
    <div v-if="tag || seriesName !== '无系列'" class="tag-series-info">
      <span v-if="tag">🏷️ {{ getTagName(tag) }}</span>
      <span v-if="tag && seriesName !== '无系列'"> · </span>
      <span v-if="seriesName !== '无系列'">📦 {{ seriesName }}</span>
    </div>
    
    <div v-if="hasMultipleVariants" class="variation-row variant-row">
      <span class="variation-label">款式:</span>
      <div class="variation-dots">
        <span
          v-for="(vg, vIdx) in item.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{ active: vIdx === vIndex }"
          :title="vg.variantName || `款式 ${vIdx + 1}`"
          @click="selectVariant(vIdx)"
        >
          {{ vIdx + 1 }}
        </span>
      </div>
    </div>
    
    <div v-if="hasPatterns" class="variation-row pattern-row">
      <span class="variation-label">图案:</span>
      <div class="variation-dots">
        <span
          v-for="(p, pIdx) in currentVariant!.patterns"
          :key="pIdx"
          class="variation-dot pattern-dot"
          :class="{ active: pIdx === pIndex }"
          :title="p.patternName || `图案 ${pIdx + 1}`"
          @click="selectPattern(pIdx)"
        >
          {{ pIdx + 1 }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-owned {
  background: #e8f5e9;
  border: 2px solid #4caf50;
}

.version-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.item-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}

.item-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-id {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.source-info {
  font-size: 11px;
  color: #495057;
  margin-top: 5px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size-tag-info {
  font-size: 11px;
  color: #495057;
  padding: 4px 8px;
  background: #e9ecef;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tag-series-info {
  font-size: 11px;
  color: #495057;
  padding: 4px 8px;
  background: #fff3cd;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.color-block {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.variation-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.variation-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.variation-dots {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.variation-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.variation-dot:hover {
  background: #c8c8c8;
  transform: scale(1.1);
}

.variation-dot.active {
  background: #4a9b4f;
  color: white;
}
</style>
