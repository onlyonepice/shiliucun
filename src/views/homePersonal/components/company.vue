<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的企业</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("homePersonalCompany");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalCompany-top {
  @include flex(center, space-between);
  @include padding(0, 0, 19px, 0);
  border-bottom: 1px solid #dbdce2;
  @include margin(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
</style>
