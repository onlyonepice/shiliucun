<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('tab-box')" v-if="false">
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
    <h3>储能项目投运规模</h3>
    <operationProject
      v-if="currentTab === 'price'"
      :formOptions="formOptions"
    />
  </div>
  <!-- <NpsMark
    module="查中标"
    title="「查中标」"
    apiText="checkWinningNpsFeedBack"
    npsConfigCode="FIND_WINNINGBIDS"
  /> -->
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
} from "@/api/data";
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import operationProject from "./operationProject/enter.vue";

const ns = useNamespace("dataProject");
const tabList = ref([
  {
    code: "bidwin_month_click",
    name: "储能项目投运规模",
    value: "price",
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
.es-dataProject {
  padding-top: 80px;
  padding-bottom: 50px;
  h3 {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    margin-bottom: 32px;
  }
}
.es-dataProject-tab-box {
  @include widthAndHeight(100%, 56px);
  border-bottom: 1px solid #dbdce2;
  display: flex;
  margin-bottom: 24px;
  .es-dataProject-tab_item {
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
