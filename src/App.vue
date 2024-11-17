<template>
  <PageHead />
  <div class="page-content">
    <PageAside />
    <el-scrollbar class="main-content">
      <router-view />
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
console.log("12313");
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#app {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-variant: tabular-nums;
  background-color: #050505;
  font-feature-settings: "tnum", "tnum";
  min-height: 100vh;
  min-width: 100vw;
  background-size: cover;
  background-attachment: fixed;
}
.page-content {
  padding: 0.625vw;
  @include flex(center, space-between, nowrap);
  .main-content {
    height: calc(100vh - 6.25vw);
    width: 100%;
  }
}
</style>
