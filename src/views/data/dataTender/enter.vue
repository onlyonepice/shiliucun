<template>
  <div :class="['es-commonPage', ns.b()]">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
    <template
      v-if="
        (contentFilter.length !== 0 && timeFilter.length !== 0) ||
        choseTabs === 1
      "
    >
      <TenderSearch v-if="choseTabs === 1" />
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
      <scenesAnalysis
        v-if="choseTabs === 5"
        :contentFilter="contentFilter"
        :timeFilter="timeFilter"
        :unitFilter="unitFilter"
      />
      <DurationAnalysis
        :formOptions="[contentFilter, timeFilter, regionFilter]"
        v-if="choseTabs === 6"
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
import TenderSearch from "./components/tenderSearch.vue";
import AreaAnalysis from "./components/areaAnalysis.vue";
import MonthlyAnalysis from "./components/monthlyAnalysis.vue";
import BusinessAnalysis from "./components/businessAnalysis.vue";
import DurationAnalysis from "./components/durationAnalysis.vue";
import scenesAnalysis from "./components/scenesAnalysis.vue";
import {
  getTenderFilterApi,
  getTenderTimeFilterApi,
  getBiddingContentApi,
  getUnitListApi,
  getBiddingAreaApi,
} from "@/api/data";
import { NOOP } from "@vue/shared";
import { windowScrollStore } from "@/store/modules/windowScroll";
const ns = useNamespace("dataTender");
const windowScroll = windowScrollStore();
const choseTabs: Ref<number> = ref(4); // 选中的标签栏
const timeFilter: Ref<Array<any>> = ref([]); // 招标时间筛选项
const contentFilter: Ref<Array<any>> = ref([]); // 招标内容筛选项
const unitFilter: Ref<Array<any>> = ref([]); // 统计单位筛选项
const regionFilter: Ref<Array<any>> = ref([]); // 招标地区筛选项
windowScroll.SET_SCROLL_TOP(0);

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
  { id: 5, name: "应用场景分析" },
  { id: 6, name: "储能时长分析" },
]);
// 选择标签栏
const onHandleClick = (id: number) => {
  choseTabs.value = id;
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
// 获取统计单位筛选项
const getTenderUnitFilter = async () => {
  try {
    const { resp_code, datas }: any = await getUnitListApi();
    resp_code === 0 && (unitFilter.value = datas);
  } catch (error) {
    NOOP();
  }
};
// 获取招标地区
async function getTenderArea() {
  try {
    const { resp_code, datas }: any = await getBiddingAreaApi();
    resp_code === 0 && (regionFilter.value = datas);
  } catch (error) {
    NOOP();
  }
}
Promise.all([
  getTenderUnitFilter(),
  getTenderFilter(),
  getTenderTimeFilter(),
  getTenderArea(),
]);
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-dataTender {
  padding: 80px 0;
}
</style>
