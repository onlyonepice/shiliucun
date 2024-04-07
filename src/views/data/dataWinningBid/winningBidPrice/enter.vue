<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <div
        v-for="(item, index) in options"
        :style="{ marginRight: index === options.length - 1 ? '16px' : '24px' }"
        :key="item.label"
        class="select-item"
      >
        <span class="label">
          {{ item.label }}
        </span>
        <Select
          v-bind="item.bind"
          :defaultValue="requestData[item.model]"
          type="cascader"
          width="256px"
        />
      </div>
      <p class="line" />
      <el-button type="primary">下载图片</el-button>
    </div>
    <div class="hint">
      <img :src="lament_icon" alt="" />
      <span
        >中标价格在去除最高值和最低值后，以能量规模（MWh）为权重，使用加权平均的方法计算。</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidPrice");
import { get } from "lodash";
import { priceFormOptions } from "../data.js";
import lament_icon from "@/assets/img/common/lament_icon.png";
const props = defineProps({
  formOptions: {
    type: Array,
    default: () => [],
  },
});
const requestData = ref({
  biddingContent: "",
  technologyType: "",
  applicationScenarios: "",
});
const options = ref(priceFormOptions());
interface response {
  datas: any;
}
watch(
  () => props.formOptions,
  (res: response[]) => {
    console.log(res, "res======", options);
    if (res.length > 0) {
      options.value.forEach((item) => {
        switch (item.model) {
          case "biddingContent":
            item.bind.options = res[0].datas;
            break;
          case "technologyType":
            item.bind.options = res[1].datas;
            break;
          case "applicationScenarios":
            item.bind.options = res[3].datas;
            break;
        }
      });
      res.forEach((item, index) => {
        switch (index) {
          case 0:
            requestData.value.biddingContent = get(
              item.datas.find((item) => item.defaultValue),
              "paramDesc",
              "2",
            );
            break;
          case 1:
            requestData.value.technologyType = get(
              item.datas.find((item) => item.defaultValue),
              "paramDesc",
              "1",
            );
            break;
          case 2:
            requestData.value.applicationScenarios = get(
              item.datas.find((item) => item.defaultValue),
              "paramName",
              "2",
            );
            break;
        }
      });
      console.log(requestData.value, options.value);
    }
  },
);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-winningBidPrice {
  width: 100%;
}
.es-winningBidPrice-filter {
  width: 100%;
  display: flex;
  align-items: center;
  .select-item {
    display: flex;
    align-items: center;
    .label {
      margin-right: 16px;
      @include font(14px.400, rgba(0, 0, 0, 0.6), 22px);
    }
  }
  .line {
    width: 1px;
    height: 24px;
    background: #dbdce2;
    margin: 0 15px 0 16px;
  }
  .hint {
    width: 100%;
    margin: 8px 0 32px 0;
    background-color: #eff4ff;
  }
}
</style>
