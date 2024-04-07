<template>
  <div :class="['es-commonPage', ns.b()]">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
    <template v-if="contentFilter.length !== 0 && timeFilter.length !== 0">
      <Search
        v-if="choseTabs === 1"
        :biddingContentFilter="biddingContentFilter"
      />
      <MonthlyAnalysis v-if="choseTabs === 2" :contentFilter="contentFilter" />
      <BusinessAnalysis
        v-if="choseTabs === 3"
        :contentFilter="contentFilter"
        :timeFilter="timeFilter"
      />
      <AreaAnalysis
        v-if="choseTabs === 4"
        :contentFilter="contentFilter"
        :timeFilter="timeFilter"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
interface TabsList {
  id: number;
  name: string;
}
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import Search from "./components/search.vue";
import MonthlyAnalysis from "./components/monthlyAnalysis.vue";
import BusinessAnalysis from "./components/businessAnalysis.vue";
import AreaAnalysis from "./components/areaAnalysis.vue";
import {
  getTenderFilterApi,
  getTenderTimeFilterApi,
  getBiddingContentApi,
} from "@/api/data";
import { NOOP } from "@vue/shared";
const { VITE_I_REPORT_URL } = import.meta.env;
const ns = useNamespace("dataTender");
const choseTabs: Ref<number> = ref(2); // 选中的标签栏
const contentFilter: Ref<Array<any>> = ref([]); // 招标内容筛选项
const timeFilter: Ref<Array<any>> = ref([]); // 招标时间筛选项
const biddingContentFilter: Ref<Array<any>> = ref([
  {
    paramDesc: "招标内容",
    dropDownBoxResp: [
      {
        id: 0,
        paramDesc: "全部",
      },
    ],
  },
]); // 招标查找-招标内容筛选项
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "招标查找" },
  { id: 2, name: "招标月度分析" },
  { id: 3, name: "招标企业分析" },
  { id: 4, name: "招标地区分析" },
]);
// 选择标签栏
const onHandleClick = (id: number) => {
  if (id === 1) {
    return window.open(
      VITE_I_REPORT_URL + "#/stored-leading/tenderDynamics",
      "externalWindow",
    );
  } else {
    choseTabs.value = id;
  }
};
// 招标查找-招标内容筛选项
const getContentFilter = async () => {
  const { resp_code, datas }: any = await getBiddingContentApi();
  if (resp_code === 0) {
    biddingContentFilter.value[0].dropDownBoxResp =
      biddingContentFilter.value[0].dropDownBoxResp.concat(datas);
  }
};
getContentFilter();
// 获取招标筛选项数据
const getTenderFilter = async () => {
  try {
    const { resp_code, datas }: any = await getTenderFilterApi();
    resp_code === 0 && (contentFilter.value = datas);
  } catch (error) {
    NOOP();
  }
};
// 获取招标时间筛选项数据
const getTenderTimeFilter = async () => {
  try {
    const { resp_code, datas }: any = await getTenderTimeFilterApi();
    resp_code === 0 && (timeFilter.value = datas);
  } catch (error) {
    NOOP();
  }
};
getTenderFilter();
getTenderTimeFilter();
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-dataTender {
  padding: 80px 0;
}
</style>
