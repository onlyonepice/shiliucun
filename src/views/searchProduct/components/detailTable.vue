<template>
  <template v-if="productType === 'INDUSTRY_ENERGY_STORAGE'">
    <Swiper
      v-if="index === 0"
      :info="info"
      prop="modelName"
      @onSlideChange="onSlideChange"
    />
    <Swiper v-if="index === 1" :info="info" prop="" />
    <Swiper v-if="index === 2" :info="info" prop="batteryTypeName" />
    <Swiper v-if="index === 3" :info="info" prop="batterySystemEnergy" />
    <Swiper v-if="index === 4" :info="info" prop="dischargeDepth" />
    <Swiper v-if="index === 5" :info="info" prop="" />
    <Swiper v-if="index === 6" :info="info" prop="nominalVoltage" />
    <Swiper v-if="index === 7" :info="info" prop="ratedPower" />
    <Swiper v-if="index === 8" :info="info" prop="" />
    <Swiper v-if="index === 9" :info="info" prop="productFormName" />
    <Swiper v-if="index === 10" :info="info" prop="systemOverallEfficiency" />
    <Swiper v-if="index === 11" :info="info" prop="annualDecayRate" />
    <Swiper v-if="index === 12" :info="info" prop="coolingMethodName" />
    <Swiper v-if="index === 13" :info="info" prop="size" />
    <Swiper
      v-if="index === 14"
      :info="info"
      prop="energyStorageSystemProductUnitPrice"
    />
  </template>
  <template v-if="productType === 'ENERGY_STORAGE_INVERTER'">
    <Swiper
      v-if="index === 0"
      :info="info"
      prop="modelName"
      @onSlideChange="onSlideChange"
    />
    <Swiper v-if="index === 1" :info="info" prop="/" />
    <Swiper v-if="index === 2" :info="info" prop="dcVoltageRange" />
    <Swiper v-if="index === 3" :info="info" prop="maximumDirectCurrent" />
    <Swiper v-if="index === 4" :info="info" prop="/" />
    <Swiper v-if="index === 5" :info="info" prop="ratedOutputPower" />
    <Swiper v-if="index === 6" :info="info" prop="ratedACVoltage" />
    <Swiper v-if="index === 7" :info="info" prop="ratedAlternatingCurrent" />
    <Swiper v-if="index === 8" :info="info" prop="ratedACFrequency" />
    <Swiper v-if="index === 9" :info="info" prop="/" />
    <Swiper v-if="index === 10" :info="info" prop="maximumEfficiency" />
    <Swiper v-if="index === 11" :info="info" prop="operatingTemperatureRange" />
    <Swiper v-if="index === 12" :info="info" prop="relativeHumidityRange" />
    <Swiper v-if="index === 13" :info="info" prop="altitude" />
    <Swiper v-if="index === 14" :info="info" prop="coolingMethodName" />
    <Swiper v-if="index === 15" :info="info" prop="size" />
    <Swiper v-if="index === 16" :info="info" prop="weight" />
    <Swiper v-if="index === 17" :info="info" prop="productPrice" />
  </template>
  <template v-if="productType === 'ELECTRIC_CORE'">
    <Swiper
      v-if="index === 0"
      :info="info"
      prop="modelName"
      @onSlideChange="onSlideChange"
    />
    <Swiper v-if="index === 1" :info="info" prop="shapeName" />
    <Swiper v-if="index === 2" :info="info" prop="batteryCapacity" />
    <Swiper v-if="index === 3" :info="info" prop="chargeDischargeRate" />
    <Swiper v-if="index === 4" :info="info" prop="energyDensity" />
    <Swiper v-if="index === 5" :info="info" prop="cycleLife" />
    <Swiper v-if="index === 6" :info="info" prop="size" />
    <Swiper v-if="index === 7" :info="info" prop="productPrice" />
  </template>
</template>

<script lang="ts" setup>
// import { computed } from "vue";
import Swiper from "./swiper.vue";
// import useNamespace from "@/utils/nameSpace";
// const ns = useNamespace("searchProduct-comparedTable");
const emits = defineEmits(["onSlideChange"]);
defineProps({
  index: {
    type: Number,
    default: 0,
  },
  info: {
    type: Array,
    default: () => [],
  },
  productType: {
    type: String,
    default: "INDUSTRY_ENERGY_STORAGE",
  },
  merge: {
    type: Array as any,
    default: () => [],
  },
});
function onSlideChange(data) {
  emits("onSlideChange", data);
}
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-comparedTable-common {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  text-align: center;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-searchProductDetail .el-table .el-table__cell {
  padding: 8px 10px 7px 10px !important;
}
.es-searchProductDetail .el-table .cell {
  width: 100%;
  overflow: visible;
  min-height: 22px;
  line-height: 22px;
}
.es-searchProductDetail .el-table__row {
  height: 32px;
}
</style>
