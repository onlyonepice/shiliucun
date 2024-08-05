<template>
  <template v-if="productType === 'INDUSTRY_ENERGY_STORAGE'">
    <div
      v-if="index === 0"
      :class="ns.b('common')"
      name="产品型号"
      style="font-weight: 600"
    >
      {{ info[item].modelName ? info[item].modelName : "-" }}
    </div>
    <div v-if="index === 1" :class="ns.b('common')" name="电池参数" />
    <div v-if="index === 2" :class="ns.b('common')" name="电芯类型">
      {{ info[item].batteryTypeName ? info[item].batteryTypeName : "-" }}
    </div>
    <div v-if="index === 3" :class="ns.b('common')" name="电池系统能量/kWh">
      {{
        info[item].batterySystemEnergy
          ? info[item].batterySystemEnergy + "kWh"
          : "-"
      }}
    </div>
    <div v-if="index === 4" :class="ns.b('common')" name="放电深度/%">
      {{ info[item].dischargeDepth ? info[item].dischargeDepth + "%" : "-" }}
    </div>
    <div v-if="index === 5" :class="ns.b('common')" name="PCS参数" />
    <div v-if="index === 6" :class="ns.b('common')" name="标称电压/V">
      {{
        info[item].nominalVoltage && info[item].nominalVoltage.length !== 0
          ? info[item].nominalVoltage.join("-")
          : "-"
      }}
    </div>
    <div v-if="index === 7" :class="ns.b('common')" name="额定功率/kW">
      {{ info[item].ratedPower ? info[item].ratedPower + "kW" : "-" }}
    </div>
    <div v-if="index === 8" :class="ns.b('common')" name="系统参数" />
    <div v-if="index === 9" :class="ns.b('common')" name="产品形态">
      {{ info[item].productFormName ? info[item].productFormName : "-"
      }}{{ item }}
    </div>
    <div v-if="index === 10" :class="ns.b('common')" name="系统综合效率/%">
      {{
        info[item].systemOverallEfficiency
          ? info[item].systemOverallEfficiency + "%"
          : "-"
      }}{{ item }}
    </div>
    <div v-if="index === 11" :class="ns.b('common')" name="年衰减率/%">
      {{ info[item].annualDecayRate ? info[item].annualDecayRate + "%" : "-" }}
    </div>
    <div v-if="index === 12" :class="ns.b('common')" name="冷却方式">
      {{
        info[item].coolingMethodName
          ? info[item].coolingMethodName.join(",")
          : "-"
      }}
    </div>
    <div v-if="index === 13" :class="ns.b('common')" name="尺寸/m*m*m">
      {{ info[item].size ? info[item].size : "-" }}
    </div>
    <div v-if="index === 14" :class="ns.b('common')" name="产品单价/元/kWh">
      {{
        info[item].energyStorageSystemProductUnitPrice
          ? info[item].energyStorageSystemProductUnitPrice
          : "-"
      }}
    </div>
  </template>
  <template v-else>
    <div
      v-if="index === 0"
      :class="ns.b('common')"
      name="产品型号"
      style="font-weight: 600"
    >
      {{ info.modelName ? info.modelName : "-" }}
    </div>
    <div v-if="index === 1" :class="ns.b('common')" name="形态">
      {{ info.shapeName ? info.shapeName : "-" }}
    </div>
    <div v-if="index === 2" :class="ns.b('common')" name="容量/Ah">
      {{ info.batteryCapacity ? info.batteryCapacity : "-" }}
    </div>
    <div v-if="index === 3" :class="ns.b('common')" name="充/放电倍率">
      {{ info.chargeDischargeRate ? info.chargeDischargeRate : "-" }}
    </div>
    <div v-if="index === 4" :class="ns.b('common')" name="能量密度">
      {{ info.energyDensity ? info.energyDensity : "-" }}
    </div>
    <div v-if="index === 5" :class="ns.b('common')" name="循环寿命">
      {{ info.cycleLife ? info.cycleLife : "-" }}
    </div>
    <div v-if="index === 6" :class="ns.b('common')" name="尺寸">
      {{ info.size ? info.size : "-" }}
    </div>
    <div v-if="index === 7" :class="ns.b('common')" name="产品单价（元/Wh）">
      {{ info.productPrice ? info.productPrice : "-" }}
    </div>
  </template>
</template>

<script lang="ts" setup>
// import { computed } from "vue";
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
  item: {
    type: Number,
    default: 0,
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
// const getMerge = computed(() => {
//   return (name: string) => {
//     return props.merge.indexOf(name) !== -1 ? "center" : "left";
//   };
// });
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-comparedTable-common {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
}
</style>
