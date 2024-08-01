<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('title')">
      <h1>工商业测算Lite版</h1>
      <el-button type="primary">下一步</el-button>
    </div>
    <div :class="ns.b('step')">
      <template v-for="item in stepList" :key="item.id">
        <div :class="ns.be('step', 'number')">{{ item.id }}</div>
        <p>{{ item.name }}</p>
        <div :class="ns.be('step', 'line')" v-if="item.id !== 3" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("calculationLite");
const stepList: Ref<Array<any>> = ref([
  { id: 1, name: "基本信息" },
  { id: 2, name: "容量测算" },
  { id: 3, name: "经济分析" },
]);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-calculationLite-title {
  @include flex(center, space-between, nowrap);
  margin: 80px 0 40px;
}
.es-calculationLite-step {
  @include flex(center, center, nowrap);
}
.es-calculationLite-step__number {
  @include widthAndHeight(24px, 24px);
  @include font(16px, 600, rgba(0, 0, 0, 0.6), 24px);
  background: #f2f3f5;
  text-align: center;
  border-radius: 50%;
  margin-right: 8px;
}
.es-calculationLite-step__line {
  @include widthAndHeight(96px, 1px);
  background: #dbdce2;
  margin: 0 40px;
}
</style>
