<template>
  <div :class="ns.b()">
    <img :class="ns.b('icon')" :src="EmptyIcon" alt="" />
    <p :class="ns.b('title')">暂无数据</p>
    <p :class="ns.b('desc')">数据快马加鞭补全中～</p>
  </div>
</template>

<script setup lang="ts">
import EmptyIcon from "@/assets/img/common/empty-data-icon.png";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("emptyData");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-emptyData {
  text-align: center;
}
.es-emptyData-icon {
  @include widthAndHeight(120px, 120px);
}
.es-emptyData-title {
  @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
}
.es-emptyData-desc {
  margin-top: 4px;
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
</style>
