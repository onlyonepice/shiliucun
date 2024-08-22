<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
      <el-skeleton animated :rows="1">
        <template #template>
          <el-skeleton-item style="height: 32px; margin-bottom: 8px" />
          <div :class="ns.b('item')" v-for="item in 5" :key="item">
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
          <div :class="ns.b('item')" v-for="item in 9" :key="item">
            <el-skeleton-item style="height: 24px; margin-bottom: 12px" />
            <div :class="ns.b('item-content')">
              <el-skeleton-item
                style="width: 40px; height: 24px; margin-right: 8px"
              />
              <el-skeleton-item style="width: 144px; height: 24px" />
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
const ns = useNamespace("dataSearch-skeleton");
const leftItem = computed(() => {
  return "width: 80%; height: 24px; margin-bottom: 8px";
});
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-dataSearch-skeleton {
  @include flex(flex-start, space-between, nowrap);
}
.es-dataSearch-skeleton-left {
  width: 270px;
  margin-right: 24px;
  .es-dataSearch-skeleton-item {
    @include flex(flex-start, flex-end, wrap);
  }
}
.es-dataSearch-skeleton-right {
  width: 858px;
  .es-dataSearch-skeleton-item {
    .es-dataSearch-skeleton-item-content {
      @include flex(flex-start, flex-start, nowrap);
      padding-bottom: 15px;
      border-bottom: 1px solid #dbdce2;
      margin-bottom: 24px;
    }
  }
}
</style>
