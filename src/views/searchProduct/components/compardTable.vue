<template>
  <div v-if="index === 0" :class="ns.b('info')">
    <div v-if="!info.enterprise" />
    <template v-else>
      <div style="position: relative">
        <img
          :class="ns.be('info', 'bigImg')"
          :src="useUserStoreHook().$state.fileUrl + info.image"
          alt=""
        />
        <img
          v-if="useUserStoreHook().comparedList.length > 2"
          :class="ns.be('info', 'close')"
          :src="CloseCircle"
          alt=""
          @click="onDeleteCompared()"
        />
        <p :class="ns.be('info', 'price')">
          参考价<span>{{ info.price }}/kWh起</span>
        </p>
      </div>
    </template>
  </div>
  <div v-if="index === 1" :class="ns.b('enterprise')" name="生产公司">
    {{ info.enterprise || "-" }}
  </div>
  <div v-if="index === 2" :class="ns.b('common')" name="产品名称">
    {{ info.name || "-" }}
  </div>
  <div v-if="index === 3" :class="ns.b('common')" name="产品型号">
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
    <p v-else>{{ showData.modelName || "-" }}</p>
  </div>
  <div v-if="index === 4" :class="ns.b('common')" name="产品形态">
    {{ showData.productFormName || "-" }}
  </div>
  <div v-if="index === 5" :class="ns.b('common')" name="额定功率">
    {{ showData.ratedPower + "kW" || "-" }}
  </div>
  <div v-if="index === 6" :class="ns.b('common')" name="电池系统能量">
    {{ showData.batterySystemEnergy + "kWh" || "-" }}
  </div>
  <div v-if="index === 7" :class="ns.b('common')" name="标称电压">
    {{ showData.nominalVoltage ? showData.nominalVoltage[0] || "-" : "-" }}
  </div>
  <div v-if="index === 8" :class="ns.b('common')" name="系统综合效率">
    {{ showData.systemOverallEfficiency + "%" || "-" }}
  </div>
  <div v-if="index === 9" :class="ns.b('common')" name="放电深度">
    {{ showData.dischargeDepth + "%" || "-" }}
  </div>
  <div v-if="index === 10" :class="ns.b('common')" name="年衰减率">
    {{ showData.annualDecayRate + "%" || "-" }}
  </div>
  <div v-if="index === 11" :class="ns.b('common')" name="冷却方式">
    {{ showData.coolingMethodName || "-" }}
  </div>
  <div v-if="index === 12" :class="ns.b('common')" name="尺寸">
    {{ showData.size || "-" }}
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import CloseCircle from "@/assets/img/common/close-icon-circle.png";
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
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-comparedTable-info {
  height: 287px;
  text-align: center;
  padding: 24px 0 16px 0;
  &__bigImg {
    @include widthAndHeight(195px, 195px);
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
