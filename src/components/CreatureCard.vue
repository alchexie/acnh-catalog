<script setup lang="ts">
import type { Creature } from "../types/creature";
import { UI_TEXT } from "../constants";
import { getChineseText, formatPrice } from "../utils/common";
import BaseCard from "./BaseCard.vue";

interface Props {
  data: Creature;
  hemisphere: "north" | "south";
}

const props = defineProps<Props>();

// 获取月份信息
const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres?.[props.hemisphere];
  if (!hemisphere?.months || hemisphere.months.length === 0) {
    return "--";
  }
  return hemisphere.months.join(", ");
};

// 获取时间信息
const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres?.[props.hemisphere];
  if (!hemisphere?.time || hemisphere.time.length === 0) {
    return "--";
  }
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

// 获取分类信息
const getCategory = (creature: Creature): string => {
  const categoryMap: Record<string, string> = {
    Insects: "昆虫",
    Bugs: "昆虫",
    Fish: "鱼类",
    "Sea Creatures": "海底生物",
  };
  return categoryMap[creature.sourceSheet] || creature.sourceSheet;
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    :version="props.data.versionAdded"
    :image="props.data.iconImage"
    :displayName="getChineseText(props.data)"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ getCategory(props.data) }}</span>
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
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.LOCATION }}</span>
      <span class="detail-value">{{ getLocation(props.data) }}</span>
    </div>
  </BaseCard>
</template>
