<template>
  <div :class="ns.b()">详情</div>
</template>

<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("reportDetail");
</script>

<style lang="scss">
@import "@/style/mixin.scss";
</style>
