<template>
  <div :class="ns.b('hint')">
    <img :src="lament_icon" alt="" />
    <span>{{ title }}</span>
  </div>
</template>
<script lang="ts" setup>
import lament_icon from "@/assets/img/common/lament_icon.png";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("echartsTips");
defineProps({
  title: {
    type: String,
    default: "仅含项目级中标，不含集采/框架",
  },
});
</script>
<style lang="scss" scoped>
@import "@/style";

.es-echartsTips-hint {
  width: 100%;
  margin: 8px 0 32px 0;
  background-color: #eff4ff;
  height: 32px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  span {
    font-weight: 400;
    @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
  }
}
</style>
