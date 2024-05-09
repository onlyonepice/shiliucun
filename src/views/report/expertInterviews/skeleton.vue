<template>
  <div class="skeleton-screen">
    <div class="title-box" />
    <div class="list-box">
      <div v-for="i in 10" :key="i" class="item-box">
        <div class="item-top-box" />
        <div class="item-bottom-box">
          <div class="item-bottom-left-1-box" />
          <div class="item-bottom-left-2-box" />
          <div class="item-bottom-right-2-box" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/style";
.skeleton-screen {
  .title-box {
    @include widthAndHeight(160px, 44px);
    @include box(0, 0, #f2f3f5, 8px);
  }

  .list-box {
    margin-top: 32px;

    .item-box {
      margin-top: 40px;

      &:first-child {
        margin-top: 0;
      }

      .item-top-box {
        @include widthAndHeight(100%, 24px);
        @include box(0, 0, #f2f3f5, 4px);
      }

      .item-bottom-box {
        margin-top: 12px;
        @include flex(center, flex-start);
        .item-bottom-right-2-box,
        .item-bottom-left-1-box,
        .item-bottom-left-2-box {
          @include box(0, 0, #f2f3f5, 4px);
        }
        .item-bottom-left-1-box {
          @include widthAndHeight(45px, 24px);
        }

        .item-bottom-left-2-box {
          @include widthAndHeight(48px, 24px);
          margin-left: 8px;
          margin-right: auto;
        }

        .item-bottom-right-2-box {
          @include widthAndHeight(131px, 24px);
        }
      }
    }
  }
}
</style>
