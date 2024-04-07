<template>
  <el-dialog
    v-model="dialogVisible"
    title="开通VIP会员，继续使用该功能。"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose(false)">我知道了</el-button>
        <el-button type="primary" @click="handleClose(true)"
          >开通会员</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("openVipDialog");
const dialogVisible: Ref<boolean> = ref(false);
const { VITE_I_REPORT_URL } = import.meta.env;
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
  !type && useUserStore().openVip(false);
  type &&
    window.open(
      VITE_I_REPORT_URL + "#/relation-servicer?name=订阅会员",
      "externalWindow",
    );
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-openVipDialog {
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
</style>
