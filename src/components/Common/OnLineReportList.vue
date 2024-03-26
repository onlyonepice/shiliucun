<template>
  <div class="white-report-list" :style="{ width: props.width }">
    <img class="poster" :src="useUserStore.fileUrl + pageData.reportCover" alt="" />
    <div class="top-tag tag" v-if="pageData.isTopping === 1">置顶</div>
    <div class="free-tag tag" v-if="pageData.isFree === 1">免费</div>
    <p class="title">{{ pageData.reportName }}</p>
    <p class="author" v-if="pageData.author">
      <span>分析师：</span>
      <span>{{ pageData.author.join('') }}</span>
    </p>
    <p class="date">编撰日期：{{ pageData.writingTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user'
const props = defineProps({
  pageData: {
    type: Object,
    default: () => { { } }
  },
  width: {
    type: String,
    default: '211px'
  }
})
const useUserStore = useUserStoreHook()
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
    border: 1px solid #DBDCE2;
    object-fit: scale-down;
    border: 1px solid #DBDCE2;
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
    background: #F75964;
    color: white;
  }

  .free-tag {
    background: #EFF4FF;
    border: 1px solid #244BF1;
    background-color: #EFF4FF;
    color: #244BF1;
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