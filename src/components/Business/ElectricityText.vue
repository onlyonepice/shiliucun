<template>
  <h5 :class="ns.b()">
    完整数据来源：<el-link href="" :underline="false" target="_blank"
      >EESA储能数据库</el-link
    >
  </h5>
</template>
<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("electricityText");
defineProps({
  url: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
@import "@/style";
.es-electricityText {
  float: right;
  margin-top: 8px;
  ::v-deep(.el-link__inner) {
    @include font(14px, 400, #244bf1, 22px);
  }
}
</style>
