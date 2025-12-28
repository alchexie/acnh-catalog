import { ref, type Ref } from "vue";
import { ItemType, Version, type Creature, type Item } from "../types";
import { loadCreaturesData } from "../services/dataService";
import { DATA_LOADING } from "../constants";
import { ItemModel } from "../models";

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

  const converCreateureToItemModel = (creature: Creature) => {
    const item: Item = {
      id: creature.id,
      name: creature.name,
      rawName: creature.name,
      images: creature.images,
      type: ItemType.Miscellaneous,
      ver: Version.The100,
      size: creature.size,
      colors: creature.colors,
      sell: creature.sell,
    };

    return new ItemModel(item);
  };

  return {
    allCreatures,
    creatureIdMap,
    creatureNameMap,
    loading,
    error,
    loadData,
    converCreateureToItemModel,
  };
}
