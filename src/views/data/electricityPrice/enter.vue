<template>
  <div id="electricity-price" class="es-commonPage electricity-price page">
    <div class="price-type">
      <div
        class="price-type__item"
        :class="{ 'price-type__item-chose': chosePriceType === item.id }"
        v-for="item in priceTypeList"
        :key="item.id"
        @click="chosePriceType = item.id"
      >
        {{ item.text }}
      </div>
    </div>
    <!-- 分时/分月电价 -->
    <div v-if="chosePriceType === 1">
      <!-- <ElectricityPriceTime /> -->
    </div>
    <!-- 电价分析 -->
    <div v-if="chosePriceType === 2">
      <ElectricityAnalysis />
    </div>
    <!-- 各省峰谷时段 -->
    <div v-if="chosePriceType === 3">
      <ElectricityPricePeriod />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
// import ElectricityPriceTime from "./electricityPriceTime.vue";
import ElectricityAnalysis from "./electricityAnalysis.vue";
import ElectricityPricePeriod from "./electricityPricePeriod.vue";
const chosePriceType = ref(1);
const priceTypeList: Ref<Array<{ id: number; text: string }>> = ref([
  { id: 1, text: "分时/分月电价" },
  { id: 2, text: "电价分析" },
  { id: 3, text: "各省峰谷时段" },
]);
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.electricity-price {
  .price-type {
    @include flex(center, flex-start);

    .price-type__item {
      @include margin(0, 32px, 0, 0);
      @include padding(6px, 0, 10px, 0);
      @include font(16px, 400, #5b6985, 24px);
      transition: all 0.2s;
      cursor: pointer;
      border-bottom: 2px solid rgba(0, 0, 0, 0);
    }

    .price-type__item-chose {
      @include font(16px, 600, #1d232e, 24px);
      border-bottom: 2px solid #2d5cf6;
    }
  }

  .filter {
    @include flex();
    @include padding(0, 0, 8px, 0);
    @include margin(24px, 0, 24px, 0);
    border-bottom: 1px solid #e5e6ea;
  }

  .flex {
    @include flex(center, space-between);
  }

  .small-price-type {
    @include margin(0, 0, 16px, 0);
  }

  .export-image {
    @include box(5px 12px, none, #2d5cf6, 4px);
    @include font(14px, 400, #ffffff, 22px);
    cursor: pointer;
  }

  #my-chart_electricity-price {
    @include widthAndHeight(100%, 500px);
  }
}
</style>
