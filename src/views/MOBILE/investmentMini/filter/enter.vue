<template>
  <div class="filter">
    <div class="filter__left">
      <p class="filter__title filter__title-margin">
        <span class="step">1</span>
        <span>模式分析</span>
        <span class="step-line"></span>
      </p>
      <div class="filter__patternAnalysis">
        <div class="filter__patternAnalysis-item" v-for="item in patternAnalysis" :key="item.id"
          @click="onPatternAnalysis(item.id)">
          <img :src="filterData.patternAnalysis === item.id ? HasChoseRadio : NoChoseRadio" alt="">
          <span v-text="item.text" />
        </div>
      </div>
      <!-- 用户参数 -->
      <p class="filter__title filter__title-margin"> <span :style="{ backgroundColor: disabledUser ? '#A3BDF9' : '' }"
          class="step">2</span>
        <span :style="{ color: disabledUser ? 'rgb(200, 201, 204)' : '' }">用户参数</span>
        <img @click="handleTips" v-if="!disabledUser && tipsInfo.chargeDischargeStrategy" class="tips-icon"
          src="@/assets/img/icon_hint_nor.png" alt="">
      </p>
      <div :class="disabledUser ? 'filter__content  events-none' : 'filter__content'">
        <span style="height:32rem" class="step-line"></span>
        <customPicker :disabled="disabledUser" title="地区" field="regionName" :defaultValue="searchParams.regionName"
          :field-names="{ text: 'regionName', value: 'regionName' }" :columns="cityData" @onChange="onAreaChange" />
        <customPicker :disabled="disabledUser" title="用电类型 I" :columns="electricityType1"
          :defaultValue="searchParams.electricityTypeOneName" @onChange="onElectricityTypeOneName"
          field="electricityTypeOneName" />
        <customPicker :disabled="disabledUser" title="用电类型 II" :columns="electricityType2"
          :defaultValue="searchParams.electricityTypeTwoName" @onChange="onElectricityTypeTwoName"
          field="electricityTypeTwoName" />
        <customPicker :disabled="disabledUser" title="期望接入的电压等级" labelWidth="160" :columns="voltageLevel"
          :defaultValue="searchParams.tariffLevelId" @onChange="onChangeData" field="tariffLevelId" />
      </div>

      <!-- 产品参数 -->
      <p class="filter__title filter__title-margin filter__title-subsidy"> <span
          :style="{ backgroundColor: disabledProduct ? '#A3BDF9' : '' }" class="step">3</span>
        <span :style="{ color: disabledProduct ? 'rgb(200, 201, 204)' : '' }">产品参数</span>

      </p>
      <div :class="disabledProduct ? 'filter__content  events-none' : 'filter__content'">
        <span class="step-line" style="height: 33.8rem;"></span>
        <van-field :disabled="disabledProduct" label-width="140" label="期望装配储能容量" inputText="kWh" placeholder="请输入"
          v-model="searchParams.expectedCapacity" @onChange="$event => { onChangeData($event, 'expectedCapacity') }">
          <template #button>
            <p class="inputText">kWh</p>
          </template>
        </van-field>
        <customPicker title="选择产品" label-width="100" :field-names="cascaderOption" type="cascader"
          :disabled="disabledProductSelect" :columns="productList"
          @onChange="$event => { onChoseProduct($event, 'choseProduct') }" :defaultValue="searchParams.choseProduct" />
        <van-field label="配置数量" inputText="台" placeholder="请输入"
          :disabled="disabledProductSelect || searchParams.choseProduct === ''" v-model="searchParams.number"
          @onChange="$event => { onChangeData($event, 'number') }">
          <template #button>
            <p class="inputText">台</p>
          </template>
        </van-field>
        <van-field label="系统单价" inputText="元/度" placeholder="请输入"
          :disabled="disabledProductSelect || searchParams.choseProduct === ''" v-model="searchParams.systemUnitPrice"
          @onChange="$event => { onChangeData($event, 'systemUnitPrice') }">
          <template #button>
            <p class="inputText">元/度</p>
          </template>
        </van-field>
      </div>
      <p class="filter__title filter__title-margin filter__title-subsidy"><span class="step">4</span>
        <span>是否补贴</span>
      </p>
      <div class="filter__patternAnalysis filter-subsidy">
        <div class="filter__patternAnalysis-item" v-for="    item     in     subsidy    " :key="item.id"
          @click="onSubsidy(item.id)">
          <img :src="filterData.subsidy === item.id ? HasChoseRadio : NoChoseRadio" alt="">
          <span v-text="item.text" />
        </div>
      </div>
      <div class="filter__content" v-if="filterData.subsidy !== 2">
        <van-field label="补贴金额" v-model="subsidyData.subsidyAmount" inputText="元/年">
          <template #button>
            <p class="inputText">元/年</p>
          </template>
        </van-field>
        <van-field label="补贴年限" v-model="subsidyData.subsidyYear" inputText="年"> <template #button>
            <p class="inputText">年</p>
          </template>
        </van-field>
      </div>


    </div>
    <!-- 下面需要筛选项都做完 -->
    <div class="product-info" v-if="searchParamsDefault.picture">
      <p class="content-title">{{ searchParamsDefault.productName }}（{{ searchParamsDefault.modelName }}）</p>
      <el-image class="product-desc__img" :src="searchParamsDefault.picture" fit="contain" alt="" />
      <a class="content-down" :href="searchParamsDefault.handbook" download="123">手册下载</a>
    </div>
    <div class="bottom-utils">
      <div class="btn-box">
        <div class="start" @click="onAnalysis">开始分析</div>
        <div class="reset" @click="onReset">重置</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, defineEmits, watch, onMounted } from 'vue'
import NoChoseRadio from '@/assets/img/no-chose-radio.png'
import HasChoseRadio from '@/assets/img/has-chose-radio.png'
import { PATTERNANALYSIS, FILTERDATA, SUBSIDY, Subsidy } from './data'
import { PatternAnalysis, } from './data'
import { ElMessage } from 'element-plus'
import { apiAreaData, apiStrategy, apiElectricityType, apiProductList, apiProductDetail } from '@/api/investment'
import customPicker from '@/components/picker.vue'
import { showDialog } from 'vant';
const emit = defineEmits(['onAnalysis'])

const handleTips = () => {

  let content = ''
  if (searchParams.value.electricityTypeTwoName === 'BUSINESS_NDUSTRY' && tipsInfo.value.chargeDischargeStrategy.BUSINESS_NDUSTRY !== null) {
    content = tipsInfo.value.chargeDischargeStrategy.BUSINESS_NDUSTRY
  } else if (searchParams.value.electricityTypeTwoName === 'GENERAL_INDUSTRY_COMMERCE' && tipsInfo.value.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE !== null) {
    content = tipsInfo.value.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE
  } else if (searchParams.value.electricityTypeTwoName === 'LARGE_INDUSTRY' && tipsInfo.value.chargeDischargeStrategy.LARGE_INDUSTRY !== null) {
    content = tipsInfo.chargeDischargeStrategy.LARGE_INDUSTRY
  }
  showDialog({
    title: '',
    message: content,
  }).then(() => {
    // on close
  });
}
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
let showPickerOptions = ref({
  regionName: false, // 地区
  electricityTypeOneName: false, // 用电类型1
  electricityTypeTwoName: false, // 用电类型2
  tariffLevelId: false, // 期望接入电压等级
  expectedCapacity: false, // 期望装配储能容量
  choseProduct: false, // 选择产品
  number: false, // 配置数量
  systemUnitPrice: false, // 系统单价
  chargeDischargeIdentifying: ''
})
const handleShowPicker = (field: string, flag: boolean) => {
  showPickerOptions.value[field] = flag
}
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
  text: 'name',
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
  const _searchParams = JSON.parse(JSON.stringify(searchParams.value))
  const _filterData = JSON.parse(JSON.stringify(filterData.value))
  const _searchParamsDefault = JSON.parse(JSON.stringify(searchParamsDefault.value))
  const _data = Object.assign(_searchParams, _filterData, _searchParamsDefault, {
    electricityTypeOneNameText,
    electricityTypeTwoNameText,
    tariffLevelIdText,
    choseProductText
  })
  filterData.value.subsidy === 1 && Object.assign(_data, subsidyData.value)
  emit('onAnalysis', _data, tipsInfo.value.chargeDischargeStrategy[searchParams.value.electricityTypeTwoName])
}

// 重置筛选项
const onReset = () => {
  filterData.value = {
    patternAnalysis: 0,
    subsidy: 2
  }
  for (let key in searchParams.value) {
    searchParams.value[key] = ''
  }
  disabledUser.value = true
  disabledProduct.value = true
  filterFinish.value = false
  searchParamsDefault.value = {}

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
async function onAreaChange(data: any, type: string) {
  onChangeData(data, type)
  cityData.value.forEach(item => {
    if (item.regionName === data) {
      electricityType1.value = item.reInvestmentElectricityType
      searchParams.value.electricityTypeOneName = item.reInvestmentElectricityType[0].paramName
    }
  })
  disabledProduct.value = false
  onGetElectricityInfo()
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

defineExpose({
  onReset
})

</script>
<style  lang="scss">
.filter {
  .filter__left {
    .field-box {
      padding-left: 16px !important;
    }
  }

}
</style>
<style scoped lang="scss">
@import "@/style/mixin.scss";

.bottom-utils {
  @include widthAndHeight(100vw, 8rem);
  background-color: white;
  padding: 1.6rem 3.2rem 0 3.2rem;
  position: relative;
  left: -3.2rem;
  bottom: 0;
  margin-top: 3.2rem;

  .btn-box {
    @include widthAndHeight(100%, 6.4rem);
    display: flex;
    align-items: center;
    justify-content: space-between;

    >div {
      @include widthAndHeight(33rem, 6.4rem);
      background: #165DFF;
      border-radius: 0.8rem;
      @include font(2.8rem, 400, rgba(255, 255, 255, 0.9), 4.4rem);
      @include flex(center, center);
    }

    .start {
      background-color: #165DFF;
      color: white;
    }

    .reset {
      background: #F2F3F5;
      color: rgba(0, 0, 0, 0.9);
    }
  }

  a {
    width: 100%;
    text-align: center;
    margin-top: 3.2rem;
    font-size: 2.4rem;
    font-weight: 400;
    color: rgba(153, 153, 153, 0.9);
    line-height: 3.4rem;
    display: inline-block;
  }

  span {
    color: #165DFF;
  }
}

.product-info {
  width: 100%;
  background-color: white;
  padding: 3.2rem;
  margin-top: 3.2rem;
  border-radius: 0.8rem;

  .content-title {
    font-size: 2.8rem;
    font-weight: 600;
    color: #333333;
    line-height: 4.4rem;
    margin-bottom: 1.6rem;
  }

  .content-down {
    width: 17.6rem;
    height: 6.4rem;
    background: #165DFF;
    border-radius: 0.8rem;
    @include font(2.8rem, 400, #FFFFFF, 4.4rem);
    margin-top: 3.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.8rem;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1.6rem;
  }
}


.filter {
  width: 100%;
  box-sizing: border-box;
}


.filter__left {
  @include widthAndHeight(100%, 100%);
  width: 100%;
  background: white;
  padding: 3.2rem;
  border-radius: 0.8rem;
}


.filter__title {
  @include font(2.8rem, 600, #5B6985, 4.4rem);
  display: flex;
  align-items: center;
  height: 4.4rem;
  position: relative;

  .tips-icon {
    width: 3.2rem;
    height: 3.2rem;
    margin-left: 0.8rem;
  }
}

.step-line {
  position: absolute;
  left: 1.6rem;
  top: 5.1rem;
  width: 0.2rem;
  height: 8.8rem;
  background: #DBDCE2;
}

.step {
  width: 3.2rem;
  height: 3.2rem;
  background: #165DFF;
  text-align: center;
  line-height: 3.2rem;
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 3.5rem;
  border-radius: 50%;
  margin-right: 1.6rem;
}

.filter__title-margin {
  @include margin(0, 0, 1.6rem, 0);
}

.filter__title-subsidy {
  @include margin(0.8rem, 0, 1.6rem, 0);
}

.filter__content {
  @include flex(center, space-between);
  margin-left: 2.5rem;
  position: relative;

  .inputText {
    font-size: 2.8rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.9);
    line-height: 4.4rem;
  }

  .step-line {
    position: absolute;
    left: 0;
    top: 0;
    height: 100% !important;
    left: -1.2rem;
  }
}

.events-none {
  pointer-events: none;
}



.filter__patternAnalysis {
  @include flex(center, flex-start);
  margin-bottom: 4.8rem;
  height: 4.4rem;
  margin-left: 3.2rem;
}

.filter-subsidy {
  @include margin(0, 0, 1.6rem, 4rem)
}

.filter__patternAnalysis-item {
  @include flex(center, flex-start);
  @include margin(0, 1.6rem, 0, 0);
  cursor: pointer;

  img {
    @include widthAndHeight(4.8rem, 4.8rem);
    @include margin(0, 0.4rem, 0, 0);
  }

  span {
    font-size: 2.8rem;
  }
}

.tips {
  @include font(2.4rem, 400, #5B6985, 3.6rem);
  @include relative();
  @include padding(0, 0, 0, 2rem);
  @include margin(0, 0, 1.6rem, 0);
  margin-left: 5rem;

  &::before {
    content: '';
    @include widthAndHeight(3.2rem, 3.2rem);
    display: inline-block;
    background-image: url('@/assets/img/iReport-tips-icon.png');
    background-size: 3.2rem 3.2rem;
    background-repeat: no-repeat;
    @include margin(0, 0.6rem, 0, 0);
    @include absolute(1, 0, 0, 0, -1rem);
  }
}

.product-desc {
  @include widthAndHeight(100%, 35.2rem);
  @include box(1.6rem, none, #F4F7FE, 0.7rem);
  @include flex(center, center, no-wrap);

  .product-desc__img {
    @include widthAndHeight(3.2rem, 3.2rem);
    @include margin(0, 1.6rem);
  }

  .product-desc__content {
    flex: 1;

    .content-title {
      @include font(2rem, 600, #1C232F, 3.2rem);
      @include margin(0, 0, 1.6rem, 0);
    }

    .content-desc {
      @include font(2.8rem, 400, #5B6985, 2.4rem);
      @include margin(0, 0, 4rem, 0);
    }

    .content-down {
      @include widthAndHeight(10.8rem, 4rem);
      @include box(0.9rem 2.6rem, none, #2D5CF6, 0.4rem);
      @include font(2.8rem, 400, #ffffff, 2.2rem);
      cursor: pointer;
    }
  }
}
</style>
