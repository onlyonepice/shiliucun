import { defineStore } from "pinia";
import { productType } from "./types";
import { store } from "@/store";

export const useProductStore = defineStore({
  id: "productStore",
  state: (): productType => ({
    industryCommerce: "INDUSTRY_ENERGY_STORAGE",
    batteryCell: "ELECTRIC_CORE",
    converter: "ENERGY_STORAGE_INVERTER",
    other: "OTHERS",
  }),
});

export function useProductStoreHook() {
  return useProductStore(store);
}
