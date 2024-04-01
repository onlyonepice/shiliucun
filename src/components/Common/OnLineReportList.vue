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
    <div class="top-tag tag" v-if="pageData.isTopping === 1">置顶</div>
    <div class="free-tag tag" v-if="pageData.isFree === 1">免费</div>
    <p class="title">{{ pageData.reportName }}</p>
    <p class="author" v-if="pageData.author">
      <span>分析师：</span>
      <span>{{ pageData.author.join("") }}</span>
    </p>
    <p class="date">编撰日期：{{ pageData.writingTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";
const { VITE_I_REPORT_URL } = import.meta.env;
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
  window.open(
    `${VITE_I_REPORT_URL}/#/report-detail-pdf_V2?id=${item.id}&parent=在线报告&moduleName=${item.moduleName}&from=/online-report`,
    "_blank",
  );
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
