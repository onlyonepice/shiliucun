<template>
  <div class="skeleton-screen">
    <div class="title-box" />
    <div class="list-box">
      <div v-for="i in 10" :key="i" class="item-box">
        <div class="item-top-box" />
        <div class="item-bottom-box" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/style";
.skeleton-screen {
  .title-box {
    @include widthAndHeight(140px, 44px);
    @include box(0, 0, #f2f3f5, 8px);
  }

  .list-box {
    margin-top: 32px;

    .item-box {
      margin-top: 40px;
      @include flex(flex-start, space-between, nowrap);
      .item-top-box {
        @include widthAndHeight(74px, 64px);
        @include box(0, 0, #f2f3f5, 4px);
      }

      .item-bottom-box {
        @include widthAndHeight(1054px, 80px);
        @include box(0, 0, #f2f3f5, 4px);
      }
    }
  }
}
</style>
