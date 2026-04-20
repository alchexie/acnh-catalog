<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Villager } from '../types/villager';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import ItemIcon from './ItemIcon.vue';
import { getSpeciesIcon, getGenderIcon, getConstellationIcon } from '../services/iconService';
import {
  getClothingStyleName,
  getGenderName,
  getHobbyName,
  getPersonalityName,
  getSpeciesName,
  getConstellationName,
} from '../services/nameService';
import { getConstellation } from '../utils/dateUtils';
import { joinArray } from '../utils/common';
import ColorBlock from './ColorBlock.vue';
import { processImageUrl, getImgUrl } from '../utils/imageUtils';

const props = defineProps<{
  data: Villager;
  selectionKey?: string;
}>();

const currentImageIndex = ref(0);
const isFurnitureExpanded = ref(false);
const isHhpExpanded = ref(false);
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? 'circle' : 'rounded'
);

const furnitureList = computed(() => {
  return [props.data.song, ...props.data.furnitures, props.data.wallpaper, props.data.flooring];
});

const defaultItems = computed(() => {
  return [props.data.clothing, props.data.umbrella];
});

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};

const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};

const toggleFurnitureExpanded = () => {
  isFurnitureExpanded.value = !isFurnitureExpanded.value;
};

const toggleHhpExpanded = () => {
  isHhpExpanded.value = !isHhpExpanded.value;
};
</script>

<template>
  <BaseCard
    :colorTheme="props.data.bubbleColor"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="currentShape"
    variant="dark"
    :selectionKey="props.selectionKey"
    :getSelectId="() => props.data.id"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.nameColor }">
        {{ props.data.name }}
      </h3>
    </template>
    <DetailRow layout="center">
      {{ props.data.id }}
      <InlineIcon
        :src="getGenderIcon(props.data.gender)"
        :alt="getGenderName(props.data.gender)"
      />
    </DetailRow>
    <DetailRow label="物种">
      {{ getSpeciesName(props.data.species) }}
      <InlineIcon
        :src="getSpeciesIcon(props.data.species)"
        :alt="getSpeciesName(props.data.species)"
        :title="getSpeciesName(props.data.species)"
        gray
      />
    </DetailRow>
    <DetailRow label="生日">
      {{ props.data.birthday }}
      <InlineIcon
        :src="getConstellationIcon(getConstellation(props.data.birthday))"
        :alt="getConstellationName(getConstellation(props.data.birthday))"
        :title="getConstellationName(getConstellation(props.data.birthday))"
      />
    </DetailRow>
    <DetailRow
      label="性格/爱好"
      :value="`${getPersonalityName(props.data.personality)}(${props.data.subtype}) / ${getHobbyName(props.data.hobby)}`"
    />
    <DetailRow label="喜爱服饰">
      {{ joinArray(props.data.styles.map(getClothingStyleName)) }}
      <ColorBlock :colors="props.data.colors" :size="16" />
    </DetailRow>
    <DetailRow label="口头禅" :value="props.data.catchphrase" />
    <DetailRow label="个性签名" :value="props.data.saying" layout="full" />

    <!-- 房屋图片 -->
    <div v-if="props.data.houseImage" class="house-image-wrapper">
      <img
        :src="processImageUrl(props.data.houseImage)"
        alt="House Image"
        class="house-image"
        loading="lazy"
      />
    </div>

    <!-- 默认物品图片 -->
    <div v-if="defaultItems.length > 0" class="icon-grid icon-grid--inline">
      <ItemIcon v-for="item in defaultItems" :key="item" :itemId="item" :size="60" />
    </div>

    <!-- 家具列表 -->
    <div v-if="furnitureList.length > 0" class="panel panel--green">
      <div class="panel-header" @click="toggleFurnitureExpanded">
        <span class="panel-title">家具 ({{ furnitureList.length }})</span>
        <span class="panel-toggle">{{ isFurnitureExpanded ? '▼' : '▶' }}</span>
      </div>
      <div v-if="isFurnitureExpanded" class="panel-content">
        <div class="icon-grid icon-grid--cols-3">
          <div v-for="furniture in furnitureList" :key="furniture">
            <ItemIcon :itemId="furniture" :size="60" />
          </div>
          <ItemIcon
            :itemId="props.data.diyWorkbench[0]"
            :vIndex="props.data.diyWorkbench[1]"
            :pIndex="props.data.diyWorkbench[2]"
            :size="60"
          />
          <ItemIcon
            :itemId="props.data.kitchenware[0]"
            :vIndex="props.data.kitchenware[1]"
            :pIndex="props.data.kitchenware[2]"
            :size="60"
          />
        </div>
      </div>
    </div>

    <!-- 快乐家乐园 -->
    <div v-if="props.data.hhpFurnitures.length > 0" class="panel panel--red">
      <div class="panel-header" @click="toggleHhpExpanded">
        <span class="panel-title">
          <InlineIcon :src="getImgUrl('img/icon/hhp.png')" />
          快乐家乐园 ({{ props.data.hhpFurnitures.length }})
        </span>
        <span class="panel-toggle">{{ isHhpExpanded ? '▼' : '▶' }}</span>
      </div>
      <div v-if="isHhpExpanded" class="panel-content">
        <div class="panel-inner">
          <DetailRow v-if="props.data.hhpReq" :value="props.data.hhpReq" layout="center" />
          <DetailRow v-if="props.data.hhpMsg" :value="props.data.hhpMsg" layout="center" />
        </div>
        <div class="icon-grid icon-grid--cols-3">
          <ItemIcon v-if="props.data.hhpSong" :itemId="props.data.hhpSong" :size="60" />
          <div v-for="furniture in props.data.hhpFurnitures" :key="furniture">
            <ItemIcon :itemId="furniture" :size="60" />
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
