<template>
  <div class="skeleton-screen">
    <div class="title-box" />
    <div class="skeleton-screen-filter-box">
      <div class="skeleton-screen-filter">
        <div v-for="i in 6" :key="i" class="filter-item" />
      </div>
      <div class="skeleton-screen-filter">
        <div v-for="i in 18" :key="i" class="filter-item" />
      </div>
      <div class="skeleton-screen-filter">
        <div v-for="i in 4" :key="i" class="filter-item" />
      </div>
    </div>
    <div class="list-title-box" />
    <div class="list-box">
      <div v-for="i in 5" :key="i" class="item-box">
        <div class="item-box-1" />
        <div class="item-box-2" />
        <div class="item-box-3" />
        <div class="item-box-4" />
      </div>
    </div>
    <div class="list-title-box" />
    <div class="list-box">
      <div v-for="i in 15" :key="i" class="item-box">
        <div class="item-box-1" />
        <div class="item-box-2" />
        <div class="item-box-3" />
        <div class="item-box-4" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.skeleton-screen {
  .title-box {
    @include widthAndHeight(160px, 44px);
    @include box(0, 0, #f2f3f5, 8px);
  }

  .skeleton-screen-filter-box {
    padding-top: 34px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e8eaef;

    .skeleton-screen-filter {
      margin-top: 16px;
      @include flex(center, flex-start);

      .filter-item {
        @include widthAndHeight(45px, 22px);
        @include box(0, 0, #f2f3f5, 4px);
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }

        &:first-child {
          width: 28px;
        }
      }

      &:nth-child(2) {
        justify-content: space-between;

        .filter-item {
          margin: 0;

          &:nth-child(5n) {
            width: 64px;
          }
        }
      }

      &:nth-child(3) {
        .filter-item {
          &:nth-child(2n) {
            width: 64px;
          }

          &:first-child {
            margin-left: 44px;
            width: 45px;
          }
        }
      }
    }
  }

  .list-title-box {
    @include widthAndHeight(80px, 28px);
    @include box(0, 0, #f2f3f5, 4px);
    margin: 24px 0 16px 0;
  }

  .list-box {
    @include flex(center, space-between);

    .item-box {
      @include widthAndHeight(18%, auto);
      width: calc(211 / 1152 * 100%);
      margin-top: 24px;

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        margin-top: 0;
      }

      .item-box-1 {
        @include widthAndHeight(100%, 277px);
        @include box(0, 0, #f2f3f5, 4px);
      }

      .item-box-2 {
        @include widthAndHeight(100%, 48px);
        @include box(0, 0, #f2f3f5, 4px);
        margin-top: 16px;
      }

      .item-box-3 {
        @include widthAndHeight(100%, 22px);
        @include box(0, 0, #f2f3f5, 4px);
        margin-top: 8px;
      }

      .item-box-4 {
        @include widthAndHeight(166px, 22px);
        @include box(0, 0, #f2f3f5, 4px);
        margin-top: 4px;
      }
    }
  }
}
</style>
