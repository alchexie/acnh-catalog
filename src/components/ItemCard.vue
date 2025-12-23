<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import type { Item } from '../types';
import { getSourceName, getTagName } from '../services/dataService';
import { ItemModel } from '../models';
import { useColorDisplay } from '../composables/useColorDisplay';

const props = defineProps<{
  item: Item;
  colorFilter?: string;
}>();

// 创建 ItemModel 实例
const itemModel = new ItemModel(props.item);

// 使用简单的 ref 管理响应式状态 - 直接访问 ItemModel 内部的 ref
const variantIndex = computed({
  get: () => itemModel.getVariantIndex(),
  set: (val: number) => itemModel.setVariantIndex(val)
});

const patternIndex = computed({
  get: () => itemModel.getPatternIndex(),
  set: (val: number) => itemModel.setPatternIndex(val)
});

// 计算属性 - 基于 ItemModel 方法，这些会自动响应内部 ref 的变化
const currentVariant = computed(() => itemModel.getCurrentVariant());
const displayImage = computed(() => itemModel.getDisplayImage());
const displayId = computed(() => itemModel.getDisplayId());
const displayColors = computed(() => itemModel.getDisplayColors());
const displayName = computed(() => itemModel.getDisplayName());
const hasMultipleVariants = computed(() => itemModel.hasMultipleVariants());
const hasPatterns = computed(() => itemModel.hasPatterns());

// 使用颜色显示组合函数
const { conicGradientStyle: colorBlockStyle } = useColorDisplay(displayColors);

// 便捷方法
const version = computed(() => itemModel.getVersion());
const size = computed(() => itemModel.getSize());
const sources = computed(() => itemModel.getSources());
const seriesName = computed(() => itemModel.getSeriesName());
const tag = computed(() => itemModel.getTag());

// 价格信息
const buyPrice = computed(() => itemModel.getBuyPrice());
const sellPrice = computed(() => itemModel.getSellPrice());

// 格式化价格显示
const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null) return '';
  return price.toLocaleString('zh-CN');
};

// 应用颜色筛选
const applyColorFilter = () => {
  if (props.colorFilter && props.item.variantGroups?.length) {
    const match = itemModel.findVariantByColor(props.colorFilter);
    if (match) {
      variantIndex.value = match.variantIndex;
      patternIndex.value = match.patternIndex;
    }
  }
};

// 初始化时应用颜色筛选
onMounted(() => {
  applyColorFilter();
});

// 监听颜色筛选器变化
watch(() => props.colorFilter, () => {
  variantIndex.value = 0;
  patternIndex.value = 0;
  applyColorFilter();
});

// 图片加载错误处理
const imageError = ref(false);
const handleImageError = (): void => {
  imageError.value = true;
};
</script>

<template>
  <div class="item-card" :class="{ 'item-owned': item.owned }">
    <div v-if="version !== '未知版本'" class="version-badge">
      {{ version }}
    </div>
    
    <div class="image-container">
      <img 
        v-if="!imageError"
        :src="displayImage" 
        :alt="item.name" 
        class="item-image" 
        loading="lazy"
        @error="handleImageError"
      >
      <div v-else class="image-placeholder">
        <span>📦</span>
        <span class="placeholder-text">图片加载失败</span>
      </div>
    </div>
    
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
    
    <div v-if="buyPrice || sellPrice" class="price-info">
      <span v-if="buyPrice" class="buy-price" title="购买价格">💰 {{ formatPrice(buyPrice) }}</span>
      <span v-if="buyPrice && sellPrice" class="price-separator">·</span>
      <span v-if="sellPrice" class="sell-price" title="出售价格">💵 {{ formatPrice(sellPrice) }}</span>
    </div>
    
    <div v-if="hasMultipleVariants" class="variation-row variant-row">
      <span class="variation-label">款式:</span>
      <div class="variation-dots">
        <span
          v-for="(vg, vIdx) in item.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{ active: vIdx === variantIndex }"
          :title="vg.variantName || `款式 ${vIdx + 1}`"
          @click="variantIndex = vIdx"
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
          :class="{ active: pIdx === patternIndex }"
          :title="p.patternName || `图案 ${pIdx + 1}`"
          @click="patternIndex = pIdx"
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

.image-container {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
  padding: 20px;
}

.image-placeholder span:first-child {
  font-size: 48px;
}

.placeholder-text {
  font-size: 12px;
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

.price-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 8px;
  background: #f0f8ff;
  border-radius: 4px;
}

.buy-price {
  color: #ff6b6b;
}

.sell-price {
  color: #51cf66;
}

.price-separator {
  color: #ccc;
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
