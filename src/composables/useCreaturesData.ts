import { ref, type Ref } from "vue";
import { type Creature } from "../types";
import { loadCreaturesData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

const allCreatures = ref<Creature[]>([]);
const creatureIdMap: Ref<Record<number, Creature>> = ref({});
const creatureNameMap: Ref<Record<string, Creature>> = ref({});
const loading = ref(false);
const error = ref("");
let isDataLoaded = false;

export function useCreaturesData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    try {
      loading.value = true;
      error.value = "";
      allCreatures.value = await loadCreaturesData();
      creatureIdMap.value = {};
      creatureNameMap.value = {};
      allCreatures.value.forEach((creature) => {
        creatureIdMap.value[creature.id] = creature;
        creatureNameMap.value[creature.rawName] = creature;
      });
      isDataLoaded = true;
    } catch (err) {
      console.error("加载生物数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
    } finally {
      loading.value = false;
    }
  };

  return {
    allCreatures,
    creatureIdMap,
    creatureNameMap,
    loading,
    error,
    loadData,
  };
}
