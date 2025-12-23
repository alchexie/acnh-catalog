<script setup lang="ts">
import type { Creature } from '../types/creature';
import { UI_TEXT } from '../constants';
import { getChineseText, formatNumber } from '../utils/common';
import VersionBadge from './VersionBadge.vue';
import { ref } from 'vue';

interface Props {
  creatures: Creature[];
}

defineProps<Props>();

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<'north' | 'south'>('north');

// 获取中文名称
const getChineseName = (creature: Creature): string => {
  return getChineseText(creature);
};

// 格式化价格
const formatPrice = (price: number): string => {
  return formatNumber(price);
};

// 获取月份信息
const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres?.[selectedHemisphere.value];
  if (!hemisphere?.months || hemisphere.months.length === 0) {
    return '--';
  }
  return hemisphere.months.join(', ');
};

// 获取时间信息
const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres?.[selectedHemisphere.value];
  if (!hemisphere?.time || hemisphere.time.length === 0) {
    return '--';
  }
  return hemisphere.time.join(', ');
};

// 获取天气信息
const getWeather = (creature: Creature): string => {
  return creature.weather || '--';
};

// 获取位置信息
const getLocation = (creature: Creature): string => {
  return creature.whereHow || '--';
};
</script>

<template>
  <div class="creatures-grid-container">
    <div class="hemisphere-toggle">
      <button 
        class="hemisphere-btn"
        :class="{ active: selectedHemisphere === 'north' }"
        @click="selectedHemisphere = 'north'"
      >
        🌍 北半球
      </button>
      <button 
        class="hemisphere-btn"
        :class="{ active: selectedHemisphere === 'south' }"
        @click="selectedHemisphere = 'south'"
      >
        🌏 南半球
      </button>
    </div>

    <div class="creatures-grid">
      <div v-for="creature in creatures" :key="creature.uniqueEntryId" class="creature-card">
        <VersionBadge :version="creature.versionAdded" />
        <div class="creature-image-wrapper">
          <img :src="creature.iconImage" :alt="creature.name" class="creature-image" />
        </div>
        <div class="creature-info">
          <h3 class="creature-name">{{ getChineseName(creature) }}</h3>
          <div class="creature-details">
            <div class="detail-row">
              <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
              <span class="detail-value price">{{ formatPrice(creature.sell) }} {{ UI_TEXT.CURRENCY }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 月份</span>
              <span class="detail-value">{{ getMonths(creature) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 时间</span>
              <span class="detail-value">{{ getTime(creature) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🌤️ 天气</span>
              <span class="detail-value">{{ getWeather(creature) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ UI_TEXT.LABELS.LOCATION }}</span>
              <span class="detail-value">{{ getLocation(creature) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.creatures-grid-container {
  width: 100%;
}

.hemisphere-toggle {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.hemisphere-btn {
  padding: 10px 24px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hemisphere-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #4caf50;
}

.hemisphere-btn.active {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.creatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.creature-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.creature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2);
}

.creature-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.creature-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.creature-info {
  width: 100%;
}

.creature-name {
  font-size: 1.2em;
  color: #4caf50;
  margin: 0 0 12px 0;
  font-weight: 600;
  text-align: center;
}

.creature-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 0.9em;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
  text-align: right;
  word-wrap: break-word;
  max-width: 65%;
}

.detail-value.price {
  color: #4caf50;
  font-weight: 600;
}

@media (max-width: 768px) {
  .creatures-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .creature-card {
    padding: 15px;
  }

  .creature-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .creature-name {
    font-size: 1.1em;
  }
}
</style>
