<template>
  <div class="priceTracking-mini-page">
    <div class="priceTracking-header">
      <div class="price-type">
        <div @click="choseSpecific = item.id" v-for="item in priceTypeList" :key="item.id" class="price-type__item"
          :class="item.id === choseSpecific ? 'active' : ''">{{ item.text }}</div>
      </div>
    </div>
    <HourlyElectricityPrices v-if="choseSpecific === 1" />
    <ElectricityAnalysis v-if="choseSpecific === 2" />
    <ElectricityPricePeriod v-if="choseSpecific === 3" />
  </div>
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue'
import HourlyElectricityPrices from './hourlyElectricityPrices.vue'
import ElectricityAnalysis from './electricityAnalysis.vue'
import ElectricityPricePeriod from './electricityPricePeriod.vue'
const priceTypeList: Ref<Array<{ id: number; text: string; }>> = ref([
  { id: 1, text: '分时/分月电价' },
  { id: 2, text: '电价分析' },
  { id: 3, text: '各省峰谷时段' }
])
const choseSpecific = ref<number>(1)

</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.priceTracking-mini-page {
  @include box((1.6rem 3.2rem 3.2rem 3.2rem), 0, #F2F3F5);

  .priceTracking-header {
    padding-top: 0.8rem;
    .price-type {
      @include flex(center, left, nowrap);

      .price-type__item {
        @include flex(center, center);
        @include widthAndHeight(auto, 6rem);
        @include box((0 1.8rem), (0 0.8rem 0 0), #ffffff, 0.4rem, (0.2rem solid transparent));
        @include font(2.8rem, 400, rgba(0, 0, 0, .6));
      }

      .active {
        @include box((0 1.8rem), (0 0.8rem 0 0), #EFF4FF, 0.4rem, (0.2rem solid #244BF1));
        @include font(2.8rem, 400, #165DFF);
      }
    }
  }
}
</style>
