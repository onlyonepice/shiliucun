<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <span :class="ns.be('top', 'title')">招标内容</span>
        <Select width="256px" />
      </div>
      <div :class="ns.be('top', 'right')">
        <span :class="ns.be('top', 'line')" />
        <el-button type="primary">下载图片</el-button>
      </div>
    </div>
    <div
      v-loading="loading"
      id="my-chart_electricity-price-analysis"
      ref="myeCharts1"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("dataMonthlyAnalysis");
const loading: Ref<boolean> = ref(false);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-dataMonthlyAnalysis-top {
  @include flex(center, space-between, nowrap);
}
.es-dataMonthlyAnalysis-top__left {
  width: 328px;
  @include flex(center, flex-start, nowrap);
  .es-dataMonthlyAnalysis-top__title {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-right: 16px;
    flex: 1;
  }
}
.es-dataMonthlyAnalysis-top__right {
  @include flex(center, flex-start, nowrap);
  .es-dataMonthlyAnalysis-top__line {
    @include widthAndHeight(1px, 24px);
    display: inline-block;
    background: #dbdce2;
    margin-right: 24px;
  }
}
</style>
