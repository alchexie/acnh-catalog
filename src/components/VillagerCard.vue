<script setup lang="ts">
import { ref, computed } from "vue";
import type { Villager } from "../types/villager";
import { ENTITY_ICONS, PERSONALITY_MAP } from "../constants";
import { getChineseText, lightenColor } from "../utils/common";
import BaseCard from "./BaseCard.vue";

interface Props {
  data: Villager;
}

const props = defineProps<Props>();

// 当前图片索引
const currentImageIndex = ref(0);

// 当前形状
const currentShape = computed(() => currentImageIndex.value === 0 ? 'circle' : 'rounded');

// 获取性别emoji
const getGenderIcon = (gender: string): string => {
  return gender === "Male" ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
};

// 获取性格中文
const getPersonalityChinese = (personality: string): string => {
  return PERSONALITY_MAP[personality] || personality;
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
};

const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};
</script>

<template>
  <BaseCard
    colorClass="card--green-dark"
    :version="props.data.versionAdded"
    :images="[props.data.iconImage, props.data.photoImage, props.data.houseImage].filter((img): img is string => Boolean(img))"
    :displayName="getChineseText(props.data)"
    :shape="currentShape"
    :style="{
      background: props.data.bubbleColor || '#4a9b4f',
      border:
        '3px solid ' + lightenColor(props.data.bubbleColor || '#4a9b4f', -0.5),
    }"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3
        class="card-name"
        :style="{ color: props.data.nameColor || '#4a9b4f' }"
      >
        {{ getChineseText(props.data) }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      {{ getGenderIcon(props.data.gender) }} {{ props.data.species }}
    </span>
    <span class="detail-row detail-center">
      {{ getPersonalityChinese(props.data.personality) }} /
      {{ props.data.hobby }}
    </span>
    <span class="detail-row detail-center"> 🎂 {{ props.data.birthday }} </span>
  </BaseCard>
</template>
