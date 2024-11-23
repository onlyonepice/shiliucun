<template>
  <div class="pageHead">
    <div class="pageHead-content">
      <img :src="Logo" alt="" />
      <div
        v-if="useUserStoreHook().$state.token === ''"
        class="pageHead-content-right"
      >
        <!-- <el-button @click="openDialog" class="btn-play">立即游玩</el-button> -->
        <el-button class="btn-share" @click="onShare()">分享链接</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from "@/assets/img/logo.png";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
const onShare = () => {
  var textarea: any = document.createElement("textarea");
  textarea.style.position = "fixed";
  textarea.style.opacity = 0;
  textarea.value = useUserStoreHook().$state.configInfo.share_url;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  ElMessage.success("复制成功");
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.pageHead {
  @include widthAndHeight(100%, 5vw);
  background: #171616;
  padding: 0.625vw;
  .pageHead-content {
    padding: 0.625vw 1.25vw;
    @include flex(center, space-between, nowrap);
    box-sizing: content-box;
    height: 2.5vw;
    img {
      height: 1.66667vw;
    }
  }
}
.btn-play {
  height: 2.08333vw;
  font-size: 0.72917vw;
  line-height: 1.04167vw;
  padding: 1.04167vw !important;
}
.btn-share {
  height: 2.08333vw;
  font-size: 0.72917vw;
  line-height: 1.04167vw;
  padding: 1.04167vw !important;
}
.pageHead-content-right {
  @include flex(center, center, row);
  .btn-login {
    width: 4.16667vw;
    height: 2.08333vw;
  }
}
</style>
