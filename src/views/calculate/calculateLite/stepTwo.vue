<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
      <el-form
        ref="formRef"
        :model="basicInfo"
        label-width="auto"
        :class="ns.b('form')"
      >
        <h4 :class="ns.b('h4')">容量推荐</h4>
        <el-form-item
          v-for="item in stepTwoCapacity"
          :key="item.prop"
          :prop="item.prop"
          :rules="item.rules"
          :label="item.title"
        >
          <Select
            :type="item.type"
            :defaultValue="basicInfo[item.prop]"
            :inputText="item.inputText"
            width="268px"
            :options="item.options"
            :valueKey="item.valueKey ? item.valueKey : 'value'"
            :labelKey="item.labelKey ? item.labelKey : 'label'"
            @onChange="
              ($event) => {
                onAreaChange($event, item.prop);
              }
            "
          />
        </el-form-item>
        <div
          :class="ns.b('descList')"
          v-for="item in descList"
          :key="item.title"
        >
          <p>{{ item.title }}</p>
          <span>{{ item.value }}</span>
        </div>
        <!-- echarts表格 -->
        <div />
        <h4 :class="ns.b('h4')">合作方案</h4>
        <el-form-item
          v-for="item in stepTwoCooperateList"
          :key="item.prop"
          :prop="item.prop"
          :rules="item.rules"
          :label="item.title"
        >
          <Select
            :type="item.type"
            :defaultValue="basicInfo[item.prop]"
            :inputText="item.inputText"
            width="268px"
            :options="item.options"
            :sliderText="item.sliderText"
            :valueKey="item.valueKey ? item.valueKey : 'value'"
            :labelKey="item.labelKey ? item.labelKey : 'label'"
            @onChange="
              ($event) => {
                onAreaChange($event, item.prop);
              }
            "
          />
        </el-form-item>
      </el-form>
    </div>
    <div :class="ns.b('right')">
      <h4>设备信息</h4>
      <p v-for="item in deviceInformation" :key="item.label">
        {{ item.label }}：<span>{{ item.value }}{{ item.unit }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { stepTwoCapacity, stepTwoCooperate } from "./index";
// import { getBiddingContentApi } from "@/api/calculation";
const ns = useNamespace("liteStepTwo");
const stepTwoCooperateList: Ref<Array<any>> = ref(stepTwoCooperate);
const descList: Ref<Array<any>> = ref([
  {
    title: "功率/容量：",
    value: "100MW / 233MWh",
  },
  {
    title: "原因：",
    value:
      "从经济性和实用性角度出发，综合考虑峰谷套利和需量控制的影响，本项目建议配置1kW / 2MWh储能",
  },
]);
const basicInfo: Ref<any> = ref({
  amount: 1,
  investmentModel: 1,
  isFinance: 0,
  sharingRatio: 20,
  totalCost: null,
});
const deviceInformation: Ref<Array<any>> = ref([
  {
    label: "设备单价",
    value: "0.8",
    unit: "元/Wh",
  },
  {
    label: "系统容量",
    value: "233",
    unit: "kWh",
  },
  {
    label: "系统综合效率",
    value: "90",
    unit: "%",
  },
  {
    label: "放电深度",
    value: "95",
    unit: "%",
  },
]);
watch(
  () => basicInfo.value.sharingRatio,
  (val) => {
    stepTwoCooperateList.value.map((item) => {
      if (item.prop === "sharingRatio") {
        item.sliderText[0] = "业主" + val + "%";
        item.sliderText[1] = "投资方" + Number(100 - val) + "%";
      }
    });
  },
  { immediate: true },
);
// 修改地区，获取用电类型1
function onAreaChange(val: any, prop: string) {
  const _basicInfo = basicInfo.value;
  _basicInfo[prop] = val;
}
// 获取echarts数据
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-liteStepTwo {
  @include flex(flex-start, space-between, nowrap);
  margin: 24px 0 0;
}
.es-liteStepTwo-h4 {
  width: 100%;
  margin-bottom: 20px;
  margin: 25px 0 20px;
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-left: 8px;
  }
}
.es-liteStepTwo-descList {
  width: 100%;
  margin-bottom: 8px;
  @include flex(center, flex-start, wrap);
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  }
}
.es-liteStepTwo-form {
  width: 100%;
  @include flex(flex-start, space-between, wrap);
}
.es-liteStepTwo-left {
  width: 760px;
}
.es-liteStepTwo-right {
  @include widthAndHeight(368px, 184px);
  background: #f2f3f5;
  border-radius: 4px;
  padding: 16px;
  h4 {
    margin-bottom: 16px;
  }
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-bottom: 8px;
  }
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  }
}
</style>
