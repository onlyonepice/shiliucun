<template>
  <div class="pageHead">
    <div class="pageHead-content">
      <img :src="Logo" alt="" />
      <div v-if="useUserStoreHook().$state.token === ''">
        <el-button @click="openDialog" class="btn-play">立即游玩</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from "@/assets/img/logo.png";
import { useUserStoreHook } from "@/store/modules/user";
const openDialog = () => {
  useUserStoreHook().openLogin(true, "login");
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
</style>
