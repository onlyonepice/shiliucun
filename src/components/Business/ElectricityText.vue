<template>
  <h5 :class="ns.b()">
    完整数据来源：
    <el-link :href="VITE_DATABASE_URL" :underline="false" target="_blank">
      EESA储能数据库
    </el-link>
  </h5>
</template>
<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const { VITE_DATABASE_URL } = import.meta.env;
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
