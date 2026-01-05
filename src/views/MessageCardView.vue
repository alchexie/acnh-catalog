<script setup lang="ts">
import { useMessageCardsData } from "../composables/useMessageCardsData";
import { useFilter } from "../composables/useFilter";
import { UI_TEXT } from "../constants";
import DataView from "../components/DataView.vue";
import MessageCard from "../components/MessageCard.vue";
import FilterSection from "../components/FilterSection.vue";

const { allMessageCards, loading, error, loadData } = useMessageCardsData();
const { filteredData, handleFiltersChanged } = useFilter(allMessageCards);
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="loadData" :datas="filteredData" :card-component="MessageCard">
    <template #filters>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div>
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.MESSAGE_CARDS_UNIT }}
          </div>
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
