<template>
  <el-dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    style="padding: 0"
  >
    <img :src="ReviseCompany" :class="ns.b('img')" />
    <div :class="ns.b('empty')" @click="handleClose" />
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import ReviseCompany from "@/assets/img/common/revise-company.png";
const ns = useNamespace("reviseCompany");
const dialogVisible: Ref<boolean> = ref(false);
const emits = defineEmits(["onHandleClose"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.visible,
  () => {
    dialogVisible.value = props.visible;
  },
  { immediate: true },
);
const handleClose = (type: boolean) => {
  emits("onHandleClose", type);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-reviseCompany {
  width: 400px !important;
  height: 368px !important;
  border-radius: 10px !important;
  translate: 50vw 50vh;
  margin-top: -100px !important;
  margin-left: -184px !important;
  @include relative();
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }
  .el-dialog__headerbtn {
    right: 14px;
  }
}
.es-reviseCompany-img {
  @include widthAndHeight(100%, 100%);
}
.es-reviseCompany-empty {
  @include widthAndHeight(30px, 30px);
  @include absolute(1, 10px, 10px, none, none);
  cursor: pointer;
}
</style>
