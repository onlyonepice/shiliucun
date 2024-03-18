<template>
  <div v-if="filterFinish" class="result-wrapper">
    <div class="box">
      <div class="start" @click="onReset">重新测算</div>
      <div class="common-title common-title-margin">检索条件</div>
      <div class="showInfo" v-for="(item, index) in showInfoList" :key="index">
        <div v-for="itemInfo in item" :key="itemInfo.title">
          <span class="info_item_box" v-if="showSubsidyInfo(itemInfo)">
            <span class="showInfo-title">{{ itemInfo.title }}</span>
            <span class="showInfo-desc">{{ itemInfo.value }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="common-title common-title-margin">充放电策略</div>
      <p class="common-desc">{{ tipsInfo }}</p>
    </div>
    <div class="box">
      <div class="common-title common-title-margin">投资方案</div>
      <div class="filter__content investment-filter__check">
        <customPicker title="年利用天数" field="annualDays" :columns="yearList" :defaultValue="searchParams.annualDays"
          @onChange="onChangeFilter" />
        <customPicker field="bankRate" title="贴现率" :columns="rateList" :defaultValue="searchParams.bankRate"
          @onChange="onChangeFilter" />
        <customPicker field="calculationPeriod" title="测算周期" :columns="periodList"
          :defaultValue="searchParams.calculationPeriod" @onChange="onChangeFilter" />
        <customPicker :field-names="{
          text: 'paramName',
          value: 'paramDesc'
        }" field="ownersShare" :columns="ownersShareList" v-if="showInfoList[0][0].value === 'EMC合同能源'" title="业主分成"
          :defaultValue="searchParams.ownersShare" @onChange="onChangeFilter" />
        <customPicker :field-names="{
          text: 'paramName',
          value: 'paramDesc'
        }" field="dividedByInvestors" :columns="dividedByInvestorsList" v-if="showInfoList[0][0].value === 'EMC合同能源'"
          title="投资方分成" :defaultValue="searchParams.dividedByInvestors" @onChange="onChangeFilter" />
      </div>
    </div>
    <div class="box">
      <Canvas ref="searchCanvas" :searchCanvas="searchCanvas" :searchParams="searchParams" @onSearch="onSearchData" />
    </div>
    <div class="box">
      <div v-if="showInfoList[0][0].value === 'EMC合同能源'">
        <div class="revenue-estimate">
          <div class="common-title common-title-margin">收益估算<span>/元</span></div>
          <div class="estimate-info">
            <p>
              <span>资方内部收益率（IRR）：</span>
              <span :class="{ 'color-red': searchResult.internalRateReturn.indexOf('-') > -1 }">{{
                searchResult.internalRateReturn === 'NaN' ? 'IRR过低' : searchResult.internalRateReturn + '%' }}</span>
            </p>
            <p>
              <span>动态回收期：</span>
              <span>{{ searchResult.paybackTime }}</span>
            </p>
          </div>

        </div>
        <div class="slider-wrapper__desc">
          <img :src="TipsIcon" alt="">
          <p>横向滑动查看完整内容</p>
        </div>
        <el-table :data="revenueEstimateList" style="width: 100%" header-row-class-name="table-class">
          <el-table-column prop="variationFactor" width="60" label="年数" />
          <el-table-column prop="financialCost" width="120" label="现金流">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.financialCost.indexOf('-') > -1 }">{{ scope.row.financialCost
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" prop="ownersAccumulatedIncome" label="业主累计收益">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.ownersAccumulatedIncome.indexOf('-') > -1 }">{{ scope.row.
                ownersAccumulatedIncome }}</span>
            </template>
          </el-table-column>
          <el-table-column width="140" prop="cumulativeReturnInvestors" label="投资方分享收益">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.cumulativeReturnInvestors.indexOf('-') > -1 }">{{ scope.row.
                cumulativeReturnInvestors }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" prop="investorNetPresentValue" label="投资方净现值">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.investorNetPresentValue.indexOf('-') > -1 }">{{ scope.row.
                investorNetPresentValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div class="revenue-estimate">
          <div class="common-title common-title-margin">收益估算</div>
          <div class="estimate-info">
            <span>IRR(内部收益率)：</span>
            <span :class="{ 'color-red': searchResult.internalRateReturn.indexOf('-') > -1 }">{{
              searchResult.internalRateReturn === 'NaN' ? 'IRR过低' : searchResult.internalRateReturn + '%' }}</span>
          </div>
        </div>
        <div class="slider-wrapper__desc">
          <img :src="TipsIcon" alt="">
          <p>横向滑动查看完整内容</p>
        </div>
        <el-table :data="ownerRevenueEstimateList" style="width: 100%" header-row-class-name="table-class">
          <el-table-column prop="variationFactor" label="年数" width="60" />
          <el-table-column prop="financialCost" width="120" label="现金流/元">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.financialCost.indexOf('-') > -1 }">{{ scope.row.financialCost
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="160" prop="innerReturnRate" label="NPV（净现值/元）">
            <template #default="scope">
              <span :class="{ 'color-red': scope.row.innerReturnRate.indexOf('-') > -1 }">{{ scope.row.
                innerReturnRate }}</span>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>
    <div class="box">
      <div class="common-title common-title-margin">充放电量<span>/万KWh</span></div>
      <el-table :data="dischargeList" style="width: 100%" header-row-class-name="table-class" empty-text="暂无数据">
        <el-table-column prop="variationFactor" label="年数 " width="60" />
        <el-table-column prop="annualCharge" label="年充电量">
          <template #default="scope">
            <span v-if="scope.row.annualCharge" :class="{ 'color-red': scope.row.annualCharge.indexOf('-') > -1 }">{{
              scope.row.annualCharge }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="annualDischarge" label="年放电量">
          <template #default="scope">
            <span v-if="scope.row.annualDischarge"
              :class="{ 'color-red': scope.row.annualDischarge.indexOf('-') > -1 }">{{
                scope.row.annualDischarge }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script lang="ts" setup>
import TipsIcon from '@/assets/img/iReport-tips-icon.png'
import { computed, onMounted, Ref, ref, watch, nextTick } from 'vue'
import Canvas from './canvas.vue'
import customPicker from '@/components/picker.vue'
import { apiYearsList, apiRateList, apiPeriodList, apiAnalyzeSearch } from '@/api/investment'
const emit = defineEmits(['onReset'])

// 展示筛选项内容
const showInfoList: Ref<Array<Array<any>>> = ref([
  [{ title: '模式分析：', value: '' }],
  [
    { title: '地区：', value: '' },
    { title: '用电类型 I：', value: '' },
    { title: '用电类型Ⅱ：', value: '' },
    { title: '期望接入的电压等级：', value: '1～10千伏' },
  ],
  [
    { title: '期望装配储能容量：', value: '1.2kWh' },
    { title: '选择产品：', value: '集装箱产品：(1)   5MWh（45尺标准高箱）' },
    { title: '配置数量：', value: '' },
    { title: '系统单价：', value: '' },
  ],
  [
    { title: '是否补贴：', value: '' },
    { title: '补贴金额：', value: '' },
    { title: '补贴年限：', value: '' },
  ]
])
//
const revenueEstimateList: Ref<any> = ref([]) // 收益估算
const ownerRevenueEstimateList: Ref<any> = ref([]) // 业主自投收益估算
const dischargeList: Ref<any> = ref([]) // 充放电量
// 查询参数
const searchParams: Ref<any> = ref({
  ownersShare: 20,
  dividedByInvestors: 80
})
const scrollTop: Ref<number> = ref(0) // 页面滚动距离
const yearList: Ref<Array<any>> = ref([]) // 年利用天数筛选项
const rateList: Ref<Array<any>> = ref([]) // 贴现率筛选项
const periodList: Ref<Array<any>> = ref([]) // 测算周期筛选项
const ownersShareList = ref([
  {
    paramName: '10%',
    paramDesc: 10
  }, {
    paramName: '20%',
    paramDesc: 20
  }, {
    paramName: '30%',
    paramDesc: 30
  }, {
    paramName: '40%',
    paramDesc: 40
  }, {
    paramName: '50%',
    paramDesc: 50
  }, {
    paramName: '60%',
    paramDesc: 60
  }, {
    paramName: '70%',
    paramDesc: 70
  }, {
    paramName: '80%',
    paramDesc: 80
  }, {
    paramName: '90%',
    paramDesc: 90
  }, {
    paramName: '100%',
    paramDesc: 100
  },
])
const dividedByInvestorsList = ref([
  {
    paramName: '10%',
    paramDesc: 10
  }, {
    paramName: '20%',
    paramDesc: 20
  }, {
    paramName: '30%',
    paramDesc: 30
  }, {
    paramName: '40%',
    paramDesc: 40
  }, {
    paramName: '50%',
    paramDesc: 50
  }, {
    paramName: '60%',
    paramDesc: 60
  }, {
    paramName: '70%',
    paramDesc: 70
  }, {
    paramName: '80%',
    paramDesc: 80
  }, {
    paramName: '90%',
    paramDesc: 90
  }, {
    paramName: '100%',
    paramDesc: 100
  },
])
// 是否完成筛选，由子组件控制
const filterFinish: Ref<boolean> = ref(false)
const tipsInfo: Ref<string> = ref('') // 策略信息
const searchResult = ref({
  internalRateReturn: '',
  paybackTime: ''
}) // 搜索结果
// 是否展示补贴相关检索的展示
const showSubsidyInfo = computed(() => (itemInfo: any) => {
  if (itemInfo.title === '补贴金额：' || itemInfo.title === '补贴年限：') {
    return showInfoList.value[3][0].value === '是'
  } else {
    return true
  }
})
let searchCanvas = ref();
watch(
  () => filterFinish.value,
  val => {
    val && (searchCanvas.value = ref())
  },
  { immediate: true }
)
// 投资方案筛选项查找
async function investmentProgramFn(type: string) {
  const res: any = type === '年利用' ? await apiYearsList() : type === '贴现率' ? await apiRateList() : await apiPeriodList()
  if (type === '年利用') {
    yearList.value = res.data
    searchParams.value.annualDays = '330'
  }
  if (type === '贴现率') {
    res.data.forEach(item => {
      item.paramDesc = item.paramDesc + '%'
    })
    rateList.value = res.data
    searchParams.value.bankRate = '0%'
  }
  if (type === '测算周期') {
    res.data.forEach(item => {
      item.paramDesc = item.paramDesc + '年'
    })
    periodList.value = res.data
    searchParams.value.calculationPeriod = '15年'
  }
}
// 修改投资方案筛选项
function onChangeFilter(data: string, type: string) {
  searchParams.value[type] = data
  if (type === 'ownersShare') {
    searchParams.value.dividedByInvestors = 100 - Number(data)
  }
  if (type === 'dividedByInvestors') {
    searchParams.value.ownersShare = 100 - Number(data)
  }
  onSearch();
}

function onSearchData(data: any) {
  searchParams.value = data
  onSearch()
}

// 查询接口
async function onSearch() {
  searchParams.value.calculationPeriod.indexOf('年') > -1 && (searchParams.value.calculationPeriod = searchParams.value.calculationPeriod.split('年')[0])
  searchParams.value.bankRate.indexOf('%') > -1 && (searchParams.value.bankRate = searchParams.value.bankRate.split('%')[0])
  searchParams.value.subsidy === 2 && (delete searchParams.value.subsidyAmount)
  searchParams.value.subsidy === 2 && (delete searchParams.value.subsidyYear)
  const res: any = await apiAnalyzeSearch(searchParams.value)
  if (res.code === 200) {
    searchResult.value = res.data
    filterFinish.value = true
    const _data = res.data.revenueEstimationResps
    const _discharge = []
    _data.annualCharge.unshift('-')
    _data.annualDischarge.unshift('-')
    if (showInfoList.value[0][0].value === 'EMC合同能源') {
      const _revenueEstimate = []
      for (let index = 0; index < _data.variationFactor.length; index++) {
        _revenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          ownersAccumulatedIncome: _data.ownersAccumulatedIncome[index],
          cumulativeReturnInvestors: _data.cumulativeReturnInvestors[index],
          investorNetPresentValue: _data.investorNetPresentValue[index]
        })
      }
      revenueEstimateList.value = _revenueEstimate
    } else {
      const _ownerRevenueEstimate = []

      for (let index = 0; index < _data.variationFactor.length; index++) {
        _ownerRevenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          innerReturnRate: _data.innerReturnRate[index]
        })
      }
      ownerRevenueEstimateList.value = _ownerRevenueEstimate
    }
    for (let index = 0; index < _data.variationFactor.length; index++) {
      _discharge.push({
        variationFactor: _data.variationFactor[index],
        annualCharge: _data.annualCharge[index],
        annualDischarge: _data.annualDischarge[index]
      })
    }
    dischargeList.value = _discharge
    setTimeout(() => {
      searchCanvas.value.getCanvasData(false)
    }, 200)
    // scrollTop.value < 560 && scrollToBottom()
  }
}

// const scrollToBottom = () => {
//   nextTick(() => {
//     window.scrollTo({
//       top: 560,
//       behavior: "smooth"
//     })
//   })
// }
// 重置按钮
function onReset() {
  emit('onReset')
  filterFinish.value = false
}
// 开始分析按钮
function onAnalysis(data: any, tipsInfoText: string) {
  const _showInfoList = showInfoList.value
  _showInfoList[0][0].value = data.patternAnalysis === 1 ? 'EMC合同能源' : '业主自投';
  _showInfoList[1][0].value = data.regionName;
  _showInfoList[1][1].value = data.electricityTypeOneNameText;
  _showInfoList[1][2].value = data.electricityTypeTwoNameText;
  _showInfoList[1][3].value = data.tariffLevelIdText;
  _showInfoList[2][0].value = data.expectedCapacity + 'kWh';
  _showInfoList[2][1].value = `${data.productName}（${data.modelName}）`;
  _showInfoList[2][2].value = data.number + '台';
  _showInfoList[2][3].value = data.systemUnitPrice + '元/度';
  _showInfoList[3][0].value = data.subsidy === 1 ? '是' : '否';
  _showInfoList[3][1].value = data.subsidyAmount + '元/年';
  _showInfoList[3][2].value = data.subsidyYear + '年';
  tipsInfo.value = tipsInfoText
  searchParams.value = Object.assign(searchParams.value, data)
  onSearch()
}

// function updateScrollTop() {
//   scrollTop.value = window.scrollY;
// }
onMounted(() => {
  investmentProgramFn('年利用')
  investmentProgramFn('贴现率')
  investmentProgramFn('测算周期')
  // window.addEventListener('scroll', updateScrollTop);
  scrollTop.value = 0
})
defineExpose({
  onAnalysis, onReset
})
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";



.start {
  padding: 1rem 2.4rem;
  background: #165DFF;
  border-radius: 0.8rem;
  @include font(2.8rem, 400, rgba(255, 255, 255, 0.9), 4.4rem);
  @include flex(center, center);
  background-color: #165DFF;
  color: white;
  position: absolute;
  right: 3.2rem;
  top: 3.2rem;
}

.slider-wrapper__desc {
  @include font(2.4rem, 400, #5B6985, 4rem);
  @include margin(0, 0, 8px, 0);
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  img {
    @include widthAndHeight(16px, 16px);
    @include margin(2px, 4px, 0, 0);
  }

  span {
    @include font(2.4rem, 400, #5B6985, 4rem);
  }
}

.result-wrapper {
  width: 100vw;
  background-color: #F2F3F5;
  box-sizing: border-box;
  padding: 3.2rem;
}

.box {
  width: 100%;
  background-color: white;
  padding: 3.2rem;
  border-radius: 0.6rem;
  margin-bottom: 1.2rem;
  position: relative
}

.investment__title {
  @include font(2.8rem, 600, rgba(0, 0, 0, 0.6), 4.4rem);
}

.investment__title-margin {
  @include margin(0, 0, 3.2rem, 0);
}

.filter__content {
  @include flex(center, flex-start);
}

.common-title {
  @include font(2.8rem, 600, #1C232F, 2.4rem);
  @include flex(center, flex-start);

  &::before {
    content: '';
    display: inline-block;
    @include widthAndHeight(4px, 16px);
    @include box(none, none, #165DFF, 1px);
    @include margin(0, 4px, 0, 0);
  }

  span {
    @include font(2.8rem, 400, rgba(0, 0, 0, 0.6), 4.4rem);
    @include margin(0, 0, 0, 4px);
  }
}

.common-title-margin {
  @include margin(0, 0, 0.8rem, 0);
}

.common-desc {
  @include font(2.8rem, 400, rgba(0, 0, 0, 0.6), 4.4rem);
}

.showInfo {
  width: 100%;

  div {
    @include margin(0, 0, 0.6rem, 0);
    width: 100%;

  }

  .info_item_box {
    width: 100%;
    display: flex;
    align-items: flex-start;
  }
}

.showInfo-title {
  @include font(2.8rem, 400, rgba(0, 0, 0, 0.6), 4.4rem);
}

.showInfo-desc {
  @include font(2.8rem, 400, #1C232F, 4.4rem);
  flex: 1,
}

.revenue-estimate {

  .estimate-info {
    @include font(2.8rem, 600, #1C232F, 4.4rem);
    padding: 1.2rem 2.4rem;
    background-color: #F2F3F5;
    border-radius: 0.8rem;
    margin-bottom: 1.2rem;

    span:nth-of-type(2n) {
      @include font(2.8rem, 400, rgba(0, 0, 0, 0.9), 4.4rem);
    }

    span:nth-of-type(2) {
      @include margin(0, 3.2rem, 0, 0);
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