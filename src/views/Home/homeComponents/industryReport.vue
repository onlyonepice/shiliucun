<template>
  <div :class="[ns.b()]">
    <div class="content">
      <div class="title">
        <p class="title_text">行业洞察。</p>
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
import { getWhitePaper } from '@/api/home'
import whiteReportList from '@/components/Common/whiteReportList.vue'
const ns = useNamespace('home-industryReport')
const pageData = ref<[]>([])
const getWhitePaperFn = async () => {
  const data = await getWhitePaper({
    page: 1, limit: 5, keyword: ''
  })
  if (data.resp_code === 0) {
    pageData.value = data.datas.records
  }
}
getWhitePaperFn()

</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryReport {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-bottom: 80px;

  .content {
    @include widthAndHeight(1182px, 494px);

    @media screen and (max-width: 1182px) {
      width: 100vw;
    }

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