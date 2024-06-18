<template>
  <el-drawer
    v-model="drawerType"
    title="报名列表"
    :class="[ns.b(), drawerDetail ? ns.b('outside') : '']"
    @close="emits('onHandleClose')"
    :close-on-press-escape="!drawerDetail"
  >
    <span @click="drawerDetail = true">Hi, there!</span>
    <el-drawer
      v-model="drawerDetail"
      title="报名详情"
      :class="ns.b()"
      :modal="false"
      @close="drawerDetail = false"
    >
      <span>111</span>
    </el-drawer>
  </el-drawer>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("demandMatching-applyList");
const emits = defineEmits(["onHandleClose"]);
const drawerType: Ref<boolean> = ref(false);
const drawerDetail: Ref<boolean> = ref(false);

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.drawer,
  (val) => {
    drawerType.value = val;
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatching-applyList-outside.el-drawer.rtl {
  right: 374px;
}
.el-drawer {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
.el-drawer__header {
  margin-top: 56px;
  .el-drawer__title {
    @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  }
}
</style>
