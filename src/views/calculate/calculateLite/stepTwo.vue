<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
      <el-form
        ref="formRef"
        :model="basicInfo"
        label-width="110px"
        :class="ns.b('form')"
        label-position="right"
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
            width="100%"
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
        <div ref="echarts_calculateLite" id="echarts_calculateLite" />
        <h4 :class="ns.b('h4')">合作方案</h4>
        <template v-for="item in stepTwoCooperateList" :key="item.prop">
          <el-form-item
            v-if="item.show"
            :prop="item.prop"
            :rules="item.rules"
            :label="item.title"
          >
            <Select
              :type="item.type"
              :defaultValue="basicInfo[item.prop]"
              :inputText="item.inputText"
              width="100%"
              :options="item.options"
              :sliderText="item.sliderText"
              :controls="item.controls"
              :precision="item.precision"
              :valueKey="item.valueKey ? item.valueKey : 'value'"
              :labelKey="item.labelKey ? item.labelKey : 'label'"
              @onChange="
                ($event) => {
                  onAreaChange($event, item.prop);
                }
              "
            />
          </el-form-item>
        </template>
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
import { stepTwoCapacity, stepTwoCooperate, getUnit } from "./index";
import { getTechnologyContent_V2Api } from "@/api/calculation";
import { ElectricityUsageEchartsOptions } from "./echarts";
import * as echarts from "echarts";
import { useRoute } from "vue-router";
const route = useRoute();
const ns = useNamespace("liteStepTwo");
const stepTwoCooperateList: Ref<Array<any>> = ref(stepTwoCooperate);
const echartsOption = ref(ElectricityUsageEchartsOptions());
const formRef = ref(); // 表单
const emit = defineEmits(["onNext"]);
const step2Info: Ref<any> = ref({}); // 筛选项数据
const props = defineProps({
  filterInfo: {
    type: Object,
    default: () => {},
  },
  step: {
    type: Number,
    default: 1,
  },
});
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
  financeRatio: null, // 融资比例
  financeRate: null, // 融资利率
  financePeriod: null, // 融资年限
});
const filterInfoOut: Ref<any> = ref({}); // 筛选项数据
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
watch(
  () => basicInfo.value.amount,
  (val) => {
    descList.value[0].value = getUnit(val).kw + " / " + getUnit(val).kWh;
    descList.value[1].value = `从经济性和实用性角度出发，综合考虑峰谷套利和需量控制的影响，本项目建议配置${getUnit(val).kw} / ${getUnit(val).kWh}储能`;
  },
  { immediate: true },
);
watch(
  () => props.step,
  (val) => {
    if (val !== 2) {
      return;
    }
    getElectricityTypeTwo();
  },
  { immediate: true },
);
watch(
  () => basicInfo.value.isFinance,
  (val) => {
    stepTwoCooperateList.value.map((item) => {
      item.prop === "financeRatio" && (item.show = val === 1);
      item.prop === "financeRate" && (item.show = val === 1);
      item.prop === "financePeriod" && (item.show = val === 1);
    });
  },
  { immediate: true },
);
watch(
  () => props.filterInfo,
  (val) => {
    if (route.query.id && val.id) {
      basicInfo.value.amount = val.capacity.amount;
      basicInfo.value.sharingRatio = val.cooperationPlan.proportion;
      Object.assign(basicInfo.value, val.cooperationPlan);
      step2Info.value.capacity = val.capacity;
    }
  },
  { immediate: true },
);
// 修改筛选项的值
function changeFilter() {
  const {
    investmentModel,
    isFinance,
    totalCost,
    sharingRatio,
    financeRatio,
    financeRate,
    financePeriod,
  } = basicInfo.value;
  filterInfoOut.value = {
    capacity: step2Info.value.capacity,
    cooperationPlan: {
      investmentModel,
      isFinance,
      totalCost,
      proportion: sharingRatio,
      financeRatio,
      financeRate,
      financePeriod,
    },
    createdBy: step2Info.value.createdBy,
    createdDate: step2Info.value.createdDate,
    updatedBy: step2Info.value.updatedBy,
    updatedDate: step2Info.value.updatedDate,
    id: route.query.id ? route.query.id : step2Info.value.id,
  };
}
// 修改数量
function onAreaChange(val: any, prop: string) {
  const _basicInfo = basicInfo.value;
  _basicInfo[prop] = val;
  if (prop === "amount") {
    getElectricityTypeTwo();
  }
  if (prop === "investmentModel") {
    stepTwoCooperateList.value.map((item) => {
      item.prop === "sharingRatio" && (item.show = val === 1);
    });
  }
  changeFilter();
}
// 获取echarts数据
async function getElectricityTypeTwo() {
  const { amount } = basicInfo.value;
  const { datas, resp_code } = await getTechnologyContent_V2Api(
    Object.assign(props.filterInfo, { capacity: { amount } }),
  );
  if (resp_code === 0) {
    step2Info.value = datas;
    echartsOption.value.series.forEach((item) => {
      switch (item.name) {
        case "充电":
          item.data = datas.capacity.chargeList;
          break;
        case "放电":
          item.data = datas.capacity.dischargeList;
          break;
        case "安装储能前用电负荷":
          item.data = datas.capacity.powerList;
          break;
        case "安装储能后用电负荷":
          item.data = datas.capacity.optimizedLoadList;
          break;
        case "安装储能后最大负荷":
          item.markLine.data[0].yAxis = datas.capacity.optimizedMaxLoad;
          break;
        default:
          break;
      }
    });
    props.step === 2 && createECharts();
  }
}

// 创建图表
function createECharts() {
  const myChart = echarts.init(
    document.getElementById("echarts_calculateLite"),
  );
  myChart.setOption(echartsOption.value);
}
function handleNext() {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    } else {
      emit("onNext");
    }
  });
}
// 暴露方法
defineExpose({ handleNext, filterInfoOut, changeFilter });
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#echarts_calculateLite {
  @include widthAndHeight(100%, 344px);
  margin: 16px 0 24px;
}
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

<style lang="scss">
.es-liteStepTwo-form {
  .el-form-item {
    width: 49%;
  }
  .el-form-item__label {
    justify-content: flex-start;
  }
}
</style>
