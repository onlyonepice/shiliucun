<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的需求</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("homePersonalNeed");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalNeed-top {
  @include flex(center, space-between, nowrap);
  @include padding(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
</style>
