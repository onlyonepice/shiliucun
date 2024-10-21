<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <el-skeleton animated :rows="1">
        <template #template>
          <div :class="ns.b('item')" style="margin-bottom: 16px">
            <el-skeleton-item
              style="width: 80px; height: 24px; margin-right: 24px"
            />
            <el-skeleton-item
              v-for="_item in 2"
              :key="_item"
              :style="topItem"
            />
          </div>
          <div :class="ns.b('item')">
            <el-skeleton-item
              style="width: 80px; height: 24px; margin-right: 24px"
            />
            <el-skeleton-item
              v-for="_item in 7"
              :key="_item"
              :style="topItem"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <div>
      <el-skeleton animated :rows="1">
        <template #template>
          <div :class="ns.b('content')" v-for="_item in 7" :key="_item">
            <div :class="ns.be('content', 'item')">
              <el-skeleton-item style="width: 368px; height: 32px" />
              <el-skeleton-item style="width: 88px; height: 32px" />
            </div>
            <div :class="ns.be('content', 'item')">
              <el-skeleton-item style="width: 320px; height: 24px" />
              <el-skeleton-item style="width: 150px; height: 24px" />
            </div>
            <el-skeleton-item style="height: 24px" />
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("demandMatching-skeleton");
const topItem = computed(() => {
  return "width: 64px; height: 24px; margin-right: 16px";
});
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-demandMatching-skeleton-top {
  width: 100%;
  padding-bottom: 23px;
  border-bottom: 1px solid #dbdce2;
  margin-bottom: 24px;
}
.es-demandMatching-skeleton-content {
  padding-bottom: 23px;
  border-bottom: 1px solid #dbdce2;
  margin-bottom: 24px;
  .es-demandMatching-skeleton-content__item:nth-of-type(2) {
    margin-bottom: 8px;
  }
}
.es-demandMatching-skeleton-content__item {
  @include flex(center, space-between, nowrap);
  margin-bottom: 24px;
}
</style>
