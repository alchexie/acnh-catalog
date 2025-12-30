<script setup lang="ts">
import { ENTITY_ICONS } from "../constants";

export type TabType =
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

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

interface Props {
  activeTab: TabType;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:activeTab": [tab: TabType];
}>();

const tabs: Tab[] = [
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

const selectTab = (tabId: TabType) => {
  emit("update:activeTab", tabId);
};
</script>

<template>
  <div class="tab-selector">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-button', { active: activeTab === tab.id }]"
      @click="selectTab(tab.id)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-selector {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.tab-button {
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

.tab-button:hover {
  border-color: var(--primary-color);
  background-color: #f0f8f0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.tab-button.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

.tab-icon {
  font-size: 1.3em;
}

.tab-label {
  font-weight: 600;
}

@media (max-width: 600px) {
  .tab-selector {
    gap: 6px;
  }

  .tab-button {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .tab-icon {
    font-size: 1.1em;
  }
}
</style>
