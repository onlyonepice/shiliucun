<template>
  <div id="investment-return" class="es-commonPage">
    <Filter @onAnalysis="onAnalysis" @onReset="onReset" />
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
                  'color-red':
                    searchResult.internalRateReturn.indexOf('-') > -1,
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
            ref="tableMoney"
          >
            <el-table-column type="expand" width="1">
              <template #default>
                <div class="table-expand">
                  <div class="table-expand--head">
                    <div>
                      <span>未来一年收益估算（元）</span>
                      <el-tooltip
                        class="box-item"
                        effect="light"
                        content="指根据过去一年该省份每个月峰谷价差估算的未来收益"
                        placement="top-start"
                      >
                        <img :src="TipsIcon" alt="" />
                      </el-tooltip>
                    </div>
                    <div>
                      合计：<span
                        >¥{{
                          searchResult.revenueEstimationResps.futureIncome[
                            searchResult.revenueEstimationResps.futureIncome
                              .length - 1
                          ]
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="table-expand--body">
                    <div v-for="item in 12" :key="item">
                      <p>
                        {{
                          searchResult.revenueEstimationResps.futureYears[
                            item - 1
                          ]
                        }}
                      </p>
                      <span
                        >¥{{
                          searchResult.revenueEstimationResps.futureIncome[
                            item - 1
                          ]
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="variationFactor" label="年数">
              <template #default="scope">
                <span
                  style="cursor: pointer"
                  @click="
                    scope.row.variationFactor === '1'
                      ? onClickExpand(scope.row)
                      : ''
                  "
                  >{{ scope.row.variationFactor === "1" ? "+" : "" }}
                  {{ scope.row.variationFactor }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="financialCost" label="现金流">
              <template #default="scope">
                <span
                  :class="{
                    'color-red': scope.row.financialCost.indexOf('-') > -1,
                  }"
                  >¥{{ scope.row.financialCost }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="ownersAccumulatedIncome"
              label="业主累计收益"
            >
              <template #default="scope">
                <span
                  :class="{
                    'color-red':
                      scope.row.ownersAccumulatedIncome.indexOf('-') > -1,
                  }"
                  >¥{{ scope.row.ownersAccumulatedIncome }}</span
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
                  >¥{{ scope.row.cumulativeReturnInvestors }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="investorNetPresentValue"
              label="投资方净现值"
            >
              <template #default="scope">
                <span
                  :class="{
                    'color-red':
                      scope.row.investorNetPresentValue.indexOf('-') > -1,
                  }"
                  >¥{{ scope.row.investorNetPresentValue }}</span
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
                  'color-red':
                    searchResult.internalRateReturn.indexOf('-') > -1,
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
                  >¥{{ scope.row.financialCost }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="innerReturnRate" label="NPV（净现值/元）">
              <template #default="scope">
                <span
                  :class="{
                    'color-red': scope.row.innerReturnRate.indexOf('-') > -1,
                  }"
                  >¥{{ scope.row.innerReturnRate }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-show="choseTab === 2">
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
                :class="{
                  'color-red': scope.row.annualCharge.indexOf('-') > -1,
                }"
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
import TipsIcon from "@/assets/img/common/lament_icon.png";
import {
  apiYearsList,
  apiRateList,
  apiPeriodList,
  apiAnalyzeSearch,
  apiComment,
} from "@/api/investment";
import { cloneDeep } from "lodash";
// 展示筛选项内容
const showInfoList: Ref<Array<Array<any>>> = ref([
  [{ title: "模式分析：", value: "" }],
]);
const tableMoney = ref(null); // 表格dom节点
const revenueEstimateList: Ref<any> = ref([]); // 收益估算
const ownerRevenueEstimateList: Ref<any> = ref([]); // 业主自投收益估算
const dischargeList: Ref<any> = ref([]); // 充放电量
// 查询参数
const searchParams: Ref<any> = ref({
  ownersShare: 20,
  dividedByInvestors: 80,
});
const scrollTop: Ref<number> = ref(0); // 页面滚动距离
const yearList: Ref<any> = ref([]); // 年利用天数筛选项
const rateList: Ref<any> = ref([]); // 贴现率筛选项
const periodList: Ref<any> = ref([]); // 测算周期筛选项
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
// tab切换
const onHandleClick = (id: number) => {
  choseTab.value !== id && (choseTab.value = id);
};
// 投资方案筛选项查找
async function investmentProgramFn(type: string) {
  const { datas }: any =
    type === "年利用"
      ? await apiYearsList()
      : type === "贴现率"
        ? await apiRateList()
        : await apiPeriodList();
  if (type === "年利用") {
    yearList.value = datas;
    searchParams.value.annualDays = 300;
  }
  if (type === "贴现率") {
    datas.forEach((item) => {
      item.paramDesc = item.paramDesc + "%";
    });
    rateList.value = datas;
    searchParams.value.bankRate = "5%";
  }
  if (type === "测算周期") {
    datas.forEach((item) => {
      item.paramDesc = item.paramDesc + "年";
    });
    periodList.value = datas;
    searchParams.value.calculationPeriod = "10年";
  }
}
// 评论
const onEvaluate = async (text: string) => {
  choseEvaluate.value = text;
  await apiComment({
    moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
    satisfactionLevel: text,
  });
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
// 展开表格行
const onClickExpand = (row: any) => {
  tableMoney.value.toggleRowExpansion(row);
};
// 查询接口
async function onSearch(type = false) {
  let _search: any = cloneDeep(searchParams.value);
  _search.callingMode = type;
  _search.bankRate =
    _search.bankRate !== undefined ? _search.bankRate.split("%")[0] : "";
  _search.calculationPeriod =
    _search.calculationPeriod !== undefined
      ? _search.calculationPeriod.split("年")[0]
      : "";
  delete _search.choseProduct;
  if (type) {
    delete _search.annualDays;
    delete _search.bankRate;
    delete _search.calculationPeriod;
  }
  const { datas, resp_code }: any = await apiAnalyzeSearch(_search);
  if (resp_code === 0) {
    investmentProgramFn("年利用");
    investmentProgramFn("贴现率");
    investmentProgramFn("测算周期");
    searchResult.value = datas;
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
    setTimeout(() => {
      searchCanvas.value.getCanvasData(false);
    }, 200);
    type &&
      setTimeout(() => {
        searchCanvas.value.getSliderConfig();
      }, 400);
  }
}

// 重置按钮
function onReset() {
  filterFinish.value = false;
}
// 开始分析按钮
function onAnalysis(data: any) {
  const _showInfoList = showInfoList.value;
  _showInfoList[0][0].value =
    data.patternAnalysis === 1 ? "EMC合同能源" : "业主自投";
  searchParams.value = Object.assign(searchParams.value, data);
  onSearch(true);
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
  @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  @include flex(center, flex-start);

  span {
    @include font(14px, 400, #5b6985, 22px);
    @include margin(0, 0, 0, 4px);
  }
}

.common-title-margin {
  @include margin(24px, 0, 16px, 0);
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
.table-expand {
}
.table-expand--head {
  padding: 0 272px 0 40px;
  @include flex(center, flex-start);
  height: 38px;
  img {
    @include widthAndHeight(16px, 16px);
  }
  div {
    @include flex(center, flex-start);
    @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
  & div:nth-of-type(1) {
    margin-right: 490px;
  }
}
.table-expand--body {
  height: 144px;
  padding: 0 272px 0 40px;
  background: #f2f3f5;
  border-radius: 4px;
  @include flex(center, space-between);
  div {
    width: 28%;
    @include flex(center, flex-start);
    p {
      @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
      margin-right: 32px;
    }
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
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
