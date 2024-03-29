import { defineStore } from "pinia";
import { store } from "@/store";

export const windowScrollStore = defineStore({
  id: "window-scroll",
  state: () => ({
    scrollTop: 0, // 滑动距离顶部距离
  }),
  getters: {
    getScrollTop(): number {
      return this.scrollTop;
    },
  },
  actions: {
    /** 存储滑动距离 */
    SET_SCROLL_TOP(scrollTop: number) {
      this.scrollTop = scrollTop;
    },
  },
});

export function useUserStoreHook() {
  return windowScrollStore(store);
}
