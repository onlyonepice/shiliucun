<template>
  <div :class="ns.b()">
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
          <el-link type="primary" :underline="false">{{
            item.linkText
          }}</el-link>
        </div>
      </div>
      <h4 :class="ns.b('title')">项目咨询</h4>
      <div :class="ns.b('consult')">
        <div v-for="item in consultList" :key="item.title">
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
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import Plan1 from "@/assets/img/calculate/calculateLite-step3-plan-1.png";
import Plan2 from "@/assets/img/calculate/calculateLite-step3-plan-2.png";
import Consult1 from "@/assets/img/calculate/calculateLite-step3-consult-1.png";
import Consult2 from "@/assets/img/calculate/calculateLite-step3-consult-2.png";
import Consult3 from "@/assets/img/calculate/calculateLite-step3-consult-3.png";
import Consult4 from "@/assets/img/calculate/calculateLite-step3-consult-4.png";
import { getTechnologyContent_V3Api } from "@/api/calculation";
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
  { title: "项目名称：", value: "1" },
  { title: "分成比例：", value: "1" },
  { title: "项目地区：", value: "1" },
  { title: "总开发成本：", value: "1" },
  { title: "功率/容量：", value: "1" },
  { title: "是否融资：", value: "1" },
  { title: "投资模式：", value: "1" },
  { title: "融资比例：", value: "1" },
  { title: "用电类型：", value: "1" },
  { title: "融资成本：", value: "1" },
  { title: "电压等级：", value: "1" },
  { title: "融资年限：", value: "1" },
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
  },
  {
    text: "找融资",
    imgSrc: Consult2,
  },
  {
    text: "找设备",
    imgSrc: Consult3,
  },
  {
    text: "施工方案",
    imgSrc: Consult4,
  },
]);
const income15: Ref<Array<any>> = ref([
  { text: "EIRR", value: "12", width: "120px" },
  { text: "IRR", value: "12", width: "120px" },
  { text: "回收年限", value: "12", width: "120px" },
  { text: "业主总收益（万元）", value: "12", width: "182px" },
  { text: "业主平均收益（万元）", value: "12", width: "182px" },
]);
const income20: Ref<Array<any>> = ref([
  { text: "EIRR", value: "12", width: "120px" },
  { text: "IRR", value: "12", width: "120px" },
  { text: "回收年限", value: "12", width: "120px" },
  { text: "业主总收益（万元）", value: "12", width: "182px" },
  { text: "业主平均收益（万元）", value: "12", width: "182px" },
]);
watch(
  () => props.step,
  (val) => {
    val === 3 && getReportContent();
  },
  { immediate: true },
);
// 获取报告内容
async function getReportContent() {
  let _data = {};
  const { datas, resp_code } = await getTechnologyContent_V3Api(
    Object.assign(props.filterInfo, { capacityMw: "233kWh", powerMw: "100kW" }),
  );
  if (resp_code === 0) {
    console.log(datas);
  }
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-liteStepThree {
  padding: 44px 0 80px;
  @include flex(flex-start, space-between, nowrap);
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
