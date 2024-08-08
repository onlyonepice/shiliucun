<template>
  <div v-if="index === 0" :class="ns.b('info')">
    <div v-if="!info.enterprise" />
    <template v-else>
      <div style="position: relative">
        <div :class="ns.be('info', 'bigImg-box')">
          <img
            v-if="info.image && info.image.length > 0"
            :class="ns.be('info', 'bigImg')"
            :src="useUserStoreHook().$state.fileUrl + info.image[0]"
            alt=""
          />
          <EmptyProduct v-else size="120px" />
        </div>
        <img
          v-if="useUserStoreHook().comparedList.length > 2"
          :class="ns.be('info', 'close')"
          :src="CloseCircle"
          alt=""
          @click="onDeleteCompared()"
        />
        <p :class="ns.be('info', 'price')" v-if="info.price">
          参考价<span>{{ info.price }}/kWh起</span>
        </p>
        <div v-else style="height: 29px" />
        <p
          :class="ns.be('info', 'name')"
          style="color: #244bf1; cursor: pointer"
          @click="onClickEnterprise(info.enterpriseId)"
        >
          {{ info.enterprise }}
        </p>
      </div>
    </template>
  </div>
  <template v-if="productType === 'INDUSTRY_ENERGY_STORAGE'">
    <div v-if="index === 1" :class="ns.b('common')" name="产品型号">
      <Select
        v-if="info.models.length > 1"
        title=""
        :options="info.models"
        valueKey="modelName"
        labelKey="modelName"
        width="100%"
        :defaultValue="info.models[0].modelName"
        @onChange="
          ($event) => {
            onChoseProduct($event);
          }
        "
      />
      <p v-else>{{ showData.modelName ? showData.modelName : "-" }}</p>
    </div>
    <div v-if="index === 2" :class="ns.b('enterprise')" name="电池参数" />
    <div v-if="index === 3" :class="ns.b('common')" name="电芯类型">
      {{ showData.batteryTypeName ? showData.batteryTypeName : "-" }}
    </div>
    <div v-if="index === 4" :class="ns.b('common')" name="电池系统能量/kWh">
      {{
        showData.batterySystemEnergy
          ? showData.batterySystemEnergy + "kWh"
          : "-"
      }}
    </div>
    <div v-if="index === 5" :class="ns.b('common')" name="放电深度/%">
      {{ showData.dischargeDepth ? showData.dischargeDepth + "%" : "-" }}
    </div>
    <div v-if="index === 6" :class="ns.b('common')" name="PCS参数" />
    <div v-if="index === 7" :class="ns.b('common')" name="标称电压/V">
      {{
        showData.nominalVoltage && showData.nominalVoltage.length !== 0
          ? showData.nominalVoltage.join("-")
          : "-"
      }}
    </div>
    <div v-if="index === 8" :class="ns.b('common')" name="额定功率/kW">
      {{ showData.ratedPower ? showData.ratedPower + "kW" : "-" }}
    </div>
    <div v-if="index === 9" :class="ns.b('common')" name="系统参数" />
    <div v-if="index === 10" :class="ns.b('common')" name="产品形态">
      {{ showData.productFormName ? showData.productFormName : "-" }}
    </div>
    <div v-if="index === 11" :class="ns.b('common')" name="系统综合效率/%">
      {{
        showData.systemOverallEfficiency
          ? showData.systemOverallEfficiency + "%"
          : "-"
      }}
    </div>
    <div v-if="index === 12" :class="ns.b('common')" name="年衰减率/%">
      {{ showData.annualDecayRate ? showData.annualDecayRate + "%" : "-" }}
    </div>
    <div v-if="index === 13" :class="ns.b('common')" name="冷却方式">
      {{
        showData.coolingMethodName ? showData.coolingMethodName.join(",") : "-"
      }}
    </div>
    <div v-if="index === 14" :class="ns.b('common')" name="尺寸/m*m*m">
      {{ showData.size ? showData.size : "-" }}
    </div>
    <div v-if="index === 15" :class="ns.b('common')" name="产品单价/元/kWh">
      {{
        showData.energyStorageSystemProductUnitPrice
          ? showData.energyStorageSystemProductUnitPrice
          : "-"
      }}
    </div>
  </template>
  <template v-if="productType === 'ENERGY_STORAGE_INVERTER'">
    <div v-if="index === 1" :class="ns.b('common')" name="产品型号">
      <Select
        v-if="info.models.length > 1"
        title=""
        :options="info.models"
        valueKey="modelName"
        labelKey="modelName"
        width="100%"
        :defaultValue="info.models[0].modelName"
        @onChange="
          ($event) => {
            onChoseProduct($event);
          }
        "
      />
      <p v-else>{{ showData.modelName ? showData.modelName : "-" }}</p>
    </div>
    <div v-if="index === 2" :class="ns.b('enterprise')" name="直流侧参数" />
    <div v-if="index === 3" :class="ns.b('common')" name="直流电压范围/V">
      {{
        showData.dcVoltageRange
          ? showData.dcVoltageRange[0] + "-" + showData.dcVoltageRange[1]
          : "-"
      }}
    </div>
    <div v-if="index === 4" :class="ns.b('common')" name="最大直流电流/A">
      {{ showData.maximumDirectCurrent ? showData.maximumDirectCurrent : "-" }}
    </div>
    <div v-if="index === 5" :class="ns.b('common')" name="交流侧参数" />
    <div v-if="index === 6" :class="ns.b('common')" name="额定输出功率/kW">
      {{ showData.ratedOutputPower ? showData.ratedOutputPower : "-" }}
    </div>
    <div v-if="index === 7" :class="ns.b('common')" name="额定交流电压/V">
      {{ showData.ratedACVoltage ? showData.ratedACVoltage : "-" }}
    </div>
    <div v-if="index === 8" :class="ns.b('common')" name="额定交流电流/A">
      {{
        showData.ratedAlternatingCurrent
          ? showData.ratedAlternatingCurrent
          : "-"
      }}
    </div>
    <div v-if="index === 9" :class="ns.b('common')" name="额定交流频率">
      {{ showData.ratedACFrequency ? showData.ratedACFrequency : "-" }}
    </div>
    <div v-if="index === 10" :class="ns.b('common')" name="系统参数" />
    <div v-if="index === 11" :class="ns.b('common')" name="最大效率/%">
      {{ showData.maximumEfficiency ? showData.maximumEfficiency : "-" }}
    </div>
    <div v-if="index === 12" :class="ns.b('common')" name="工作温度范围">
      {{
        showData.operatingTemperatureRange
          ? showData.operatingTemperatureRange
          : "-"
      }}
    </div>
    <div v-if="index === 13" :class="ns.b('common')" name="相对湿度范围">
      {{
        showData.relativeHumidityRange ? showData.relativeHumidityRange : "-"
      }}
    </div>
    <div v-if="index === 14" :class="ns.b('common')" name="海拔高度">
      {{ showData.altitude ? showData.altitude : "-" }}
    </div>
    <div v-if="index === 15" :class="ns.b('common')" name="冷却方式">
      {{
        showData.coolingMethodName ? showData.coolingMethodName.join(",") : "-"
      }}
    </div>
    <div v-if="index === 16" :class="ns.b('common')" name="尺寸（W*H*D）/mm">
      {{ showData.size ? showData.size : "-" }}
    </div>
    <div v-if="index === 17" :class="ns.b('common')" name="重量/kg">
      {{ showData.weight ? showData.weight : "-" }}
    </div>
    <div v-if="index === 18" :class="ns.b('common')" name="产品单价/元/台">
      {{ showData.productPrice ? showData.productPrice : "-" }}
    </div>
  </template>
  <template v-if="productType === 'ELECTRIC_CORE'">
    <div v-if="index === 1" :class="ns.b('common')" name="产品名称">
      {{ info.name ? info.name : "-" }}
    </div>
    <div v-if="index === 2" :class="ns.b('common')" name="产品型号">
      <Select
        v-if="info.models.length > 1"
        title=""
        :options="info.models"
        valueKey="modelName"
        labelKey="modelName"
        width="100%"
        :defaultValue="info.models[0].modelName"
        @onChange="
          ($event) => {
            onChoseProduct($event);
          }
        "
      />
      <p v-else>{{ showData.modelName ? showData.modelName : "-" }}</p>
    </div>
    <div v-if="index === 3" :class="ns.b('common')" name="产品形态">
      {{ showData.shape ? showData.shape : "-" }}
    </div>
    <div v-if="index === 4" :class="ns.b('common')" name="容量/Ah">
      {{ showData.batteryCapacity ? showData.batteryCapacity : "-" }}
    </div>
    <div v-if="index === 5" :class="ns.b('common')" name="充/放电倍率">
      {{ showData.chargeDischargeRate ? showData.chargeDischargeRate : "-" }}
    </div>
    <div v-if="index === 6" :class="ns.b('common')" name="能量密度">
      {{ showData.energyDensity ? showData.energyDensity : "-" }}
    </div>
    <div v-if="index === 7" :class="ns.b('common')" name="循环寿命">
      {{ showData.cycleLife ? showData.cycleLife : "-" }}
    </div>
    <div v-if="index === 8" :class="ns.b('common')" name="尺寸">
      {{ showData.size ? showData.size : "-" }}
    </div>
    <div v-if="index === 9" :class="ns.b('common')" name="产品单价/元/Wh">
      {{ showData.productPrice ? showData.productPrice : "-" }}
    </div>
  </template>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import CloseCircle from "@/assets/img/common/close-icon-circle.png";
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const ns = useNamespace("searchProduct-comparedTable");
const emits = defineEmits(["onChoseProduct", "onDeleteCompared"]);
const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  info: {
    type: Object as any,
    default: () => {},
  },
  choseIndex: {
    type: Number,
    default: 0,
  },
  productType: {
    type: String,
    default: "INDUSTRY_ENERGY_STORAGE",
  },
});
watch(
  () => props.choseIndex,
  (val) => {
    showData.value = props.info.models[val];
  },
);
const showData: Ref<any> = ref(props.info.models[0]);
const onChoseProduct = (data: any) => {
  let _index = 0;
  props.info.models.forEach((item, index) => {
    item.modelName === data && (_index = index);
  });
  emits("onChoseProduct", _index);
};
// 删除对比
const onDeleteCompared = () => {
  emits("onDeleteCompared");
};
// 跳转企业
const onClickEnterprise = (id: string) => {
  window.open(
    `${VITE_INDUSTRIALMAP_URL}/home?enterpriseId=${id}`,
    "externalWindow",
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-comparedTable-info {
  height: 267px;
  text-align: center;
  padding: 24px 0 16px 0;
  &__bigImg-box {
    @include widthAndHeight(171px, 171px);
    @include flex();
    overflow: hidden;
    margin: 8px auto;
  }
  &__bigImg {
    height: 171px;
    object-fit: contain;
  }
  &__price {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    span {
      @include font(20px, 600, #f75964, 28px);
      &::before {
        content: "￥";
        margin-right: 4px;
        margin-left: 8px;
        @include font(14px, 600, #f75964, 22px);
      }
    }
  }
  &__close {
    @include widthAndHeight(20px, 20px);
    @include absolute(1, 0, 0, none, none);
    cursor: pointer;
  }
}
.es-searchProduct-comparedTable-enterprise {
  @include font(14px, 400, #244bf1, 22px);
  cursor: pointer;
}
.es-searchProduct-comparedTable-common {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
}
</style>
