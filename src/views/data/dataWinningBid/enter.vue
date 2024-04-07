<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('tab-box')">
      <div v-for="item in tabList" :class="ns.b('tab_item')" :key="item.value">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("dataWinningBid");
const tabList = ref([
  {
    code: "bidwin_month_click",
    name: "中标价格分析",
    value: "price",
  },
  {
    name: "中标企业分析",
    value: "enterprise",
    code: "bidwin_company_click",
  },
  {
    name: "中标分析报告",
    value: "report",
    code: "bidwin_region_click",
  },
]);
const currentTab = ref("price");
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-dataWinningBid {
  padding-top: 80px;
}
.es-dataWinningBid-tab-box {
  @include widthAndHeight(100%, 56px);
  border-bottom: 1px solid #dbdce2;
  display: flex;
  .es-dataWinningBid-tab_item {
    @include widthAndHeight(116px, 100%);
    padding-top: 17px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-right: 8px;
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
