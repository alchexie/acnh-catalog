<script setup lang="ts">
import type { Reaction } from "../types/reaction";
import { UI_TEXT } from "../constants";
import BaseCard from "./BaseCard.vue";
import SourceList from "./SourceList.vue";
import { getSeasonEventName } from "../services/dataService";

interface Props {
  data: Reaction;
}

const props = defineProps<Props>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
};
</script>

<template>
  <BaseCard
    colorClass="card--purple"
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">季节/活动</span>
      <span class="detail-value">{{
        getSeasonEventName(props.data.seasonEvent || "") || "--"
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="props.data.source"
        :sourceNotes="props.data.sourceNotes"
      />
    </div>
  </BaseCard>
</template>
