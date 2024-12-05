<template>
  <div class="pageHead">
    <div class="pageHead-content">
      <img :src="Logo" alt="" @click="onHome()" style="cursor: pointer;" />
      <div class="pageHead-content-right">
        <!-- <el-button @click="openDialog" class="btn-play">立即游玩</el-button> -->
        <el-button class="btn-share" @click="download()">下载APP</el-button>
        <el-button class="btn-share" @click="onShare()">分享链接</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Logo from "@/assets/img/logo.webp";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const emits = defineEmits(["share"]);
const shareVisible = ref(false); // 分享
const download = () => {
  useUserStoreHook().openDownload(true);
};
const onShare = () => {
  if (useUserStoreHook().$state.token === "") {
    return useUserStoreHook().openLogin(true, "login");
  }
  emits("share");
};
const onHome = () => {
  router.push("/home")
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
