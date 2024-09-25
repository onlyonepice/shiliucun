<template>
  <div :class="ns.b()" v-loading="loading">
    <div :class="ns.b('left')">
      <h4 :class="ns.b('title')">我的项目</h4>
      <div :class="ns.b('project')">
        <div v-for="item in myProject" :key="item.title">
          <span>{{ item.title }}</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <h4 :class="ns.b('title')">项目方案</h4>
      <div :class="ns.b('plan')">
        <div v-for="item in planList" :key="item.title">
          <img :src="item.imgSrc" alt="" />
          <span>{{ item.desc }}</span>
          <el-link
            type="primary"
            :underline="false"
            :href="item.linkUrl"
            :download="item.desc"
            @click="onLinkClick(item.linkText)"
            >{{ item.linkText }}</el-link
          >
        </div>
      </div>
      <h4 :class="ns.b('title')">项目咨询</h4>
      <div :class="ns.b('consult')">
        <div
          v-for="item in consultList"
          :key="item.title"
          @click="onConsultList(item)"
        >
          <img :src="item.imgSrc" alt="" />
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
    <div :class="ns.b('right')">
      <h4 :class="ns.b('title')">项目收益</h4>
      <h5>· 项目周期15年</h5>
      <div :class="ns.b('income-common')">
        <div
          v-for="item in income15"
          :key="item.text"
          :class="ns.b('income-15')"
          :style="{ width: item.width }"
        >
          <p>{{ item.value }}</p>
          <p>{{ item.text }}</p>
        </div>
      </div>
      <h5>· 项目周期20年</h5>
      <div :class="ns.b('income-common')">
        <div
          v-for="item in income20"
          :key="item.text"
          :class="ns.b('income-20')"
          :style="{ width: item.width }"
        >
          <p>{{ item.value }}</p>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>
  <AddWeChat
    :visible="addWeChatDialog"
    :src="AddWeChatPng"
    @onHandleClose="addWeChatDialog = false"
  />
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import Plan1 from "@/assets/img/calculate/calculateLite-step3-plan-1.png";
import Plan2 from "@/assets/img/calculate/calculateLite-step3-plan-2.png";
import AddWeChatPng from "@/assets/img/calculate/add-weChat.png";
import Consult1 from "@/assets/img/calculate/calculateLite-step3-consult-1.png";
import Consult2 from "@/assets/img/calculate/calculateLite-step3-consult-2.png";
import Consult3 from "@/assets/img/calculate/calculateLite-step3-consult-3.png";
import Consult4 from "@/assets/img/calculate/calculateLite-step3-consult-4.png";
import { getTechnologyContent_V3Api } from "@/api/calculation";
import { getUnit } from "./index";
const loading: Ref<boolean> = ref(false);
// import { useRoute } from "vue-router";
// const route = useRoute();
const addWeChatDialog: Ref<boolean> = ref(false); // 加微信弹窗
const ns = useNamespace("liteStepThree");
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
const myProject: Ref<Array<any>> = ref([
  { title: "项目名称：", value: "" },
  { title: "项目地区：", value: "" },
  { title: "功率/容量：", value: "" },
  { title: "设备数量：", value: "" },
  { title: "投资模式：", value: "" },
  { title: "用电类型：", value: "" },
  { title: "电压等级：", value: "" },
  { title: "分成比例：", value: "" },
  { title: "系统初始投资：", value: "" },
  { title: "是否融资：", value: "" },
]);
const planList: Ref<any[]> = ref([
  {
    imgSrc: Plan1,
    desc: "工商业储能项目初步方案.pptx",
    linkText: "下载报告",
    linkUrl: "",
  },
  {
    imgSrc: Plan2,
    desc: "提供96节点版本电价，获取更加精准的测算报告",
    linkText: "免费咨询",
    linkUrl: "",
  },
]);
const consultList: Ref<any[]> = ref([
  {
    text: "完整测算报告",
    imgSrc: Consult1,
    trackFunction: "pc_CalculationLite_CompleteReport_click",
  },
  {
    text: "找融资",
    imgSrc: Consult2,
    trackFunction: "pc_CalculationLite_Financing_click",
  },
  {
    text: "找设备",
    imgSrc: Consult3,
    trackFunction: "pc_CalculationLite_Machine_click",
  },
  {
    text: "施工方案",
    imgSrc: Consult4,
    trackFunction: "pc_CalculationLite_Construction_click",
  },
]);
const income15: Ref<Array<any>> = ref([
  { type: "eirr", text: "EIRR", value: "0", width: "120px" },
  { type: "irr", text: "IRR", value: "0", width: "120px" },
  { type: "years", text: "回收年限", value: "0", width: "120px" },
  { type: "profit", text: "业主总收益（万元）", value: "0", width: "182px" },
  { type: "eirr", text: "业主平均收益（万元）", value: "0", width: "182px" },
]);
const income20: Ref<Array<any>> = ref([
  { type: "eirr", text: "EIRR", value: "0", width: "120px" },
  { type: "irr", text: "IRR", value: "0", width: "120px" },
  { type: "years", text: "回收年限", value: "0", width: "120px" },
  { type: "profit", text: "业主总收益（万元）", value: "0", width: "182px" },
  { type: "eirr", text: "业主平均收益（万元）", value: "0", width: "182px" },
]);
watch(
  () => props.step,
  (val) => {
    if (val === 3) {
      getReportContent();
      changeFilter();
    }
  },
  { immediate: true },
);
const onLinkClick = (text: string) => {
  if (text === "免费咨询") {
    addWeChatDialog.value = true;
    window.trackFunction("pc_CalculationLite_Consult_click");
  } else {
    window.trackFunction("pc_CalculationLite_Download_click");
  }
};
const onConsultList = (item: any) => {
  addWeChatDialog.value = true;
  window.trackFunction(item.trackFunction);
};
// 修改筛选项
function changeFilter() {
  const _data = props.filterInfo;
  myProject.value[0].value = _data.projectName;
  myProject.value[1].value = _data.region;
  myProject.value[2].value = `${getUnit(_data.capacity.amount).kw} / ${getUnit(_data.capacity.amount).kWh}`;
  myProject.value[3].value = _data.capacity.amount + "台";
  myProject.value[4].value =
    _data.cooperationPlan.investmentModel === 1
      ? "EMC合同能源管理"
      : "业主自投";
  myProject.value[5].value = `${_data.typeOneName}-${_data.typeTwoName}`;
  myProject.value[6].value = _data.tariffLevelName;
  myProject.value[7].value =
    _data.cooperationPlan.investmentModel !== 1
      ? "-"
      : `业主${_data.cooperationPlan.proportion}% / 投资方${100 - _data.cooperationPlan.proportion}%`;
  myProject.value[8].value = `${_data.cooperationPlan.totalCost}元/Wh`;
  myProject.value[9].value = `${_data.cooperationPlan.isFinance === 0 ? "否" : "是"}`;
  if (_data.cooperationPlan.isFinance === 1) {
    myProject.value.push(
      {
        title: "融资比例：",
        value: `${_data.cooperationPlan.financeRatio}%`,
      },
      {
        title: "融资利率：",
        value: `${_data.cooperationPlan.financeRate}%`,
      },
      {
        title: "融资年限：",
        value: `${_data.cooperationPlan.financePeriod}年`,
      },
    );
  }
}
// 获取报告内容
async function getReportContent() {
  loading.value = true;
  let _amount = props.filterInfo.capacity.amount;
  const { datas, resp_code } = await getTechnologyContent_V3Api(
    Object.assign(props.filterInfo, {
      capacityMw: `${233 * _amount}kWh`,
      powerMw: `${100 * _amount}kW`,
    }),
  );
  if (resp_code === 0) {
    loading.value = false;
    planList.value[0].linkUrl = datas.report.url;
    for (let index = 0; index < datas.report.revenueList.length; index++) {
      const { eirr, irr, years, profit, paybackPeriod } =
        datas.report.revenueList[index];
      const _data = index === 0 ? income15.value : income20.value;
      _data[0].value = `${(eirr * 100).toFixed(2)}%`;
      _data[1].value = `${(irr * 100).toFixed(2)}%`;
      _data[2].value = paybackPeriod.toFixed(2);
      _data[3].value = (profit / 10000).toFixed(2);
      _data[4].value = (profit / years / 10000).toFixed(2);
    }
  }
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-liteStepThree {
  padding: 44px 0 8px;
  @include flex(flex-start, space-between, nowrap);
  .el-loading-mask {
    height: 620px;
  }
}
.es-liteStepThree-left {
  width: 760px;
}
.es-liteStepThree-title {
  margin-bottom: 16px;
}
.es-liteStepThree-project {
  @include flex(center, space-between, wrap);
  margin-bottom: 24px;
  div {
    width: 50%;
    margin-bottom: 8px;
    span:nth-of-type(1) {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    }
    span:nth-of-type(2) {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
}
.es-liteStepThree-plan {
  @include flex(center, space-between, nowrap);
  margin-bottom: 24px;
  div {
    @include flex(center);
    padding: 12px 16px;
    background: #f2f3f5;
    border-radius: 4px;
    img {
      margin-right: 8px;
    }
    & > span {
      margin-right: 8px;
    }
  }
}
.es-liteStepThree-consult {
  text-align: center;
  @include flex(center, flex-start, nowrap);
  div {
    padding: 8px 16px;
    margin-right: 8px;
    min-width: 88px;
    cursor: pointer;
    &:hover {
      background: #f2f3f5;
    }
  }
  img {
    @include widthAndHeight(24px, 24px);
  }
  p {
    margin: 2px auto 0;
  }
}
.es-liteStepThree-right {
  flex: 1;
  margin-left: 24px;
  h5 {
    color: rgba(0, 0, 0, 0.9);
    font-weight: 400;
    margin: 16px 0 4px;
  }
}
.es-liteStepThree-income-common {
  width: 368px;
  @include flex(flex-start, space-between, wrap);
  div {
    padding: 16px;
    border-radius: 4px;
    height: 76px;
    p:nth-of-type(1) {
      @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
    }
    p:nth-of-type(2) {
      @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
    }
  }
}
.es-liteStepThree-income-15 {
  background: #fff3eb;
  margin-bottom: 4px;
}
.es-liteStepThree-income-20 {
  background: #feeff0;
  margin-bottom: 4px;
}
</style>
