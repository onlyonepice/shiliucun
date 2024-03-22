<template>
  <div :class="[ns.b()]">
    <div class="left">
      <img :src="quotationMark" alt="" />
      <p class="day">23.</p>
      <p class="date">2024-1-4</p>
    </div>
    <div class="right">
      <div class="name-box">
        <p v-if="pageData.isTopping === 1" class="toping">置顶</p>
        <!-- <span class="name">{{ pageData.reportName }}</span> -->
        <a
        class="name" :href="pageData.link || '/'">{{ pageData.reportName }}</a>
      </div>
      <p class="info">展望 24 年工商业储能发展盛况，为了更好地了解不同场景下工商业储能的实际情况，储能领跑者将举办工商业储能系列会议，储能领跑者联盟于 2024 年 1 月 18
        日特别邀请到了储能领域资深专家就产业园区场景进行线上分享与解答，以下是会议核心观点与访谈记录。sssss事实上事实上少时诵诗书是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒ss</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from '@/utils/nameSpace'
import quotationMark from "@/assets/img/quotation-mark.png";
const ns = useNamespace('industryInsightList')
defineProps({
  pageData: {
    type: Object,
    default: () => { { } }
  }
})
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
          color: #244BF1;
        }
      }
    }
  }

  .left {
    @include widthAndHeight(98px, 100%);
    @include padding(8px, 0, 0, 12px);
    position: relative;

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
    border-bottom: 1px solid #DBDCE2;

    .name-box {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .toping {
        @include widthAndHeight(40px, 24px);
        background: #F75964;
        border-radius: 4px;
        @include flex(center, center);
        @include font(14px, 400, rgba(255, 255, 255, 0.9), 20px);
        margin-right: 8px;
      }
      a {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
            text-decoration: none;

            &:hover {
             color: #244BF1;
              // text-decoration: underline;
            }
          }
    }

    .info {
      width: 100%;
      @include font(14px, 400, rgba(0, 0, 0, 0.4), 22px);
      @include textOverflow(2)
    }
  }

}
</style>