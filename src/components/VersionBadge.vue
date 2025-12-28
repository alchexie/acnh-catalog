<script setup lang="ts">
import { computed } from "vue";
import type { Version } from "../types/item";
import { getVersionName } from "../services/dataService";

interface Props {
  version?: Version | string | null;
}

const props = defineProps<Props>();

const displayVersion = computed(() => {
  if (props.version === null || props.version === undefined) return null;
  if (typeof props.version === "number") {
    return getVersionName(props.version);
  }
  return props.version;
});
</script>

<template>
  <div v-if="displayVersion" class="version-badge">
    {{ displayVersion }}
  </div>
</template>

<style scoped>
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
</style>
