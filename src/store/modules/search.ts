import { defineStore } from "pinia";
import { store } from "@/store";

export const searchStore = defineStore({
  id: "search",
  state: () => (
    {
      excludes_all: [
        'quarterly-monthly',
        'white-paper',
        'account-setting',
        'relation-servicer',
        'household',
        'business',
        'attestation',
        'option-multiple-appraisement',
        'absolute-appraisement',
        'tender-example',
        'business-tender',
        'electricity-price'
      ],
      excludes_search: [
        'real-time-consult',
        'real-time-consult-detail',
        'quarterly-monthly',
        'white-paper',
        'relation-servicer',
        'report-detail',
        'report-detail-pdf_V2'
      ],
      excludes_crumbs: [
        'real-time-consult',
        'quarterly-monthly',
        'white-paper',
        'relation-servicer',
        'online-report',
        'my-collect',
        'business-tender'
      ],
      allShow: true,
      searchShow: true,
      crumbsShow: true
    }
  ),
  getters: {
    getScrollTop():number {
      return this.scrollTop;
    }
  },
  actions: {
    setAllShow(val) {
      this.allShow = val
    },
    setSearchShow(val) {
      this.searchShow = val
    },
    setCrumbsShow(val) {
      this.crumbsShow = val
    }
  }
});

export function useUserStoreHook() {
  return searchStore(store);
}