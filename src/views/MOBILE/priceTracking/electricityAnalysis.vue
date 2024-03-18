<template>
  <div class="MB-filter-head electricity-analysis">
    <div class="MB-filter-title">
      <img src="@/assets/img/icon_filter.png" />
      <p>筛选条件</p>
    </div>
    <div class="MB-filter-line" />
    <div class="MB-filter-list">
      <div class="MB-filter-list-special" @click="showMultiple = true">
        <span>地区</span>
        <span class="MB-filter-list-special__text">{{ showRegionName }}</span>
      </div>
      <customPicker title="用电类型 I" :columns="electricityTypes" :defaultValue="searchParams.electricityTypeOneName"
        @onChange="changeElectricityTypes" field="electricityTypeOneName" />
      <customPicker title="用电等级" :columns="voltageLevelData" :defaultValue="searchParams.tariffLevelId"
        @onChange="changeVoltageLevel" field="tariffLevelId" />
      <customPicker title="月份" :columns="yearData" :defaultValue="searchParams.years" @onChange="changeMonth"
        field="years" />
    </div>
  </div>
  <div class="electricityAnalysis-content" v-if="contentTitle !== ''">
    <p class="electricityAnalysis-contentTitle">{{ contentTitle }}</p>
    <p class="electricityAnalysis-contentDesc">{{ contentDesc }}</p>
    <div class="electricityAnalysis-priceDifferenceData">
      <div v-for="item in priceDifferenceData" :key="item.paramName" class="differencePrice-typeChose"
        @click="onChosePriceDifference(item)">
        <div v-if="searchParams.differencePrice !== item.paramName" class="differencePrice-noChose"></div>
        <div v-else class="differencePrice-hasChose">
          <div />
        </div>
        <span>{{ item.paramDesc }}</span>
      </div>
    </div>
    <div v-if="!canvasLoading" class="export-img export-img-special" @click="onExportImg">导出图片</div>
    <div v-if="!canvasLoading" id="my-chart_electricity-price-analysis" ref="myeChartsMB1"></div>
  </div>

  <multiplePicker :showMultiple="showMultiple" :option="regionalData" @onClose="showMultiple = false"
    labelKey="regionName" :defaultValue="searchParams.regionName" @onChange="onChangeMultiple" />
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, defineProps, computed, defineEmits, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { showLoadingToast, showToast } from 'vant';
import multiplePicker from '@/components/MOBLIE/MultiplePicker.vue'
import customPicker from '@/components/picker.vue'
import { apiRegionalData, getPeakAndValley, getVoltageLevel, getMonth, getDifferentialRanking } from '@/api/priceTracking'
import { eChartsOptionCommon } from '@/views/PC/priceTracking/data'
import { exportCanvas } from '@/utils/index'
const showMultiple: Ref<boolean> = ref(false) // 是否打开多选弹窗框
const regionalData = ref<any>([]) // 城市数据
const electricityTypes = ref<any>([])// 用电类型1数组
const voltageLevelData = ref<any>([]) // 电压等级
const yearData = ref<any>([]) // 时间数据
const eChartsOption: Ref<any> = ref(JSON.parse(JSON.stringify(eChartsOptionCommon)))
const priceDifferenceData = ref<any>([]) // 峰谷价差
// 筛选项搜索结果
const searchParams = ref({
  regionName: [], // 地区
  electricityTypeOneName: '', // 用电类型
  differencePrice: '', // 峰谷价差
  tariffLevelId: '', // 电压等级
  years: ''
})
const showRegionName: Ref<string> = ref('全国')
const contentTitle: Ref<string> = ref('')
const contentDesc: Ref<string> = ref('')
const canvasLoading = ref(false)

// 导出图片
function onExportImg() {
  const title = contentTitle.value
  const desc = contentDesc.value
  const _echarts = echarts.getInstanceByDom(myeChartsMB1.value)
  exportCanvas(title, desc, title, _echarts.getDataURL({ type: 'jpeg', backgroundColor: '#fff' }))
  showLoadingToast({
    message: '导出图片中...',
    forbidClick: true,
    loadingType: 'spinner'
  });
}
// 选择城市
function onChangeMultiple(value: string) {
  const index = searchParams.value.regionName.indexOf(value);
  if (index !== -1) {
    searchParams.value.regionName.splice(index, 1);

  } else searchParams.value.regionName.push(value);
  if (searchParams.value.regionName.join(',') === '') {
    return showToast('最少选择一个地区');
  }
  showRegionName.value = searchParams.value.regionName.join(',')
  getElectricityTypeOneName()
}
// 点击地区选择器
function changeRegion() {
  showMultiple.value = true
}
// 选择峰谷价差
function onChosePriceDifference(data: any) {
  searchParams.value.differencePrice = data.paramName
  getElectricityTypeOneName()
}
// 用电类型change
function changeElectricityTypes(val: string) {
  searchParams.value.electricityTypeOneName = val
  handelGetVoltageLevel()
}
// 电压等级change
function changeVoltageLevel(val) {
  searchParams.value.tariffLevelId = val
  onGetMonth()
}
// 月份change
function changeMonth(val) {
  searchParams.value.years = val
  getElectricityTypeOneName()
}
// 峰谷价差change
function changePriceDifference(val) {
  searchParams.value.differencePrice = val
  getElectricityTypeOneName()
}
// 获取地区数据
async function onGetRegionalData() {
  try {
    const { data } = await apiRegionalData({ type: 'all' })
    regionalData.value = data
    searchParams.value.regionName = [data[0].regionName]
    data.forEach(item => {
      if (item.reInvestmentElectricityType && item.reInvestmentElectricityType.length > 0) {
        item.reInvestmentElectricityType.forEach(_item => {
          const index = electricityTypes.value.findIndex(__item => __item.paramName === _item.paramName)
          if (index === -1) {
            electricityTypes.value.push(_item)
            searchParams.value.electricityTypeOneName = electricityTypes.value[0].paramName
          }
        })
      }
    })
    handelGetVoltageLevel()
  } catch (error) {
    console.error(error)
  }
}
// 获取电压等级
async function handelGetVoltageLevel() {
  try {
    const { data } = await getVoltageLevel({
      electricityTypeOneName: searchParams.value.electricityTypeOneName
    })
    voltageLevelData.value = data
    searchParams.value.tariffLevelId = data[0].paramName
    onGetMonth()
  } catch (error) {
    console.error(error)
  }
}
// 获取月份
async function onGetMonth() {
  try {
    const { data } = await getMonth({
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
      regionName: searchParams.value.regionName.join(','),
    })
    yearData.value = data
    searchParams.value.years = data[data.length - 1].paramName
    getElectricityTypeOneName()
  } catch (error) {
    console.error(error)
  }
}
// 获取峰谷价差筛选项
async function onGetPeakAndValley() {
  try {
    const { data } = await getPeakAndValley()
    priceDifferenceData.value = data
    searchParams.value.differencePrice = data[0].paramName
  } catch (error) {
    console.error(error)
  }
}
let myeChartsMB1 = ref();
watch(
  () => canvasLoading.value,
  val => {
    !val && (myeChartsMB1.value = ref())
  }
)
// 获取差异排名
async function getElectricityTypeOneName() {

  canvasLoading.value = true
  const { electricityTypeOneName, differencePrice, tariffLevelId, regionName, years } = searchParams.value
  const _titleText = titleText.value
  contentTitle.value = `各省市${_titleText.years}工商业代理购电${_titleText.electricityTypeOneName}${_titleText.tariffLevelId}价格高峰低谷电差排名`
  contentDesc.value = `·${_titleText.electricityTypeOneName}·${_titleText.tariffLevelId}·${_titleText.differencePrice}`
  const { data } = await getDifferentialRanking({ electricityTypeOneName, differencePrice, tariffLevelId, regionName, years })
  canvasLoading.value = false
  eChartsOption.value.title.text = ''
  eChartsOption.value.series.data = data.map(item => item.electrovalenceDifference).reverse()
  eChartsOption.value.series.barWidth = 15
  eChartsOption.value.dataZoom = []
  eChartsOption.value.grid.top = '2%'
  eChartsOption.value.grid.bottom = '0%'
  eChartsOption.value.grid.right = '15%'
  eChartsOption.value.grid.left = '22%'
  eChartsOption.value.xAxis.type = 'value'
  eChartsOption.value.yAxis.type = 'category'
  eChartsOption.value.yAxis.name = ''
  eChartsOption.value.yAxis.axisLabel = {
    lineHeight: 16,
    formatter(val) {
      // 当字符串长度超过3时
      if (val.length > 5) {
        // 把字符串分割成字符串数组
        const array = val.split('')
        //在下标2处删除0个，加上回车
        array.splice(5, 0, '\n');
        return array.join('')
      } else {
        return val;
      }
    }
  },
    eChartsOption.value.xAxis.name = '元/度'
  eChartsOption.value.yAxis.data = data.map(item => item.regionName).reverse()
  eChartsOption.value.xAxis.position = 'top'
  createEcharts(data)
}
// 创建图表
function createEcharts(data) {
  nextTick(() => {
    if (document.getElementById('my-chart_electricity-price-analysis')) {
      const myChart = echarts.init(document.getElementById('my-chart_electricity-price-analysis'), null, { height: data.length * 35 });
      myChart.setOption(eChartsOption.value)
    }
  })
}
const titleText = computed(() => {
  const obj = {
    electricityTypeOneName: '', // 用电类型
    differencePrice: '', // 峰谷价差
    tariffLevelId: '', // 电压等级
    years: ''
  }
  obj.electricityTypeOneName = electricityTypes.value.find(item => item.paramName === searchParams.value.electricityTypeOneName).paramDesc
  obj.differencePrice = priceDifferenceData.value.find(item => item.paramName === searchParams.value.differencePrice).paramDesc
  obj.tariffLevelId = voltageLevelData.value.find(item => item.paramName === searchParams.value.tariffLevelId).paramDesc
  obj.years = yearData.value.find(item => item.paramName === searchParams.value.years).paramDesc
  return obj
})
onMounted(() => {
  // 获取所有数据
  Promise.all([onGetRegionalData(), onGetPeakAndValley()])
})
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.electricity-analysis {
  @include margin(3.2rem);
}

.electricityAnalysis-content {
  @include box(3.2rem, (1.6rem 0 0 0), #FFFFFF);
  border-radius: 0.8rem;
  overflow: hidden;
}

.electricityAnalysis-contentTitle {
  @include font(2.8rem, 600, rgba(0, 0, 0, 0.9),4.4rem);
  @include margin(0, 0, 0.8rem, 0);
}

.electricityAnalysis-contentDesc {
  @include font(2.8rem, 400, rgba(153, 153, 153, 0.9),4.4rem);
}

.electricityAnalysis-tips {
  @include font(2.8rem, 400, #165DFF, 4.4rem);
  @include relative();
  @include padding(0, 0, 0, 4rem);

  &::before {
    content: '';
    display: inline-block;
    @include widthAndHeight(3.2rem, 3.2rem);
    background-image: url('@/assets/img/iReport-tips-icon.png');
    background-size: 3.2rem 3.2rem;
    background-repeat: no-repeat;
    @include margin(0, 0.6rem, 0, 0);
    @include absolute(1, 0.4rem, 0, none, -0.1rem);
  }
}

.electricityAnalysis-priceDifferenceData {
  @include flex(center, flex-start);
  @include margin(3.2rem, 0, 3.2rem, 0);
}

.differencePrice-typeChose {
  @include flex();
  @include margin(0, 0, 1.6rem, 0);

  span {
    @include font(2.8rem, 400, rgba(0, 0, 0, 0.9).4.4rem);
    @include margin(0, 3.2rem, 0, 1.6rem);
  }
}

.differencePrice-noChose {
  @include widthAndHeight(3.2rem, 3.2rem);
  border: 0.2rem solid #DBDCE2;
  border-radius: 100%;
  box-sizing: border-box;
}

.differencePrice-hasChose {
  @include widthAndHeight(3.2rem, 3.2rem);
  border: 0.2rem solid #165DFF;
  @include flex();
  border-radius: 100%;
  box-sizing: border-box;

  div {
    @include widthAndHeight(1.6rem, 1.6rem);
    background: #165DFF;
    border-radius: 100%;
  }
}

.MB-filter-list-special {
  @include widthAndHeight(100%, 4.4rem);
  @include flex(center, space-between);
  @include font(2.8rem, 400, rgba(0, 0, 0, .6), 4.4rem);
  @include margin(1.8rem, 0, 1.8rem, 0);
}

.MB-filter-list-special__text {
  @include widthAndHeight(42rem);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
  @include relative();
  @include padding(0, 3rem, 0, 0);
  @include font(2.8rem, 400, rgba(0, 0, 0, .9), 4.4rem);

  &::after {
    content: '';
    display: inline-block;
    @include widthAndHeight(3rem, 3rem);
    background-image: url('@/assets/img/icon_right.png');
    background-size: 3rem 3rem;
    background-repeat: no-repeat;
    @include absolute(1, 0.5rem, 0, 0, none);
  }
}

.export-img-special {
  @include margin(-4rem, auto, 2rem, auto);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
</style>
