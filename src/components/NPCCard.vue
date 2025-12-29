<script setup lang="ts">
import { ref, computed } from "vue";
import type { NPC } from "../types/npc";
import { lightenColor } from "../utils/common";
import BaseCard from "./BaseCard.vue";
import { getGenderIcon } from "../services/dataService";

interface Props {
  data: NPC;
}

const props = defineProps<Props>();
const currentImageIndex = ref(0);
const currentShape = computed(() => currentImageIndex.value === 0 ? 'circle' : 'rounded');

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
};

const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};
</script>

<template>
  <BaseCard
    colorClass="card--orange-dark"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="currentShape"
    :style="{
      background: props.data.bubbleColor || '#ffe082',
      border:
        '3px solid ' + lightenColor(props.data.bubbleColor || '#ffe082', -0.5),
    }"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3
        class="card-name"
        :style="{ color: props.data.nameColor || '#e67e22' }"
      >
        {{ props.data.name }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      {{ getGenderIcon(props.data.gender) }} {{ props.data.id }}
    </span>
    <span class="detail-row detail-center"> 🎂 {{ props.data.birthday }} </span>
  </BaseCard>
</template>
