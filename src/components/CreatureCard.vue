<script setup lang="ts">
import type { Creature } from "../types/creature";
import { UI_TEXT } from "../constants";
import { formatPrice } from "../utils/common";
import BaseCard from "./BaseCard.vue";
import { ref, computed } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import { getCreatureTypeName } from "../services/dataService";

interface Props {
  data: Creature;
  hemisphere: "north" | "south";
}

const props = defineProps<Props>();

// 当前图片索引
const currentImageIndex = ref(0);

// 当前形状
const currentShape = computed(() => (currentImageIndex.value === 0 ? "circle" : "rounded"));

// 获取月份信息
const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.months.join(", ");
};

// 获取时间信息
const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.time.join(", ");
};

// 获取天气信息
const getWeather = (creature: Creature): string => {
  return creature.weather || "--";
};

// 获取位置信息
const getLocation = (creature: Creature): string => {
  return creature.whereHow || "--";
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
};

// 图片索引变更处理函数
const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    :shape="currentShape"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ getCreatureTypeName(props.data.type) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price"
        >{{ formatPrice(props.data.sell) }} {{ UI_TEXT.CURRENCY }}</span
      >
    </div>
    <div class="detail-row">
      <span class="detail-label">月份</span>
      <span class="detail-value">{{ getMonths(props.data) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">时间</span>
      <span class="detail-value">{{ getTime(props.data) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">天气</span>
      <span class="detail-value">{{ getWeather(props.data) }}</span>
    </div>
    <div class="detail-row  detail-row--full">
      <span class="detail-label">{{ UI_TEXT.LABELS.LOCATION }}</span>
      <span class="detail-value--full">{{ getLocation(props.data) }}</span>
    </div>
    <div class="detail-row detail-row--full">
      <span class="detail-label">获得</span>
      <span class="detail-value--full">{{ props.data.catchPhrase }}</span>
    </div>
    <div class="detail-row detail-row--full">
      <span class="detail-label">介绍</span>
      <span class="detail-value--full">{{ props.data.desc }}</span>
    </div>
  </BaseCard>
</template>
