<template>
  <div class="skeleton-screen">
    <div class="skeleton-screen-left">
      <div class="skeleton-screen-left-content" />
    </div>
    <div class="skeleton-screen-right">
      <div class="skeleton-screen-right-top">
        <div class="subElement-1" />
        <div class="subElement-2">
          <div class="subElement-2-1" v-for="i in 2" :key="i" />
        </div>
        <div class="subElement-3" />
        <div class="subElement-4" />
        <div class="subElement-5" />
        <div class="subElement-6" />
        <div class="subElement-7">
          <div class="subElement-7-1" v-for="i in 2" :key="i" />
        </div>
        <div class="subElement-8">
          <div class="subElement-8-1" v-for="i in 2" :key="i" />
        </div>
        <div class="subElement-9">
          <div class="subElement-9-1" v-for="i in 5" :key="i" />
        </div>
        <div class="subElement-10" />
      </div>
      <div class="skeleton-screen-right-bottom">
        <div class="subElement-11" />
        <template v-for="i in 5" :key="i">
          <div class="subElement-12" />
          <div class="subElement-13" />
        </template>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.skeleton-screen {
  @include flex(flex-start, space-between);

  .skeleton-screen-left {
    flex: 1;
    height: 858px;
    @include flex();
    @include box(48px 0, 0 24px 0 0, #fff, 8px);

    .skeleton-screen-left-content {
      @include widthAndHeight(568px, 100%);
      @include box(0, 0, #f2f3f5, 8px);
    }
  }

  .skeleton-screen-right {
    width: 270px;

    .skeleton-screen-right-top {
      @include box(24px, 0, #fff, 8px);

      .subElement-1 {
        @include widthAndHeight(100%, 48px);
        @include box(0, 0, #f2f3f5, 4px);
      }

      .subElement-2 {
        margin-top: 4px;
        @include flex(center, flex-start);

        .subElement-2-1 {
          @include widthAndHeight(45px, 24px);
          @include box(0, 0 0 0 8px, #f2f3f5, 4px);

          &:first-child {
            margin: 0;
          }
        }
      }

      .subElement-3 {
        @include widthAndHeight(100%, 1px);
        @include box(0, 15px 0 0 0, #f2f3f5);
      }

      .subElement-4 {
        @include widthAndHeight(140px, 22px);
        @include box(0, 16px 0 0 0, #f2f3f5, 4px);
      }

      .subElement-5 {
        @include widthAndHeight(192px, 22px);
        @include box(0, 4px 0 0 0, #f2f3f5, 4px);
      }

      .subElement-6 {
        @include widthAndHeight(100%, 32px);
        @include box(0, 16px 0 0 0, #bec9fb, 4px);
      }

      .subElement-7 {
        margin-top: 8px;
        @include flex(center, space-between);

        .subElement-7-1 {
          @include widthAndHeight(107px, 32px);
          @include box(0, 0, #f2f3f5, 4px);
        }
      }

      .subElement-8 {
        margin-top: 32px;
        @include flex(center, space-between);

        .subElement-8-1 {
          &:nth-child(1) {
            @include widthAndHeight(104px, 22px);
            @include box(0, 0, #f2f3f5, 4px);
          }

          &:nth-child(2) {
            @include widthAndHeight(28px, 22px);
            @include box(0, 0 0 0 auto, #ffe1cb, 4px);
          }
        }
      }

      .subElement-9 {
        margin-top: 8px;
        @include flex(center, space-evenly);

        .subElement-9-1 {
          @include widthAndHeight(32px, 32px);
          @include box(0, 0, #f2f3f5);
        }
      }

      .subElement-10 {
        @include widthAndHeight(100%, 32px);
        @include box(0, 24px 0 0 0, #f2f3f5, 4px);
      }
    }

    .skeleton-screen-right-bottom {
      @include box(24px, 24px 0 0 0, #ffffff, 8px);

      .subElement-11 {
        @include widthAndHeight(100%, 24px);
        @include box(0, 0, #f2f3f5, 4px);
      }

      .subElement-12 {
        @include widthAndHeight(100%, 20px);
        @include box(0, 20px 0 0 0, #f2f3f5, 4px);
      }

      .subElement-13 {
        @include widthAndHeight(144px, 20px);
        @include box(0, 4px 0 0 0, #f2f3f5, 4px);
      }
    }
  }
}
</style>
