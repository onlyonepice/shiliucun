<template>
  <el-dialog
    v-model="dialogVisible"
    title="欢迎来到 {{ openLoginType }} 界面"
    width="500"
    :before-close="handleClose"
    class="login-dialog"
  >
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" class="btn-foot">{{
          openLoginType === "login" ? "登入" : "注册"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
const dialogVisible = ref(true);
const openLoginType = ref(""); // 登录方式
watch(
  () => useUserStoreHook().$state.openLoginType,
  (newVal) => {
    openLoginType.value = newVal;
  },
  {
    immediate: true,
  },
);
const handleClose = () => {
  useUserStoreHook().openLogin(false, useUserStoreHook().$state.openLoginType);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.login-dialog {
  width: 26vw;
  .btn-foot {
    width: 100%;
    @include flex(center, center, nowrap);
  }
}
</style>
