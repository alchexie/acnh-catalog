<script setup lang="ts">
import { useNPCsData } from "../composables/useNPCsData";
import { useFilter } from "../composables/useFilter";
import { UI_TEXT } from "../constants";
import DataView from "../components/DataView.vue";
import NPCCard from "../components/NPCCard.vue";
import FilterSection from "../components/FilterSection.vue";

const { allNPCs, loading, error, loadData } = useNPCsData();
const { filteredData, handleFiltersChanged } = useFilter(allNPCs);
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="loadData" :datas="filteredData" :card-component="NPCCard">
    <template #filters>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div>
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.NPCS_UNIT }}
          </div>
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
