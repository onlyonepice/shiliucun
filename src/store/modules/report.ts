import { defineStore } from "pinia";
import { store } from "@/store";

export const reportStore = defineStore({
  id: "report",
  state: () => ({
    reportMapList: [
      {
        en: "ONLINE_REPORT",
        ch: "在线报告",
        path: "/reportOnLine",
      },
      {
        en: "QUARTERLY_AND_MONTHLY_REPORTS",
        ch: "季报月报",
        path: "/quarterlyMonthlyReports",
      },
      { en: "WHITE_PAPER", ch: "白皮书", path: "/reportWhitePaper" },
    ],
  }),
  actions: {
    getReportMapList(key: string) {
      const _data = this.reportMapList.filter((item) => {
        return item.en === key || item.ch === key;
      });
      return _data[0];
    },
  },
});

export function useUserStoreHook() {
  return reportStore(store);
}
