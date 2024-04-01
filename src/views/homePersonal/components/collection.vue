<template>
  <div :class="[ns.b()]">
    <h3>我的收藏</h3>
    <h1>正在开发中...</h1>
  </div>
</template>

<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("homePersonalInfo");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalInfo {
  h1 {
    padding: 100px;
    text-align: center;
  }
}
</style>
