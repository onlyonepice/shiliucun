<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="title">
      <p class="title_text">行业洞察。</p>
      <img :src="rightArrow" alt="" />
    </div>
    <div class="content">
      <IndustryInsightList v-for="item in pageData" :pageData="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useNamespace from '@/utils/nameSpace'
import rightArrow from '@/assets/img/right-arrow.png'
import { getReNewsInFormations } from "@/api/home"
import IndustryInsightList from '@/components/Common/industryInsightList.vue'
const ns = useNamespace('home-industryInsight')
const pageData = ref([])
const getReNewsInFormationsFn = async () => {
  const data = await getReNewsInFormations({
    page: 1, limit: 5, keyword: ''
  })
  if (data.resp_code === 0) {
    pageData.value = data.datas.records;
  }

}
getReNewsInFormationsFn()
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryInsight {
  padding-bottom: 56px;
  min-width: 1080px;
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

  .content {
    width: 100%;
  }
}
</style>