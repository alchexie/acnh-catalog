<script setup lang="ts">
import type { Fossil } from "../types/fossil";
import BaseCard from "./BaseCard.vue";

interface Props {
  data: Fossil;
}

const props = defineProps<Props>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/Fossils`, "_blank");
};
</script>

<template>
  <BaseCard
    colorClass="card--orange"
    :version="1"
    :images="props.data.parts.map(part => part.image)"
    :displayName="props.data.name"
    :shape="'rounded'"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name">{{ props.data.name }}</h3>
    </template>

    <div class="detail-row detail-row--full">
      <span class="detail-label">介绍</span>
      <span class="detail-value--full">{{ props.data.desc }}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">部件数量</span>
      <span class="detail-value">{{ props.data.parts.length }}</span>
    </div>
  </BaseCard>
</template>

<style scoped>
@import "../styles/card-styles.css";
</style>