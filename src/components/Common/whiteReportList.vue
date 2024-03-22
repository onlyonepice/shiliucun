<template>
  <div class="white-report-list">
    <img class="poster" :src="useUserStore.fileUrl + pageData.reportCover" alt="" />
    <p class="title">{{ pageData.reportName }}</p>
    <p class="author">
      <span>分析师</span>
      <span>{{ pageData.author }}</span>
    </p>
    <p class="date">编撰日期：{{ pageData.writingTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
defineProps({
  pageData: {
    type: Object,
    default: () => { { } }
  }
})
const useUserStore = useUserStoreHook()
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.white-report-list {
  width: 211px;

  .poster {
    @include widthAndHeight(100%, 298px);
    margin-bottom: 16px;
    border-radius: 8px;
    border: 1px solid #DBDCE2;
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