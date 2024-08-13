<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
      <el-skeleton animated :rows="1">
        <template #template>
          <el-skeleton-item style="height: 32px; margin-bottom: 8px" />
          <div :class="ns.b('item')" v-for="item in 4" :key="item">
            <el-skeleton-item style="height: 24px; margin-bottom: 8px" />
            <el-skeleton-item
              v-for="_item in 5"
              :key="_item"
              :style="leftItem"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <div :class="ns.b('right')">
      <el-skeleton animated :rows="1">
        <template #template>
          <el-skeleton-item style="height: 48px; margin-bottom: 24px" />
          <div :class="ns.b('item')" v-for="item in 7" :key="item">
            <el-skeleton-item
              style="width: 320px; height: 32px; margin-bottom: 12px"
            />
            <div :class="ns.b('item-content')">
              <el-skeleton-item style="width: 658px; height: 24px" />
              <el-skeleton-item style="width: 80px; height: 24px" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("policeSearch-skeleton");
const leftItem = computed(() => {
  return "width: 80%; height: 24px; margin-bottom: 8px";
});
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-policeSearch-skeleton {
  @include flex(flex-start, space-between, nowrap);
}
.es-policeSearch-skeleton-left {
  width: 270px;
  margin-right: 24px;
  .es-policeSearch-skeleton-item {
    @include flex(flex-start, flex-end, wrap);
  }
}
.es-policeSearch-skeleton-right {
  width: 858px;
  .es-policeSearch-skeleton-item {
    .es-policeSearch-skeleton-item-content {
      @include flex(flex-start, space-between, nowrap);
      padding-bottom: 15px;
      border-bottom: 1px solid #dbdce2;
      margin-bottom: 24px;
    }
  }
}
</style>
