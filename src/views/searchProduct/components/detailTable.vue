<template>
  <div
    v-if="index === 0"
    :class="ns.b('common')"
    name="产品型号"
    style="font-weight: 600"
  >
    {{ info.modelName ? info.modelName : "-" }}
  </div>
  <div v-if="index === 1" :class="ns.b('common')" name="电池参数" />
  <div v-if="index === 2" :class="ns.b('common')" name="电芯类型">
    {{ info.batteryTypeName ? info.batteryTypeName : "-" }}
  </div>
  <div v-if="index === 3" :class="ns.b('common')" name="电池系统能量/kWh">
    {{ info.batterySystemEnergy ? info.batterySystemEnergy + "kWh" : "-" }}
  </div>
  <div v-if="index === 4" :class="ns.b('common')" name="放电深度/%">
    {{ info.dischargeDepth ? info.dischargeDepth + "%" : "-" }}
  </div>
  <div v-if="index === 5" :class="ns.b('common')" name="PCS参数" />
  <div v-if="index === 6" :class="ns.b('common')" name="标称电压/V">
    {{
      info.nominalVoltage && info.nominalVoltage.length !== 0
        ? info.nominalVoltage.join("-")
        : "-"
    }}
  </div>
  <div v-if="index === 7" :class="ns.b('common')" name="额定功率/kW">
    {{ info.ratedPower ? info.ratedPower + "kW" : "-" }}
  </div>
  <div v-if="index === 8" :class="ns.b('common')" name="系统参数" />
  <div v-if="index === 9" :class="ns.b('common')" name="产品形态">
    {{ info.productFormName ? info.productFormName : "-" }}
  </div>
  <div v-if="index === 10" :class="ns.b('common')" name="系统综合效率/%">
    {{
      info.systemOverallEfficiency ? info.systemOverallEfficiency + "%" : "-"
    }}
  </div>
  <div v-if="index === 11" :class="ns.b('common')" name="年衰减率/%">
    {{ info.annualDecayRate ? info.annualDecayRate + "%" : "-" }}
  </div>
  <div v-if="index === 12" :class="ns.b('common')" name="冷却方式">
    {{ info.coolingMethodName ? info.coolingMethodName.join(",") : "-" }}
  </div>
  <div v-if="index === 13" :class="ns.b('common')" name="尺寸/m*m*m">
    {{ info.size ? info.size : "-" }}
  </div>
  <div v-if="index === 14" :class="ns.b('common')" name="产品单价/元/kWh">
    {{
      info.energyStorageSystemProductUnitPrice
        ? info.energyStorageSystemProductUnitPrice
        : "-"
    }}
  </div>
</template>

<script lang="ts" setup>
// import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("searchProduct-comparedTable");
defineProps({
  index: {
    type: Number,
    default: 0,
  },
  info: {
    type: Object as any,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-comparedTable-common {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
}
</style>
