<script setup lang="ts">
import { ENTITY_ICONS } from "../constants";

export type ViewType =
  | "items"
  | "villagers"
  | "npcs"
  | "creatures"
  | "reactions"
  | "recipes"
  | "construction"
  | "messagecard"
  | "artwork"
  | "fossils";

interface ViewItem {
  id: ViewType;
  label: string;
  icon: string;
}

interface Props {
  activeView: ViewType;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:activeView": [view: ViewType];
}>();

const views: ViewItem[] = [
  { id: "items", label: "物品", icon: ENTITY_ICONS.ITEMS },
  { id: "villagers", label: "村民", icon: ENTITY_ICONS.VILLAGERS },
  { id: "npcs", label: "NPC", icon: ENTITY_ICONS.NPCS },
  { id: "creatures", label: "生物", icon: ENTITY_ICONS.CREATURES },
  { id: "fossils", label: "化石", icon: ENTITY_ICONS.FOSSILS },
  { id: "artwork", label: "艺术品", icon: ENTITY_ICONS.ARTWORKS },
  { id: "reactions", label: "表情", icon: ENTITY_ICONS.REACTIONS },
  { id: "recipes", label: "DIY配方", icon: ENTITY_ICONS.RECIPES },
  { id: "construction", label: "改建", icon: ENTITY_ICONS.CONSTRUCTION },
  { id: "messagecard", label: "消息卡片", icon: ENTITY_ICONS.MESSAGE_CARDS },
];

const selectView = (viewId: ViewType) => {
  emit("update:activeView", viewId);
};
</script>

<template>
  <div class="view-selector">
    <button
      v-for="view in views"
      :key="view.id"
      :class="['view-button', { active: activeView === view.id }]"
      @click="selectView(view.id)"
    >
      <span class="view-icon">{{ view.icon }}</span>
      <span class="view-label">{{ view.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.view-selector {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.view-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-xl);
  background-color: white;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: var(--transition-normal);
  color: var(--secondary-color);
}

.view-button:hover {
  border-color: var(--primary-color);
  background-color: #f0f8f0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.view-button.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

.view-icon {
  font-size: 1.3em;
}

.view-label {
  font-weight: 600;
}

@media (max-width: 600px) {
  .view-selector {
    gap: 6px;
  }

  .view-button {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .view-icon {
    font-size: 1.1em;
  }
}
</style>
