<template>
  <div
    class="white-report-list"
    @click="onDetailReport(pageData)"
    :style="{ width: props.width }"
  >
    <img
      class="poster"
      :src="useUserStore.fileUrl + pageData.reportCover"
      alt=""
    />
    <div class="online_report_paid_bg_box" v-if="pageData.needToBuy">
      <img :src="online_report_paid_bg" class="online_report_paid_bg" alt="" />
      <p class="price">{{ pageData.price ? pageData.price : "-" }}</p>
    </div>

    <p class="title" v-html="pageData.reportName" />
    <p class="author" v-if="pageData.author">
      <span>分析师：</span>
      <span v-html="pageData.author.join('，')" />
    </p>
    <p class="date">编撰日期：{{ pageData.writingTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
import online_report_paid_bg from "@/assets/img/online_report_paid_bg.png";
const router = useRouter();
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: String,
    default: "211px",
  },
});
// 跳转报告详情
const onDetailReport = (item) => {
  if (!getToken()) {
    return useUserStoreHook().openLogin(true);
  }
  router.push(`/reportDetail?id=${item.id}&moduleName=${item.moduleName}`);
};
const useUserStore = useUserStoreHook();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.white-report-list {
  width: 211px;
  position: relative;
  cursor: pointer;

  .poster {
    @include widthAndHeight(100%, 298px);
    margin-bottom: 16px;
    border-radius: 8px;
    border: 1px solid #dbdce2;
    object-fit: scale-down;
    border: 1px solid #dbdce2;
  }
  .online_report_paid_bg_box {
    width: 100%;
    height: 48px;
    top: 250px;
    left: 0;
    position: absolute;
    .online_report_paid_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .price {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 8px;
      @include font(24px, 600, rgba(255, 255, 255, 0.9), 32px);
      &::before {
        content: "¥";
        @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
        margin-right: 2px;
      }
    }
  }

  .tag {
    @include widthAndHeight(40px, 24px);
    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .top-tag {
    background: #f75964;
    color: white;
  }

  .free-tag {
    background: #eff4ff;
    border: 1px solid #244bf1;
    background-color: #eff4ff;
    color: #244bf1;
  }

  .title {
    width: 100%;
    margin-bottom: 8px;
    height: 48px;
    @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
  }

  .author {
    width: 100%;
    display: flex;
    align-items: center;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-bottom: 4px;
  }

  .date {
    width: 100%;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
}
</style>
