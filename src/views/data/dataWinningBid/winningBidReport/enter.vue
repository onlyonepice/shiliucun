<template>
  <div :class="ns.b()">
    <div class="report-list">
      <div class="item">
        <p class="title">储能项目招标&中标信息（2040221～ 20240228）</p>
        <p class="nameAndDate">仇舜尧｜2024-02-28</p>
        <p class="tag">中标</p>
      </div>
    </div>
    <div class="pagination-box">
      <Pagination :total="100" @current-change="onchangeCurrent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidReport");
const onchangeCurrent = (val) => {
  console.log(val);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-winningBidReport {
  width: 100%;

  .report-list {
    width: 100%;
    .item {
      @include widthAndHeight(100%, 110px);
      border-bottom: 1px solid #dbdce2;
      .nameAndDate {
        @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
        margin-bottom: 16px;
      }
      .title {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
        margin-bottom: 4px;
      }
      .tag {
        @include widthAndHeight(40px, 24px);
        background: #fff3ea;
        border-radius: 4px;
        border: 1px solid #ff8d32;
        @include font(12px, 400, #ff8d32, 24px);
        text-align: center;
      }
    }
  }
}
</style>
