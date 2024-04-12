<template>
  <div id="investment-return" class="es-commonPage">
    <Filter @onAnalysis="onAnalysis" @onReset="onReset" />
    <div v-if="filterFinish">
      <div class="common-title common-title-margin">检索条件</div>
      <div class="showInfo" v-for="(item, index) in showInfoList" :key="index">
        <div v-for="itemInfo in item" :key="itemInfo.title">
          <span v-if="showSubsidyInfo(itemInfo)">
            <span class="showInfo-title">{{ itemInfo.title }}</span>
            <span class="showInfo-desc">{{ itemInfo.value }}</span>
          </span>
        </div>
      </div>
      <div class="common-title common-title-margin">充放电策略</div>
      <p class="common-desc">{{ tipsInfo }}</p>
      <div class="common-title common-title-margin">投资方案</div>
      <div class="filter__content investment-filter__check">
        <Select
          width="30%"
          title="年利用天数"
          :options="yearList"
          valueKey="paramName"
          labelKey="paramDesc"
          :defaultValue="searchParams.annualDays"
          @onChange="
            ($event) => {
              onChangeFilter($event, 'annualDays');
            }
          "
        />
        <Select
          width="30%"
          title="贴现率"
          :options="rateList"
          valueKey="paramName"
          labelKey="paramDesc"
          :defaultValue="searchParams.bankRate"
          @onChange="
            ($event) => {
              onChangeFilter($event, 'bankRate');
            }
          "
        />
        <Select
          width="30%"
          title="测算周期"
          :options="periodList"
          valueKey="paramName"
          labelKey="paramDesc"
          :defaultValue="searchParams.calculationPeriod"
          @onChange="
            ($event) => {
              onChangeFilter($event, 'calculationPeriod');
            }
          "
        />
        <Select
          v-if="showInfoList[0][0].value === 'EMC合同能源'"
          width="30%"
          title="业主分成"
          type="number"
          :defaultValue="searchParams.ownersShare"
          @onChange="
            ($event) => {
              onChangeFilter($event, 'ownersShare');
            }
          "
        />
        <Select
          v-if="showInfoList[0][0].value === 'EMC合同能源'"
          width="30%"
          title="投资方分成"
          type="number"
          :defaultValue="searchParams.dividedByInvestors"
          @onChange="
            ($event) => {
              onChangeFilter($event, 'dividedByInvestors');
            }
          "
        />
      </div>
      <div class="common-title common-title-margin">峰谷价差</div>
      <Canvas
        ref="searchCanvas"
        :searchCanvas="searchCanvas"
        :searchParams="searchParams"
        @onSearch="onSearchData"
      />
      <div v-if="showInfoList[0][0].value === 'EMC合同能源'">
        <div class="revenue-estimate">
          <div class="common-title common-title-margin">
            收益估算<span>/元</span>
          </div>
          <div class="estimate-info">
            <span>资方内部收益率（IRR）：</span>
            <span
              :class="{
                'color-red': searchResult.internalRateReturn.indexOf('-') > -1,
              }"
              >{{
                searchResult.internalRateReturn === "NaN"
                  ? "IRR过低"
                  : searchResult.internalRateReturn + "%"
              }}</span
            >
            <span>动态回收期：</span>
            <span>{{ searchResult.paybackTime }}</span>
          </div>
        </div>
        <el-table
          :data="revenueEstimateList"
          style="width: 100%"
          header-row-class-name="table-class"
        >
          <el-table-column prop="variationFactor" label="年数" />
          <el-table-column prop="financialCost" label="现金流">
            <template #default="scope">
              <span
                :class="{
                  'color-red': scope.row.financialCost.indexOf('-') > -1,
                }"
                >{{ scope.row.financialCost }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="ownersAccumulatedIncome" label="业主累计收益">
            <template #default="scope">
              <span
                :class="{
                  'color-red':
                    scope.row.ownersAccumulatedIncome.indexOf('-') > -1,
                }"
                >{{ scope.row.ownersAccumulatedIncome }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="cumulativeReturnInvestors"
            label="投资方分享收益"
          >
            <template #default="scope">
              <span
                :class="{
                  'color-red':
                    scope.row.cumulativeReturnInvestors.indexOf('-') > -1,
                }"
                >{{ scope.row.cumulativeReturnInvestors }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="investorNetPresentValue" label="投资方净现值">
            <template #default="scope">
              <span
                :class="{
                  'color-red':
                    scope.row.investorNetPresentValue.indexOf('-') > -1,
                }"
                >{{ scope.row.investorNetPresentValue }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div class="revenue-estimate">
          <div class="common-title common-title-margin">收益估算</div>
          <div class="estimate-info">
            <span>IRR(内部收益率)：</span>
            <span
              :class="{
                'color-red': searchResult.internalRateReturn.indexOf('-') > -1,
              }"
              >{{
                searchResult.internalRateReturn === "NaN"
                  ? "IRR过低"
                  : searchResult.internalRateReturn + "%"
              }}</span
            >
          </div>
        </div>
        <el-table
          :data="ownerRevenueEstimateList"
          style="width: 100%"
          header-row-class-name="table-class"
        >
          <el-table-column prop="variationFactor" label="年数" />
          <el-table-column prop="financialCost" label="现金流/元">
            <template #default="scope">
              <span
                :class="{
                  'color-red': scope.row.financialCost.indexOf('-') > -1,
                }"
                >{{ scope.row.financialCost }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="innerReturnRate" label="NPV（净现值/元）">
            <template #default="scope">
              <span
                :class="{
                  'color-red': scope.row.innerReturnRate.indexOf('-') > -1,
                }"
                >{{ scope.row.innerReturnRate }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-title common-title-margin">
        充放电量<span>/万KWh</span>
      </div>
      <el-table
        :data="dischargeList"
        style="width: 100%"
        header-row-class-name="table-class"
        empty-text="暂无数据"
      >
        <el-table-column prop="variationFactor" label="年数" />
        <el-table-column prop="annualCharge" label="年充电量">
          <template #default="scope">
            <span
              v-if="scope.row.annualCharge"
              :class="{ 'color-red': scope.row.annualCharge.indexOf('-') > -1 }"
              >{{ scope.row.annualCharge }}</span
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="annualDischarge" label="年放电量">
          <template #default="scope">
            <span
              v-if="scope.row.annualDischarge"
              :class="{
                'color-red': scope.row.annualDischarge.indexOf('-') > -1,
              }"
              >{{ scope.row.annualDischarge }}</span
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watch, nextTick } from "vue";
import Filter from "./filter/enter.vue";
import Canvas from "./canvas.vue";
import {
  apiYearsList,
  apiRateList,
  apiPeriodList,
  apiAnalyzeSearch,
} from "@/api/investment";
// 展示筛选项内容
const showInfoList: Ref<Array<Array<any>>> = ref([
  [{ title: "模式分析：", value: "" }],
  [
    { title: "地区：", value: "" },
    { title: "用电类型 I：", value: "" },
    { title: "用电类型Ⅱ：", value: "" },
    { title: "期望接入的电压等级：", value: "1～10千伏" },
  ],
  [
    { title: "期望装配储能容量：", value: "1.2kWh" },
    { title: "选择产品：", value: "集装箱产品：(1)   5MWh（45尺标准高箱）" },
    { title: "配置数量：", value: "" },
    { title: "系统单价：", value: "" },
  ],
  [
    { title: "是否补贴：", value: "" },
    { title: "补贴金额：", value: "" },
    { title: "补贴年限：", value: "" },
  ],
]);
//
const revenueEstimateList: Ref<any> = ref([]); // 收益估算
const ownerRevenueEstimateList: Ref<any> = ref([]); // 业主自投收益估算
const dischargeList: Ref<any> = ref([]); // 充放电量
// 查询参数
const searchParams: Ref<any> = ref({
  ownersShare: 20,
  dividedByInvestors: 80,
});
const scrollTop: Ref<number> = ref(0); // 页面滚动距离
const yearList: Ref<Array> = ref([]); // 年利用天数筛选项
const rateList: Ref<Array> = ref([]); // 贴现率筛选项
const periodList: Ref<Array> = ref([]); // 测算周期筛选项
// 是否完成筛选，由子组件控制
const filterFinish: Ref<boolean> = ref(false);
const tipsInfo: Ref<string> = ref(""); // 策略信息
const searchResult = ref({
  internalRateReturn: "",
  paybackTime: "",
}); // 搜索结果
// 是否展示补贴相关检索的展示
const showSubsidyInfo = computed(() => (itemInfo: any) => {
  if (itemInfo.title === "补贴金额：" || itemInfo.title === "补贴年限：") {
    return showInfoList.value[3][0].value === "是";
  } else {
    return true;
  }
});
let searchCanvas = ref();
watch(
  () => filterFinish.value,
  (val) => {
    val && (searchCanvas.value = ref());
  },
  { immediate: true },
);
// 投资方案筛选项查找
async function investmentProgramFn(type: string) {
  const res: any =
    type === "年利用"
      ? await apiYearsList()
      : type === "贴现率"
        ? await apiRateList()
        : await apiPeriodList();
  if (type === "年利用") {
    yearList.value = res.data;
    searchParams.value.annualDays = "330";
  }
  if (type === "贴现率") {
    res.data.forEach((item) => {
      item.paramDesc = item.paramDesc + "%";
    });
    rateList.value = res.data;
    searchParams.value.bankRate = "0%";
  }
  if (type === "测算周期") {
    res.data.forEach((item) => {
      item.paramDesc = item.paramDesc + "年";
    });
    periodList.value = res.data;
    searchParams.value.calculationPeriod = "15年";
  }
}
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
async function onSearch() {
  let _search: any = JSON.parse(JSON.stringify(searchParams.value));
  delete _search.choseProduct;
  const res: any = await apiAnalyzeSearch(_search);
  if (res.code === 200) {
    searchResult.value = res.data;
    filterFinish.value = true;
    const _data = res.data.revenueEstimationResps;
    const _discharge = [];
    _data.annualCharge.unshift("-");
    _data.annualDischarge.unshift("-");
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
    setTimeout(() => {
      searchCanvas.value.getCanvasData(false);
    }, 200);
    scrollTop.value < 560 && scrollToBottom();
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo({
      top: 560,
      behavior: "smooth",
    });
  });
};
// 重置按钮
function onReset() {
  filterFinish.value = false;
}
// 开始分析按钮
function onAnalysis(data: any, tipsInfoText: string) {
  const _showInfoList = showInfoList.value;
  _showInfoList[0][0].value =
    data.patternAnalysis === 1 ? "EMC合同能源" : "业主自投";
  _showInfoList[1][0].value = data.regionName;
  _showInfoList[1][1].value = data.electricityTypeOneNameText;
  _showInfoList[1][2].value = data.electricityTypeTwoNameText;
  _showInfoList[1][3].value = data.tariffLevelIdText;
  _showInfoList[2][0].value = data.expectedCapacity + "kWh";
  _showInfoList[2][1].value = `${data.productName}（${data.modelName}）`;
  _showInfoList[2][2].value = data.number + "台";
  _showInfoList[2][3].value = data.systemUnitPrice + "元/度";
  _showInfoList[3][0].value = data.subsidy === 1 ? "是" : "否";
  _showInfoList[3][1].value = data.subsidyAmount + "元/年";
  _showInfoList[3][2].value = data.subsidyYear + "年";
  tipsInfo.value = tipsInfoText;
  searchParams.value = Object.assign(searchParams.value, data);
  onSearch();
}

function updateScrollTop() {
  scrollTop.value = window.scrollY;
}
onMounted(() => {
  investmentProgramFn("年利用");
  investmentProgramFn("贴现率");
  investmentProgramFn("测算周期");
  window.addEventListener("scroll", updateScrollTop);
});
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
#investment-return {
  padding: 80px 0;
}
.investment__title {
  @include font(14px, 600, #5b6985, 22px);
}

.investment__title-margin {
  @include margin(24px, 0, 32px, 0);
}

.filter__content {
  @include flex(center, flex-start);
}

.common-title {
  @include font(14px, 600, #1c232f, 12px);
  @include flex(center, flex-start);

  &::before {
    content: "";
    display: inline-block;
    @include widthAndHeight(4px, 16px);
    @include box(none, none, #165dff, 1px);
    @include margin(0, 4px, 0, 0);
  }

  span {
    @include font(14px, 400, #5b6985, 22px);
    @include margin(0, 0, 0, 4px);
  }
}

.common-title-margin {
  @include margin(24px, 0, 8px, 0);
}

.common-desc {
  @include font(14px, 400, #5b6985, 22px);
}

.showInfo {
  div {
    display: inline-block;
    @include margin(0, 0, 8px, 0);
  }
}

.showInfo-title {
  @include font(14px, 400, #919db5, 22px);
}

.showInfo-desc {
  @include font(14px, 400, #1c232f, 22px);
  @include margin(0, 24px, 0, 0);
}

.revenue-estimate {
  @include flex(center, space-between);

  .estimate-info {
    @include font(14px, 600, #1c232f, 22px);

    span:nth-of-type(2n) {
      @include font(14px, 400, #1c232f, 22px);
    }

    span:nth-of-type(2) {
      @include margin(0, 32px, 0, 0);
    }
  }
}

.color-red {
  color: red !important;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.investment-filter__check {
  .select {
    margin: 0 20px 16px 0 !important;
  }
}
</style>
