<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('tab-box')">
      <div
        v-for="item in tabList"
        @click="handleTabChange(item.value)"
        :class="ns.b('tab_item')"
        :key="item.value"
      >
        <p
          class="item_name"
          :style="{
            color: item.value === currentTab ? '#244BF1' : ' rgba(0,0,0,0.6)',
          }"
        >
          {{ item.name }}
        </p>
        <p v-if="item.value === currentTab" class="active_line" />
      </div>
    </div>
    <BidPriceNew v-if="currentTab === 'price'" :formOptions="formOptions" />
    <BidScale v-if="currentTab === 'scale'" :formOptions="formOptions" />
    <BidEnterprise
      v-if="currentTab === 'enterprise'"
      :formOptions="formOptions"
    />
    <BidReport v-if="currentTab === 'report'" />
    <BidScenes v-if="currentTab === 'scenes'" :formOptions="formOptions" />
    <Centralized v-if="currentTab === 'centralized'" />

    <TimeAnalysis :formOptions="formOptions" v-if="currentTab === 'duration'" />
  </div>
  <NpsMark
    module="查中标"
    title="「查中标」"
    apiText="checkWinningNpsFeedBack"
    npsConfigCode="FIND_WINNINGBIDS"
  />
</template>

<script setup lang="ts">
import {
  winingBidTime,
  getUnitListApi,
  durationData_V2,
  technologyType_V2,
  getBiddingAreaApi,
  getTenderTimeFilterApi,
  applicationScenariosBox,
  bidWinningContentData_V2,
  newEnergyStorageDurationBox,
} from "@/api/data";
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import BidPriceNew from "./winningBidPriceNew/enter.vue";
import BidScale from "./winningBidScale/enter.vue";
import BidReport from "./winningBidReport/enter.vue";
import BidScenes from "./winningBidScenes/index.vue";
import TimeAnalysis from "./winningTimeAnalysis/index.vue";
import BidEnterprise from "./winningBidEnterprise/enter.vue";
import Centralized from "./winningBidCentralized/index.vue";
const ns = useNamespace("dataWinningBid");
const tabList = ref([
  {
    code: "bidwin_month_click",
    name: "中标价格分析",
    value: "price",
  },
  {
    code: "scale_analysis",
    name: "中标规模分析",
    value: "scale",
  },
  {
    code: "centralized",
    name: "企业集采入围",
    value: "centralized",
  },
  {
    name: "应用场景分析",
    value: "scenes",
    code: "bidwin_scenes_click",
  },
  {
    name: "储能时长分析",
    value: "duration",
    code: "bidwin_scenes_click",
  },
  {
    name: "中标企业分析",
    value: "enterprise",
    code: "bidwin_company_click",
  },
]);

const currentTab = ref("price");
const handleTabChange = (value: string) => {
  currentTab.value = value;
};
interface response {
  resp_code: number;
}
const formOptions = ref([]);
const getSelectData = () => {
  Promise.all([
    bidWinningContentData_V2(),
    technologyType_V2(),
    durationData_V2(),
    applicationScenariosBox("all"),
    winingBidTime(),
    getTenderTimeFilterApi(),
    getUnitListApi(),
    getBiddingAreaApi(),
    newEnergyStorageDurationBox(),
    technologyType_V2("all"),
  ]).then((res) => {
    formOptions.value = res.filter((item: response) => {
      return item.resp_code === 0;
    });
  });
};
getSelectData();
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-dataWinningBid {
  padding-top: 80px;
  padding-bottom: 50px;
}

.es-dataWinningBid-tab-box {
  @include widthAndHeight(100%, 56px);
  border-bottom: 1px solid #dbdce2;
  display: flex;
  margin-bottom: 24px;

  .es-dataWinningBid-tab_item {
    @include widthAndHeight(116px, 100%);
    padding-top: 17px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-right: 8px;
    cursor: pointer;

    .item_name {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    }

    .active_line {
      width: 116px;
      height: 2px;
      background: #244bf1;
      border-radius: 2px 2px 0px 0px;
    }
  }
}
</style>
