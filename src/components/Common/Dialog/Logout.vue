<template>
  <el-dialog
    v-model="dialogVisible"
    title="退出登录"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <img
      :class="ns.b('cancel')"
      :src="CancelIcon"
      @click="handleClose(false)"
      alt=""
    />
    <span>确定退出登录吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleClose(true)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import useNamespace from "@/utils/nameSpace";
import CancelIcon from "@/assets/img/common/cancel.png";
const ns = useNamespace("logoutDialog");
const useUserStore = useUserStoreHook();
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
.es-logoutDialog {
  width: 368px !important;
  height: 200px !important;
  border-radius: 10px !important;
  translate: 50vw 50vh;
  margin-top: -100px !important;
  margin-left: -184px !important;
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
  }
  .el-dialog__body {
    height: 80px;
    line-height: 22px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }
  .el-dialog__headerbtn {
    right: 14px;
  }
}
.es-logoutDialog-cancel {
  @include widthAndHeight(28px, 28px);
  @include absolute(1, 24px, 18px, none, none);
  cursor: pointer;
}
</style>
