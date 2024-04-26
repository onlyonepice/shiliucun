<template>
  <p :class="[ns.b(), 'es-commonPage']">查产品</p>
</template>

<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("searchProduct");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.home {
  height: calc(50vh - 56px);
}
</style>
