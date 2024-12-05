<template>
  <el-dialog
    v-model="dialogVisible"
    title="邀请码"
    width="400"
    :before-close="handleClose"
    class="share-dialog"
  >
    <div class="share-box">
      <div>{{ useUserStoreHook().$state.userInfo.invite_code }}</div>
      <el-icon
        style="cursor: pointer"
        @click="onInvite(useUserStoreHook().$state.userInfo.invite_code)"
        ><CopyDocument
      /></el-icon>
    </div>
    <p class="share-text">*您可以分享邀请码给好友，好友注册时填写邀请码</p>
    <p class="share-title">邀请链接</p>
    <div class="share-box">
      <div>{{ useUserStoreHook().$state.configInfo.share_url }}</div>
      <el-icon
        style="cursor: pointer"
        @click="onInvite(useUserStoreHook().$state.configInfo.share_url)"
        ><CopyDocument
      /></el-icon>
    </div>
    <p class="share-text">*您可以分享给好友，好友直接注册</p>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { CopyDocument, User } from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
const dialogVisible = ref(true); // 弹窗显示控制
const emits = defineEmits(["close"]);
const handleClose = () => {
  // 关闭弹窗
  emits("close");
};
const onInvite = (url: string) => {
  // 复制
  var textarea: any = document.createElement("textarea");
  textarea.style.position = "fixed";
  textarea.style.opacity = 0;
  textarea.value = url;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  ElMessage.success("复制成功");
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.share-dialog {
  .el-dialog__title {
    color: #ffffff;
  }
  .el-icon {
    @include widthAndHeight(1.25vw, 1.25vw);
  }
  .el-icon svg {
    @include widthAndHeight(1.08333vw, 1.08333vw);
  }
}
.share-box {
  @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  padding: 0.41667vw 0.41667vw 0.41667vw 0.83333vw;
  @include flex(center, space-between, nowrap);
  border-radius: 0.41667vw;
  background-color: #222121;
  margin-bottom: 0.41667vw;
  div {
    width: 80%;
  }
}
.share-text {
  @include font(0.72917vw, 400, #6f6d6d, 1.04167vw);
  margin-bottom: 0.41667vw;
}
.share-title {
  @include font(1.25vw, 400, #ffffff, 1.04167vw);
  margin: 1.5vw 0;
}
</style>
