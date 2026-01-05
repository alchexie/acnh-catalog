<script setup lang="ts">
import { useArtworkData } from "../composables/useArtworkData";
import { useFilter } from "../composables/useFilter";
import { UI_TEXT } from "../constants";
import DataView from "../components/DataView.vue";
import ArtworkCard from "../components/ArtworkCard.vue";
import FilterSection from "../components/FilterSection.vue";

const { allArtwork, loading, error, loadData } = useArtworkData();
const { filteredData, handleFiltersChanged } = useFilter(allArtwork);
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="loadData" :datas="filteredData" :per-page="100" :card-component="ArtworkCard">
    <template #filters>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div>
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.ARTWORKS_UNIT }}
          </div>
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
