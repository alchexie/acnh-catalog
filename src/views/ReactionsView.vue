<script setup lang="ts">
import { useReactionsData } from "../composables/useReactionsData";
import { useFilter } from "../composables/useFilter";
import { UI_TEXT } from "../constants";
import DataView from "../components/DataView.vue";
import ReactionCard from "../components/ReactionCard.vue";
import FilterSection from "../components/FilterSection.vue";

const { allReactions, loading, error, loadData } = useReactionsData();
const { filteredData, handleFiltersChanged } = useFilter(allReactions);
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="loadData" :datas="filteredData" :card-component="ReactionCard">
    <template #filters>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div>
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}
          </div>
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
