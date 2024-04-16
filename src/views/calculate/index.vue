<template>
  <div id="investment-return" class="es-commonPage">
    <Filter
      @onAnalysis="onAnalysis"
      @onReset="onReset"
      @onAddArea="onAddArea"
    />
    <template v-if="filterFinish">
      <div class="es-calculate-evaluate">
        <div class="es-calculate-evaluate__title">
          <h3>测算结果</h3>
          <div
            class="es-calculate-evaluate__title-item"
            v-for="item in evaluateList"
            :key="item.id"
            :type="choseEvaluate === item.text ? item.text : ''"
            :class="
              choseEvaluate === item.text
                ? 'es-calculate-evaluate__title-item--chose'
                : ''
            "
            @click="onEvaluate(item.text)"
          >
            <img
              :src="choseEvaluate === item.text ? item.choseIcon : item.icon"
              alt=""
            />
            <span>{{ item.text }}</span>
          </div>
        </div>
        <el-button type="primary">下载报告</el-button>
      </div>
      <Tabs
        :tabsList="tabsList"
        @onHandleClick="onHandleClick"
        :defaultId="choseTab"
      />
      <div v-show="choseTab === 1">
        <Investment
          v-if="showInvestment"
          :searchParams="searchParams"
          :showInfoList="showInfoList"
          @onChangeFilter="onChangeFilter"
        />
        <Canvas
          v-if="!addAreaType"
          ref="searchCanvas"
          :searchCanvas="searchCanvas"
          :searchParams="searchParams"
          @onSearch="onSearchData"
        />
        <template v-if="showInfoList[0][0].value === 'EMC合同能源'">
          <el-scrollbar>
            <Estimate
              :revenueEstimateList="revenueEstimateList"
              :searchResult="searchResult"
            />
            <Estimate
              :revenueEstimateList="revenueEstimateList"
              :searchResult="searchResultB"
            />
          </el-scrollbar>
        </template>
        <template v-else>
          <Proprietor
            :ownerRevenueEstimateList="ownerRevenueEstimateList"
            :searchResult="searchResult"
          />
        </template>
      </div>
      <div v-show="choseTab === 2">
        <Electric :dischargeList="dischargeList" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import Filter from "./filter/enter.vue";
import Canvas from "./canvas.vue";
import Dissatisfy from "@/assets/img/common/dissatisfy.png";
import ChoseDissatisfy from "@/assets/img/common/chose-dissatisfy.png";
import Normal from "@/assets/img/common/normal.png";
import ChoseNormal from "@/assets/img/common/chose-normal.png";
import Satisfaction from "@/assets/img/common/satisfaction.png";
import ChoseSatisfaction from "@/assets/img/common/chose-satisfaction.png";
import Estimate from "./table/estimate.vue";
import Electric from "./table/electric.vue";
import Proprietor from "./table/proprietor.vue";
import Investment from "./filter/Investment.vue";
import { apiAnalyzeSearch, apiComment } from "@/api/investment";
import { cloneDeep } from "lodash";
// 展示筛选项内容
const showInfoList: Ref<Array<Array<any>>> = ref([
  [{ title: "模式分析：", value: "" }],
]);
const revenueEstimateList: Ref<any> = ref([]); // 收益估算
const ownerRevenueEstimateList: Ref<any> = ref([]); // 业主自投收益估算
const dischargeList: Ref<any> = ref([]); // 充放电量
const showInvestment = ref(false);
// 查询参数
const searchParams: Ref<any> = ref({
  ownersShare: 10,
  dividedByInvestors: 90,
});
const addAreaType: Ref<boolean> = ref(false); // 添加地区对比
const scrollTop: Ref<number> = ref(0); // 页面滚动距离
const evaluateList: Ref<any> = ref([
  { id: 1, text: "不满意", icon: Dissatisfy, choseIcon: ChoseDissatisfy },
  { id: 2, text: "一般", icon: Normal, choseIcon: ChoseNormal },
  { id: 3, text: "满意", icon: Satisfaction, choseIcon: ChoseSatisfaction },
]); // 评价列表
const choseEvaluate: Ref<string> = ref(""); // 评价
const tabsList = ref([
  { id: 1, name: "金融方案" },
  { id: 2, name: "充放电量" },
]);
const choseTab: Ref<number> = ref(1);
// 是否完成筛选，由子组件控制
const filterFinish: Ref<boolean> = ref(false);
const searchResult: Ref<any> = ref({
  internalRateReturn: "",
  paybackTime: "",
}); // 搜索结果
const searchResultB: Ref<any> = ref({
  internalRateReturn: "",
  paybackTime: "",
}); // 地区B搜索结果
// 是否展示补贴相关检索的展示
// const showSubsidyInfo = computed(() => (itemInfo: any) => {});
let searchCanvas = ref();
watch(
  () => filterFinish.value,
  (val) => {
    val && (searchCanvas.value = ref());
  },
  { immediate: true },
);
// 添加地区对比
const onAddArea = (type: boolean) => {
  addAreaType.value = type;
};
// tab切换
const onHandleClick = (id: number) => {
  choseTab.value !== id && (choseTab.value = id);
};
// 评论
const onEvaluate = async (text: string) => {
  if (choseEvaluate.value === "") {
    choseEvaluate.value = text;
    await apiComment({
      moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
      satisfactionLevel: text,
    });
  }
};
// 修改投资方案筛选项
function onChangeFilter(data: string, type: string) {
  searchParams.value[type] = data;
  if (type === "ownersShare") {
    searchParams.value.dividedByInvestors = 100 - Number(data);
  }
  if (type === "dividedByInvestors") {
    searchParams.value.ownersShare = 100 - Number(data);
  }
  onSearch();
}

function onSearchData(data: any) {
  searchParams.value = data;
  onSearch();
}
// 查询接口
async function onSearch(type? = false, source?: string) {
  let _search: any = cloneDeep(searchParams.value);
  _search.callingMode = type;
  _search.bankRate =
    _search.bankRate !== undefined
      ? Number(_search.bankRate.split("%")[0])
      : "";
  _search.calculationPeriod =
    _search.calculationPeriod !== undefined
      ? Number(_search.calculationPeriod.split("年")[0])
      : "";
  delete _search.choseProduct;
  const { datas, resp_code }: any = await apiAnalyzeSearch(_search);
  if (resp_code === 0) {
    if (source === "searchA") {
      searchResult.value = datas;
    } else {
      return (searchResultB.value = datas);
    }

    showInvestment.value = true;
    const _data = datas.revenueEstimationResps;
    const _discharge = [];
    _data.annualCharge.unshift("-");
    _data.annualDischarge.unshift("-");
    filterFinish.value = true;
    if (showInfoList.value[0][0].value === "EMC合同能源") {
      const _revenueEstimate = [];
      for (let index = 0; index < _data.variationFactor.length; index++) {
        _revenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          ownersAccumulatedIncome: _data.ownersAccumulatedIncome[index],
          cumulativeReturnInvestors: _data.cumulativeReturnInvestors[index],
          investorNetPresentValue: _data.investorNetPresentValue[index],
        });
      }
      revenueEstimateList.value = _revenueEstimate;
    } else {
      const _ownerRevenueEstimate = [];
      for (let index = 0; index < _data.variationFactor.length; index++) {
        _ownerRevenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          innerReturnRate: _data.innerReturnRate[index],
        });
      }
      ownerRevenueEstimateList.value = _ownerRevenueEstimate;
    }
    for (let index = 0; index < _data.variationFactor.length; index++) {
      _discharge.push({
        variationFactor: _data.variationFactor[index],
        annualCharge: _data.annualCharge[index],
        annualDischarge: _data.annualDischarge[index],
      });
    }
    dischargeList.value = _discharge;
    if (source === "searchA" && !addAreaType.value) {
      setTimeout(() => {
        searchCanvas.value.getCanvasData(false);
      }, 200);
      type &&
        setTimeout(() => {
          searchCanvas.value.getSliderConfig();
        }, 400);
    }
  }
}

// 重置按钮
function onReset() {
  filterFinish.value = false;
}
// 开始分析按钮
function onAnalysis(data: any, type: string) {
  type === "searchB" && (addAreaType.value = true);
  const _showInfoList = showInfoList.value;
  _showInfoList[0][0].value =
    data.patternAnalysis === 1 ? "EMC合同能源" : "业主自投";
  searchParams.value = Object.assign(searchParams.value, data);
  searchParams.value.annualDays = 300;
  searchParams.value.bankRate = "5%";
  searchParams.value.calculationPeriod = "10年";
  onSearch(true, type);
}

function updateScrollTop() {
  scrollTop.value = window.scrollY;
}
onMounted(() => {
  window.addEventListener("scroll", updateScrollTop);
});
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
#investment-return {
  padding: 80px 0;
}
.es-calculate-evaluate {
  @include flex(center, space-between, nowrap);
  .es-calculate-evaluate__title {
    @include flex(center, flex-start, nowrap);
  }
  .es-calculate-evaluate__title-item {
    @include widthAndHeight(96px, 32px);
    @include flex(center, center);
    border-radius: 3px;
    border: 1px solid #f2f3f5;
    margin-right: 8px;
    cursor: pointer;
    background: #f2f3f5;
    img {
      @include widthAndHeight(20px, 20px);
      margin-right: 4px;
    }
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
    &:nth-of-type(1) {
      margin-left: 16px;
    }
  }
  div[type="不满意"] {
    background: #fde0e2;
    border: 1px solid #fbb4b9;
  }
  div[type="一般"] {
    background: #fff1d1;
    border: 1px solid #ffbd12;
  }
  div[type="满意"] {
    background: #fff1d1;
    border: 1px solid #ffbd12;
  }
}
</style>
