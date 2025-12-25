import { ref, type Ref } from "vue";
import { ItemModel } from "../models/ItemModel";
import {
  loadTranslations,
  loadItemsData,
  loadCatalogData,
} from "../services/dataService";
import { DATA_LOADING } from "../constants";

export interface UseItemsDataReturn {
  allItems: Ref<ItemModel[]>;
  itemNameMap: Ref<Record<string, ItemModel>>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
  updateCatalogData: (catalogData: {
    items: Array<{ label: string; unique_id: number }>;
  }) => void;
}

// 全局状态，所有组件共享
const allItems = ref<ItemModel[]>([]) as Ref<ItemModel[]>;
const itemNameMap = ref<Record<string, ItemModel>>({});
const loading = ref(true);
const error = ref("");
let isDataLoaded = false; // 标记数据是否已加载

/**
 * 组合函数：管理物品数据加载
 */
export function useItemsData(): UseItemsDataReturn {
  /**
   * 加载所有数据
   */
  const loadData = async (): Promise<void> => {
    // 如果数据已经加载过，直接返回
    if (isDataLoaded) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value = "";

      // 并行加载翻译和物品数据
      const [, acnhItems, ownedIds] = await Promise.all([
        loadTranslations(),
        loadItemsData(),
        loadCatalogData(),
      ]);

      // 处理物品数据
      allItems.value = acnhItems
        .map((item) => {
          const model = new ItemModel(item);
          model.owned = ownedIds.has(item.id);
          return model;
        })
        .sort((a, b) => a.id - b.id);

      const itemMap: Record<string, ItemModel> = {};
      allItems.value.forEach((item) => {
        const name = item.raw.rawName;
        if (name) {
          itemMap[name] = item as ItemModel;
        }
      });
      itemNameMap.value = itemMap;

      loading.value = false;
      isDataLoaded = true; // 标记数据已加载
    } catch (err) {
      console.error("加载数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
      loading.value = false;
    }
  };

  /**
   * 使用上传的目录数据更新物品拥有状态
   */
  const updateCatalogData = (catalogData: {
    items: Array<{ label: string; unique_id: number }>;
  }): void => {
    const ownedIds = new Set<number>();
    catalogData.items.forEach((item) => {
      ownedIds.add(item.unique_id);
    });

    // 更新所有物品的拥有状态
    allItems.value.forEach((item) => {
      item.owned = ownedIds.has(item.id);
    });
  };

  return {
    allItems,
    itemNameMap,
    loading,
    error,
    loadData,
    updateCatalogData,
  };
}
