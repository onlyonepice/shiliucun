<template>
  <div class="pageHead">
    <div class="pageHead-content">
      <img :src="Logo" alt="" />
      <div>
        <el-button>立即游玩</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from "@/assets/img/logo.png";
console.log("12313");
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
</style>
