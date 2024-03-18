<template>
  <div class="filter">
    <div class="filter__left">
      <p class="filter__title filter__title-margin">模式分析</p>
      <div class="filter__patternAnalysis">
        <div class="filter__patternAnalysis-item" v-for="item in patternAnalysis" :key="item.id"
          @click="onPatternAnalysis(item.id)">
          <img :src="filterData.patternAnalysis === item.id ? HasChoseRadio : NoChoseRadio" alt="">
          <span v-text="item.text" />
        </div>
      </div>
      <!-- 用户参数 -->
      <p class="filter__title filter__title-margin">用户参数</p>
      <div class="filter__content">
        <p class="filter__content-disabled" v-if="disabledUser" />
        <Select title="地区" :options="cityData" valueKey="regionName" :defaultValue="searchParams.regionName"
          @onChange="$event => { onAreaChange($event, 'regionName') }" />
        <Select title="用电类型 I" :options="electricityType1" valueKey="paramName" labelKey="paramDesc"
          :defaultValue="searchParams.electricityTypeOneName"
          @onChange="$event => { onElectricityTypeOneName($event, 'electricityTypeOneName') }" />
        <Select title="用电类型 II" :options="electricityType2" valueKey="paramName" labelKey="paramDesc"
          :defaultValue="searchParams.electricityTypeTwoName"
          @onChange="$event => { onElectricityTypeTwoName($event, 'electricityTypeTwoName') }" />
        <Select title="期望接入的电压等级" :options="voltageLevel" valueKey="paramName" labelKey="paramDesc"
          :defaultValue="searchParams.tariffLevelId" @onChange="$event => { onChangeData($event, 'tariffLevelId') }" />
      </div>
      <div v-if="!disabledUser && tipsInfo.chargeDischargeStrategy">
        <p class="tips"
          v-if="searchParams.electricityTypeTwoName === 'BUSINESS_NDUSTRY' && tipsInfo.chargeDischargeStrategy.BUSINESS_NDUSTRY !== null">
          {{ tipsInfo.chargeDischargeStrategy.BUSINESS_NDUSTRY }}</p>
        <p class="tips"
          v-if="searchParams.electricityTypeTwoName === 'GENERAL_INDUSTRY_COMMERCE' && tipsInfo.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE !== null">
          {{ tipsInfo.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE }}</p>
        <p class="tips"
          v-if="searchParams.electricityTypeTwoName === 'LARGE_INDUSTRY' && tipsInfo.chargeDischargeStrategy.LARGE_INDUSTRY !== null">
          {{ tipsInfo.chargeDischargeStrategy.LARGE_INDUSTRY }}</p>
      </div>
      <!-- 产品参数 -->
      <p class="filter__title filter__title-margin filter__title-subsidy">产品参数</p>
      <div class="filter__content">
        <p class="filter__content-disabled" v-if="disabledProduct" />
        <Select title="期望装配储能容量" type="input" inputText="kWh" :defaultValue="searchParams.expectedCapacity"
          @onChange="$event => { onChangeData($event, 'expectedCapacity') }" />
        <Select title="选择产品" type="cascader" :disabled="disabledProductSelect" :options="productList"
          :cascaderOption="cascaderOption" @onChange="$event => { onChoseProduct($event, 'choseProduct') }"
          :defaultValue="searchParams.choseProduct" />
        <Select title="配置数量" type="input" inputText="台"
          :disabled="disabledProductSelect || searchParams.choseProduct === ''" :defaultValue="searchParams.number"
          @onChange="$event => { onChangeData($event, 'number') }" />
        <Select title="系统单价" type="input" inputText="元/度"
          :disabled="disabledProductSelect || searchParams.choseProduct === ''"
          :defaultValue="searchParams.systemUnitPrice" @onChange="$event => { onChangeData($event, 'systemUnitPrice') }" />
      </div>
      <p class="filter__title filter__title-margin filter__title-subsidy">是否补贴</p>
      <div class="filter__patternAnalysis filter-subsidy">
        <div class="filter__patternAnalysis-item" v-for="item in subsidy" :key="item.id" @click="onSubsidy(item.id)">
          <img :src="filterData.subsidy === item.id ? HasChoseRadio : NoChoseRadio" alt="">
          <span v-text="item.text" />
        </div>
      </div>
      <div class="filter__content" v-if="filterData.subsidy !== 2">
        <Select title="补贴金额" type="input" inputText="元/年"
          @onChange="$event => { onChangeSubsidy($event, 'subsidyAmount') }" />
        <Select title="补贴年限" type="input" inputText="年" @onChange="$event => { onChangeSubsidy($event, 'subsidyYear') }" />
      </div>
      <!-- 下面需要筛选项都做完 -->
      <div class="product-desc" v-if="searchParamsDefault.picture">
        <el-image class="product-desc__img" :src="searchParamsDefault.picture" fit="contain" alt="" />
        <div class="product-desc__content">
          <p class="content-title">{{ searchParamsDefault.productName }}（{{ searchParamsDefault.modelName }}）</p>
          <p class="content-desc">{{ '' }}</p>
          <a class="content-down" :href="searchParamsDefault.handbook" download target="_blank">手册下载</a>
        </div>
      </div>
    </div>
    <div class="filter__right">
      <el-button class="filter__right-start" type="primary" @click="onAnalysis">开始分析</el-button>
      <el-button class="filter__right-reset" @click="onReset">重置</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, defineEmits, watch, onMounted } from 'vue'
import NoChoseRadio from '@/assets/img/no-chose-radio.png'
import HasChoseRadio from '@/assets/img/has-chose-radio.png'
import { PATTERNANALYSIS, FILTERDATA, SUBSIDY, Subsidy } from './data'
import { PatternAnalysis, } from './data'
import Select from '@/components/select.vue'
import { ElMessage } from 'element-plus'
import { apiAreaData, apiStrategy, apiElectricityType, apiProductList, apiProductDetail } from '@/api/investment'
const emit = defineEmits(['onAnalysis', 'onReset'])

const filterData: Ref<FILTERDATA> = ref({
  patternAnalysis: 0,
  subsidy: 2
})
// 筛选项
const searchParams = ref({
  regionName: '', // 地区
  electricityTypeOneName: '', // 用电类型1
  electricityTypeTwoName: '', // 用电类型2
  tariffLevelId: '', // 期望接入电压等级
  expectedCapacity: '', // 期望装配储能容量
  choseProduct: '', // 选择产品
  number: '', // 配置数量
  systemUnitPrice: '', // 系统单价

  chargeDischargeIdentifying: ''
})
const subsidyData = ref({
  subsidyAmount: '', // 补贴金额
  subsidyYear: '', // 补贴年限
})
// 筛选项后端需求多传无用字段
const searchParamsDefault: any = ref({})
const cityData = ref([]) // 地区数据
const tipsInfo: any = ref({}) // 提示文案
const electricityType1 = ref([]) // 用电类型1
const electricityType2 = ref([]) // 用电类型2
const voltageLevel = ref([]) // 接入电压等级
const productList = ref([]) // 产品列表
const cascaderOption: any = ref({
  value: 'id',
  label: 'name',
  children: 'secondLevelRespList',
  expandTrigger: 'hover'
})

const patternAnalysis: Ref<Array<PATTERNANALYSIS>> = ref(PatternAnalysis)
const subsidy: Ref<Array<SUBSIDY>> = ref(Subsidy)

// 用户参数筛选项是否可以修改
const disabledUser: Ref<boolean> = ref(true)
// 产品参数筛选项是否可以修改
const disabledProduct: Ref<boolean> = ref(true)
// 产品参数中选择产品的筛选项是否可以在操作
const disabledProductSelect: Ref<boolean> = ref(true)
// 筛选项都填完
const filterFinish: Ref<boolean> = ref(false)
// 选择模式分析
const onPatternAnalysis = (id: number) => {
  filterData.value.patternAnalysis = id
  disabledUser.value = false

}
// 选择是否补贴
const onSubsidy = (id: number) => {
  filterData.value.subsidy = id
}

watch(
  () => searchParams.value.expectedCapacity,
  val => {
    disabledProductSelect.value = val === ''
  },
  { immediate: true }
)

onMounted(() => {
  getAreaData()
})

// 开始分析
const onAnalysis = () => {
  if (filterData.value.patternAnalysis === 0) {
    return ElMessage({ message: '请选择模式分析', type: 'warning' })
  }
  if (searchParams.value.regionName === '') {
    return ElMessage({ message: '请选择地区', type: 'warning' })
  }
  if (searchParams.value.choseProduct === '') {
    return ElMessage({ message: '请选择产品', type: 'warning' })
  }
  if (filterData.value.subsidy === 1 && (subsidyData.value.subsidyAmount === '' || subsidyData.value.subsidyYear === '')) {
    return ElMessage({ message: '请完善补贴数据输入', type: 'warning' })
  }
  let electricityTypeOneNameText = '' // 用电类型1选中项的文案
  let electricityTypeTwoNameText = '' // 用电类型2选中项的文案
  let tariffLevelIdText = '' // 期待接入的电压等级的文案
  let choseProductText = '' // 选择产品的文案
  electricityType1.value.forEach(item => {
    item.paramName === searchParams.value.electricityTypeOneName && (electricityTypeOneNameText = item.paramDesc)
  });
  electricityType2.value.forEach(item => {
    item.paramName === searchParams.value.electricityTypeTwoName && (electricityTypeTwoNameText = item.paramDesc)
  });
  voltageLevel.value.forEach(item => {
    item.paramName === searchParams.value.tariffLevelId && (tariffLevelIdText = item.paramDesc)
  });
  productList.value.forEach(item => {
    item.paramName === searchParams.value.choseProduct && (choseProductText = item.paramDesc)
  });
  filterFinish.value = true
  // 需要深拷贝防止数据污染
  const _searchParams  = JSON.parse(JSON.stringify(searchParams.value))
  const _filterData  = JSON.parse(JSON.stringify(filterData.value))
  const _searchParamsDefault  = JSON.parse(JSON.stringify(searchParamsDefault.value))
  const _data = Object.assign(_searchParamsDefault,_filterData,_searchParams, {
    electricityTypeOneNameText,
    electricityTypeTwoNameText,
    tariffLevelIdText,
    choseProductText
  })
  filterData.value.subsidy === 1 && Object.assign(_data,subsidyData.value);
  emit('onAnalysis',_data,tipsInfo.value.chargeDischargeStrategy[searchParams.value.electricityTypeTwoName])
}

// 重置筛选项
const onReset = () => {
  filterData.value = {
    patternAnalysis: 0,
    subsidy: 2
  }
  searchParams.value = {
    regionName: '', // 地区
    electricityTypeOneName: '', // 用电类型1
    electricityTypeTwoName: '', // 用电类型2
    tariffLevelId: '', // 期望接入电压等级
    expectedCapacity: '', // 期望装配储能容量
    choseProduct: '', // 选择产品
    number: '', // 配置数量
    systemUnitPrice: '', // 系统单价

    chargeDischargeIdentifying: ''
  }
  disabledUser.value = true
  disabledProduct.value = true
  filterFinish.value = false
  searchParamsDefault.value = {}
  emit('onReset')
}

// 获取地区数据
async function getAreaData() {
  try {
    const res: any = await apiAreaData()
    cityData.value = res.data
  } catch (error) {
    console.error(error)
  }
}
// 获取产品列表
async function getProductList() {
  try {
    const res: any = await apiProductList()
    productList.value = res.data
  } catch (error) {
    console.error(error)
  }
}
// 地区筛选项改变
async function onAreaChange(data: string, type: string) {
  onChangeData(data, type)
  cityData.value.forEach(item => {
    if (item.regionName === data) {
      electricityType1.value = item.reInvestmentElectricityType
      searchParams.value.electricityTypeOneName = item.reInvestmentElectricityType[0].paramName
    }
  })
  onGetElectricityInfo()
  disabledProduct.value = false
  getProductList()
}
// 用电类型1改变
async function onElectricityTypeOneName(data: string, type: string) {
  onChangeData(data, type)
  onGetElectricityInfo()
}
// 用电类型2改变
async function onElectricityTypeTwoName(data: string, type: string) {
  onChangeData(data, type)
  electricityType2.value.forEach(item => {
    if (item.paramDesc === data) {
      voltageLevel.value = item.voltageLevel
    }
  })
}
// 获取用电类型与电压等级
async function onGetElectricityInfo() {
  try {
    const _data = { region: searchParams.value.regionName, electricityTypeOneName: searchParams.value.electricityTypeOneName, regionName: searchParams.value.regionName }
    const res: any = await apiStrategy(_data)
    tipsInfo.value = res.data
    searchParams.value.chargeDischargeIdentifying = res.data.chargeDischargeIdentifying
    const res1: any = await apiElectricityType(_data)
    electricityType2.value = res1.data
    searchParams.value.electricityTypeTwoName = res1.data[0].paramName
    voltageLevel.value = res1.data[0].voltageLevel
    searchParams.value.tariffLevelId = res1.data[0].voltageLevel[0].paramName
  } catch (error) {
    console.error(error)
  }
}
// 选择产品修改
async function onChoseProduct(data: string, type: string) {
  onChangeData(data, type)
  const res: any = await apiProductDetail({ id: data[2] })
  // 计算配置数量
  searchParams.value.number = String(Math.ceil(Number(searchParams.value.expectedCapacity) / Number(res.data.systemEnergyCapacity)))
  searchParams.value.systemUnitPrice = res.data.systemUnitPrice
  searchParamsDefault.value = res.data
}
// 改变值
async function onChangeData(data: string, type: string) {
  searchParams.value[type] = data
}
// 是否补贴修改
function onChangeSubsidy(data: string, type: string) {
  subsidyData.value[type] = data
}

</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.filter {
  @include flex();
  @include relative();
  @include padding(0, 0, 24px, 0);
  border-bottom: 1px solid #E5E6EA;
}

.filter__left {
  @include widthAndHeight(90%, 100%);
  @include padding(0, 24px, 0, 0);
  flex: 1;
  border-right: 1px solid #E5E6EA;
}
.filter__right{
  @include widthAndHeight(128px);
  @include padding(0,24px,0,24px);
  .filter__right-start{
    @include widthAndHeight(80px,32px);
    @include font(14px,400,#ffffff,22px);
    @include absolute(1,none,24px,72px,none);
  }
  .filter__right-reset{
    @include widthAndHeight(80px,32px);
    @include font(14px,400,#5B6985,22px);
    @include absolute(1,none,24px,24px,none);
  }
}

.filter__title {
  @include font(14px, 600, #5B6985, 22px);
}

.filter__title-margin {
  @include margin(24px, 0, 16px, 0);
}

.filter__title-subsidy {
  @include margin(8px, 0, 16px, 0);
}

.filter__content {
  @include flex(center, space-between);
  @include relative();
}

.filter__content-disabled {
  @include widthAndHeight(100%, 100%);
  @include absolute(2);
  cursor: no-drop;
}

.filter__patternAnalysis {
  @include flex(center, flex-start);
}

.filter-subsidy {
  @include margin(0, 0, 16px, 0)
}
.filter__patternAnalysis-item{
  @include flex(center,flex-start);
  @include margin(0,16px,0,0);
  @include font(14px,400,#5B6985,22px);
  cursor: pointer;

  img {
    @include widthAndHeight(24px, 24px);
    @include margin(0, 4px, 0, 0);
  }
}

.tips {
  @include font(12px, 400, #5B6985, 18px);
  @include relative();
  @include padding(0, 0, 0, 20px);
  @include margin(0, 0, 16px, 0);

  &::before {
    content: '';
    @include widthAndHeight(16px, 16px);
    display: inline-block;
    background-image: url('@/assets/img/iReport-tips-icon.png');
    background-size: 16px 16px;
    background-repeat: no-repeat;
    @include margin(0, 2px, 0, 0);
    @include absolute(1, 0, 0, 0, 0);
  }
}

.product-desc {
  @include widthAndHeight(100%, 352px);
  @include box(16px, none, #F4F7FE, 7px);
  @include flex(center, center, no-wrap);

  .product-desc__img {
    @include widthAndHeight(320px, 320px);
    @include margin(0, 16px);
  }

  .product-desc__content {
    flex: 1;

    .content-title {
      @include font(20px, 600, #1C232F, 32px);
      @include margin(0, 0, 16px, 0);
    }

    .content-desc {
      @include font(14px, 400, #5B6985, 24px);
      @include margin(0, 0, 40px, 0);
    }

    .content-down {
      @include widthAndHeight(108px, 40px);
      @include box(9px 26px, none, #2D5CF6, 4px);
      @include font(14px, 400, #ffffff, 22px);
      cursor: pointer;
      text-decoration: none;
    }
  }
}</style>
