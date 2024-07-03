<template>
  <div v-if="index === 0" :class="ns.b('info')">
    <div v-if="!info.enterprise" />
    <template v-else>
      <div style="position: relative">
        <div :class="ns.be('info', 'bigImg-box')">
          <img
            :class="ns.be('info', 'bigImg')"
            :src="useUserStoreHook().$state.fileUrl + info.image[0]"
            alt=""
          />
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
  <template v-else>
    <div v-if="index === 1" :class="ns.b('common')" name="产品名称">
      {{ showData.modelName ? showData.modelName : "-" }}
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
    <div v-if="index === 5" :class="ns.b('common')" name="充/放电倍率/P">
      {{ showData.chargeDischargeRate ? showData.chargeDischargeRate : "-" }}
    </div>
    <div v-if="index === 6" :class="ns.b('common')" name="能量密度/Wh/kg">
      {{ showData.energyDensity ? showData.energyDensity : "-" }}
    </div>
    <div v-if="index === 7" :class="ns.b('common')" name="循环寿命">
      {{ showData.cycleLife ? showData.cycleLife : "-" }}
    </div>
    <div v-if="index === 8" :class="ns.b('common')" name="尺寸/m*m*m">
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
