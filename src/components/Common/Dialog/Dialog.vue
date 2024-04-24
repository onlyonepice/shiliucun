<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :style="{ width: width, height: height }"
  >
    <img
      :class="ns.b('cancel')"
      :src="CancelIcon"
      @click="handleClose(false)"
      alt=""
    />
    <slot name="content" />
    <template #footer v-if="showFoot">
      <div class="dialog-footer">
        <el-button @click="handleClose(false)">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleClose(true)">{{
          confirmText
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import CancelIcon from "@/assets/img/common/cancel.png";
const ns = useNamespace("dialog");
const dialogVisible: Ref<boolean> = ref(false);
const emits = defineEmits(["onHandleClose"]);
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "" },
  cancelText: { type: String, default: "取消" },
  confirmText: { type: String, default: "确定" },
  width: { type: String, default: "" },
  height: { type: String, default: "" },
  showFoot: { type: Boolean, default: true },
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
.es-dialog {
  @include absolute(1, 50%, 0, 0, 50%);
  @include margin(0, 0, 0, 0);
  transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 0 !important;
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
    @include padding(24px, 24px, 24px, 24px);
    margin-right: 0;
    text-align: center;
  }
  .el-dialog__body {
    height: auto;
    line-height: 22px;
    @include padding(0, 24px, 0, 24px);
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }
  .el-dialog__headerbtn {
    right: 14px;
  }
  .el-dialog__footer {
    @include padding(24px, 24px, 24px, 24px);
  }
  .el-button {
    @include widthAndHeight(88px, 32px);
  }
  .el-button + .el-button {
    margin-left: 8px;
  }
}
.es-dialog-cancel {
  @include widthAndHeight(28px, 28px);
  @include absolute(1, 24px, 18px, none, none);
  cursor: pointer;
}
</style>
