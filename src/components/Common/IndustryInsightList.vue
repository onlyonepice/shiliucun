<template>
  <div :class="[ns.b()]">
    <div class="left">
      <img :src="quotationMark" alt="" />
      <p class="day">{{ new Date(pageData.createTime).getDay() }}</p>
      <p class="date">
        {{ new Date(pageData.createTime).getFullYear() }}-{{
          String(new Date(pageData.createTime).getMonth()).padStart(2, "0")
        }}
      </p>
    </div>
    <div class="right">
      <div class="name-box">
        <p v-if="pageData.isTopping === 1" class="toping">置顶</p>
        <a class="name" :href="pageData.link || '/'" target="_blank">{{
          pageData.reportName
        }}</a>
      </div>
      <p class="info">{{ pageData.contentOverview ?? "-" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
import quotationMark from "@/assets/img/quotation-mark.png";
const ns = useNamespace("industryInsightList");
defineProps({
  pageData: {
    type: Object,
    default: () => {
      {
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-industryInsightList {
  @include widthAndHeight(100%, 96px);
  display: flex;
  margin-bottom: 24px;
  cursor: pointer;

  &:hover {
    .right {
      .name-box {
        .name {
          color: #244bf1;
        }
      }
    }
  }

  .left {
    @include widthAndHeight(98px, 100%);
    @include padding(8px, 0, 0, 12px);
    position: relative;
    z-index: 1;

    img {
      @include widthAndHeight(24px, 18px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }

    .day {
      width: 100%;
      @include font(24px, 600, rgba(0, 0, 0, 0.9), 32px);
      margin-bottom: 4px;
    }

    .date {
      @include font(12px, 400, rgba(0, 0, 0, 0.9), 20px);
    }
  }

  .right {
    flex: 1;
    height: 100%;
    border-bottom: 1px solid #dbdce2;

    .name-box {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .toping {
        @include widthAndHeight(40px, 24px);
        background: #f75964;
        border-radius: 4px;
        @include flex(center, center);
        @include font(14px, 400, rgba(255, 255, 255, 0.9), 20px);
        margin-right: 8px;
      }

      a {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
        text-decoration: none;

        &:hover {
          color: #244bf1;
          // text-decoration: underline;
        }
      }

      .name {
        @include textOverflow(1);
      }
    }

    .info {
      width: 100%;
      @include font(14px, 400, rgba(0, 0, 0, 0.4), 22px);
      @include textOverflow(2);
    }
  }
}
</style>
