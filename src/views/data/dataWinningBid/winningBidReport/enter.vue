<template>
  <div :class="ns.b()">5</div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidReport");
</script>

<style lang="scss">
@import "@/style/mixin.scss";
</style>
