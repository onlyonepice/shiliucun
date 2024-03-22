<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="content">
      <div class="title">
        <p class="title_text">行业报告。</p>
        <img :src="rightArrow" alt="" />
      </div>
      <div class="list-box">
        <whiteReportList :pageData="item" v-for="item in pageData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useNamespace from '@/utils/nameSpace'
import rightArrow from '@/assets/img/right-arrow.png'
import { getOnlineReportSelected } from '@/api/home'
import whiteReportList from '@/components/Common/whiteReportList.vue'
const ns = useNamespace('home-industryReport')
const pageData = ref<[]>([])
const getOnlineReportSelectedFn = async () => {
  const data = await getOnlineReportSelected({
    page: 1, limit: 5, keyword: ''
  })
  if (data.resp_code === 0) {
    pageData.value = data.datas.records
  }
}
getOnlineReportSelectedFn()

</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryReport {
  display: flex;
  justify-content: center;
  height: 580px;

  .content {
    width: 100%;

    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      .title_text {
        @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px)
      }

      img {
        @include widthAndHeight(48px, 48px)
      }
    }

    .list-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

  }
}
</style>