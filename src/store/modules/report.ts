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
        en: "INTERVIEW_EXPERT",
        ch: "专家访谈",
        path: "/expertInterviews",
      },
      {
        en: "QUARTERLY_AND_MONTHLY_REPORTS",
        ch: "周月季报",
        path: "/quarterlyMonthlyReports",
      },
      { en: "WHITE_PAPER", ch: "白皮书", path: "/reportWhitePaper" },
      {
        en: "collection",
        ch: "我的收藏",
        path: "/homePersonal",
      },
      {
        en: "winningTheBid",
        ch: "中标",
        path: "/dataWinningBid",
      },
    ],
    reportMapList2: [
      {
        en: "ONLINE_REPORT",
      },
    ],
  }),
  actions: {
    getReportMapList(key: string) {
      const _data = this.reportMapList.filter((item: any) => {
        return (
          item.en === key || item.ch === key || item.path.indexOf(key) !== -1
        );
      });
      return _data[0];
    },
  },
});

export function useUserStoreHook() {
  return reportStore(store);
}
