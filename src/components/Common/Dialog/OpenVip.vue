<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose(false)">我知道了</el-button>
        <el-button type="primary" @click="handleClose(true)">{{
          submitText
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("openVipDialog");
const dialogVisible: Ref<boolean> = ref(false);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "开通VIP会员，继续使用该功能。",
  },
  submitText: {
    type: String,
    default: "开通会员",
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
  useUserStore().openVip(false);
  // useUserStore().$state.openVipSubmitTitle = "开通会员";
  // if (type) {
  //   if (router.currentRoute.value.path === "/reportDetail") {
  //     useUserStore().$state.showMembersBuy = true;
  //   } else {
  //     router.push("/vip");
  //   }
  // }
  type && router.push("/vip");
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
  .el-dialog__footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
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
