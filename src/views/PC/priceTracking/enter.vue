<template>
  <div id="electricity-price" class="page">
    <div class="price-type">
      <div class="price-type__item" :class="{ 'price-type__item-chose': chosePriceType === item.id }"
        v-for="item in priceTypeList" :key="item.id" @click="chosePriceType = item.id">
        {{ item.text }}
      </div>
    </div>
    <!-- 分时/分月电价 -->
    <div v-show="chosePriceType === 1">
      <div class="filter">
        <Select @on-change="changeRegion" title="地区" :options="regionalData" valueKey="regionName"
          :defaultValue="searchParams.regionName" />
        <Select @on-change="changeElectricityTypeOne" title="用电类型 I" :options="electricityType1" valueKey="paramName"
          labelKey="paramDesc" :defaultValue="searchParams.electricityTypeOneName" />
        <Select @on-change="changeElectricityTypeTwo" title="用电类型Ⅱ" :options="electricityType2" valueKey="paramName"
          labelKey="paramDesc" :defaultValue="searchParams.electricityTypeTwoName" />
        <Select @on-change="changeVoltageLevel" :options="voltageLevelData" valueKey="paramName" labelKey="paramDesc"
          :defaultValue="searchParams.tariffLevelId" title="电压等级" />
      </div>
      <div class="flex small-price-type">
        <div class="price-type">
          <div class="price-type__item" :class="{ 'price-type__item-chose': choseSpecific === item.id }"
            v-for="item in specificList" :key="item.id" @click="handleSelectPriceType(item.id)">{{ item.text }}</div>
        </div>
        <div class="export-image" @click="exportResult">导出图片</div>
      </div>
      <Select @on-change="changeMonth" :options="monthData" :default-value="monthVal" valueKey="paramName"
        labelKey="paramDesc" v-if="choseSpecific === 1" title="月份选择" width="30%" />
      <div v-loading="loading" id="my-chart_electricity-price" ref="myeCharts"></div>
      <ExportCanvasDialog :visible="exportVisible" :img-url="exportImgUrl" :img-title="exportImgTitle"
        @close="exportVisible = false" />
    </div>
    <!-- 电价分析 -->
    <div v-if="chosePriceType === 2">
      <ElectricityAnalysis />
    </div>
    <!-- 各省峰谷时段 -->
    <div v-if="chosePriceType === 3">
      <ElectricityPricePeriod />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getTimePrice,
  getMonthPrice,
  getMonthByTime,
  apiRegionalData,
  getElectricityType,
  getMonthDifference,
  getDischargeStrategy
} from '@/api/priceTracking'
import * as echarts from 'echarts'
import { cloneDeep } from 'lodash'
import { FILTERLIST } from './filter/data'
import Select from '@/components/select.vue'
import image from '@/assets/img/icon_hint_nor.png';
import ElectricityAnalysis from './electricityAnalysis.vue'
import ElectricityPricePeriod from './electricityPricePeriod.vue'
import ExportCanvasDialog from './components/exportCanvasDialog.vue'
import { onMounted, computed, watch, Ref, ref, onBeforeUnmount } from 'vue'
import { eChartsOptionCommon, computedColor, titleStyle, textStyle, flexStyle } from '@/utils/eCharts'
import { vLoading } from 'element-plus'
const eChartsOption: Ref<any> = ref({
  ...cloneDeep(eChartsOptionCommon),
  title: [ // 这里需要用到多个标题
    {
      left: 'center',
      text: "",
      textStyle: {
        fontSize: 18,
        lineHeight: 26,
        color: '#1C232F',
        fontWeight: 'bolder',
      }
    }
  ],
  yAxis: {
    name: "元/度",
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#E5E6EA",
        width: 1
      }
    }
  }
})
const priceTypeList: Ref<Array<FILTERLIST>> = ref([
  { id: 1, text: '分时/分月电价' },
  { id: 2, text: '电价分析' },
  { id: 3, text: '各省峰谷时段' }
])
const specificList: Ref<Array<FILTERLIST>> = ref([
  { id: 1, text: '分时电价' },
  { id: 2, text: '分月电价' },
  { id: 3, text: '峰谷价差' }
])
const loading = ref(false)
// 获取echarts节点
const myeCharts = ref(null)
// 导出图片相关
const exportImgUrl = ref({ png: '', jpg: '' }) // 导出图片地址
const exportImgTitle: Ref<string> = ref('')
const exportVisible: Ref<boolean> = ref(false) // 是否打开导出图片弹窗

const chosePriceType: Ref<number> = ref(1)
const choseSpecific: Ref<number> = ref(1)

const monthData = ref<any>([])
const regionalData = ref<any>([]) // 城市数据
const electricityType1 = ref<any>([])// 用电类型1数组
const electricityType2 = ref<any>([])// 用电类型2数组
const voltageLevelData = ref<any>([])// 电压等级
// 用作展示tip时的判断
const timeEchartsData = ref<any>([])

// 筛选项搜索结果
const searchParams = ref({
  regionName: '',
  electricityTypeOneName: '',
  electricityTypeTwoName: '',
  tariffLevelId: ''
})
// 月份
const monthVal = ref('')

const timeElectricityPriceData = ref<any>([]) // 分时电价数据
const monthElectricityPriceData = ref<any>([]) // 分时电价数据
const monthPriceDifferenceData = ref<any>({}) // 峰谷价差数据

// 策略
const dischargeStrategyData = ref<string>('')

// 导出图片
const exportResult = () => {
  const _echarts = echarts.getInstanceByDom(myeCharts.value)
  exportImgUrl.value.png = _echarts.getDataURL({ type: 'png' })
  exportImgUrl.value.jpg = _echarts.getDataURL({ type: 'jpeg', backgroundColor: '#fff' })
  exportImgTitle.value = '储能月度招标分析'
  exportVisible.value = true
}

const titleTwo = computed(() => {
  const width: number = document.getElementById('investment-return').offsetWidth || document.getElementById('electricity-price').offsetWidth
  const singleLineQuantity = Math.round((width - Math.round(width / 40 * 2)) / 14)
  return { // 标题组件
    text: '{a|}' + dischargeStrategyData.value.replace(new RegExp(`(.{${singleLineQuantity}})`, 'g'), `$1\n`),
    left: 'center',
    top: 415,
    textStyle: {
      fontSize: 12,
      lineHeight: 18,
      width: 300,
      fontWeight: 400,
      color: '#565656',
      fontFamily: 'Microsoft YaHei',
      rich: {
        a: {
          color: '#F00', // 设置 动态数据字体的颜色
          fontSize: '12', // 设置 动态数据字体的大小
          height: 18,
          width: 18,
          backgroundColor: {
            image: image
          },
          align: 'center', // 设置水平方向上居中对齐
          verticalAlign: 'middle' // 设置垂直方向上居中对齐
        }
      }
    }
  }
})

const titleText = computed(() => {
  const obj = {
    regionName: '',
    electricityTypeOneName: '',
    electricityTypeTwoName: '',
    tariffLevelId: '',
    monthVal: ''
  }
  obj.tariffLevelId = voltageLevelData.value.find(item => item.paramName === searchParams.value.tariffLevelId)?.paramDesc
  obj.regionName = regionalData.value.find(item => item.regionName === searchParams.value.regionName)?.regionName
  obj.electricityTypeOneName = electricityType1.value.find(item => item.paramName === searchParams.value.electricityTypeOneName)?.paramDesc
  obj.electricityTypeTwoName = electricityType2.value.find(item => item.paramName === searchParams.value.electricityTypeTwoName)?.paramDesc
  obj.monthVal = monthData.value.find(item => item.paramName === monthVal.value)?.paramDesc
  return obj
})

function handleSelectPriceType(id) {
  choseSpecific.value = id
  clearEchart()
  if (choseSpecific.value === 1) {
    handleTOUData()
  } else if (choseSpecific.value === 2) {
    handleMonthData()
  } else {
    handlePriceDifferenceData()
  }
}
/*
  getData
*/
// 获取放电策略
async function getDischargeStrategyData() {
  try {
    const { data } = await getDischargeStrategy({
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
      region: searchParams.value.regionName
    })
    dischargeStrategyData.value = data.chargeDischargeStrategy[searchParams.value.electricityTypeTwoName]?.replace(/\n/g, '').replace(/\r/g, '')
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 获取地区数据
const onGetRegionalData = async () => {
  try {
    const res = await apiRegionalData(null)
    regionalData.value = res.data.filter(item => !item.regionName.includes('2024'))
    // 默认获取到浙江省
    searchParams.value.regionName = '浙江省'
    res.data.forEach(item => {
      if (item.regionName === searchParams.value.regionName) {
        electricityType1.value = item.reInvestmentElectricityType
        searchParams.value.electricityTypeOneName = item.reInvestmentElectricityType[0].paramName
      }
    })
    getElectricityTypeTwo()
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 获取用电类型2数据
async function getElectricityTypeTwo() {
  try {
    const { data } = await getElectricityType({
      regionName: searchParams.value.regionName,
      electricityTypeOneName: searchParams.value.electricityTypeOneName
    })
    electricityType2.value = data
    searchParams.value.electricityTypeTwoName = data[0].paramName
    // 通过用电类型2获取到电压等级
    voltageLevelData.value = data[0].voltageLevel
    searchParams.value.tariffLevelId = data[0].voltageLevel[0].paramName
    getDischargeStrategyData()
    getElectricityPrice()
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 获取月份
async function getMonthByTimes() {
  try {
    const { data } = await getMonthByTime({ ...searchParams.value })
    monthData.value = data
    monthVal.value = data[data.length - 1].paramName
    getTOUData()
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
/*
  change
*/
// 地区 change
function changeRegion(val) {
  loading.value = true
  searchParams.value.regionName = val;
  // 获取到用电类型1
  const data = regionalData.value.find(item => item.regionName === val)?.reInvestmentElectricityType
  electricityType1.value = data
  searchParams.value.electricityTypeOneName = data[0].paramName
  getElectricityTypeTwo();
}
// 用电类型1 change
function changeElectricityTypeOne(val) {
  loading.value = true
  searchParams.value.electricityTypeOneName = val;
  getElectricityTypeTwo();
}
// 用电类型2 change
function changeElectricityTypeTwo(val) {
  loading.value = true
  searchParams.value.electricityTypeTwoName = val;
  const data = electricityType2.value.find(item => item.paramName === val)?.voltageLevel
  voltageLevelData.value = data
  searchParams.value.tariffLevelId = data[0].paramName
  getDischargeStrategyData()
  getElectricityPrice()
}
// 月份 change
function changeMonth(val) {
  loading.value = true
  monthVal.value = val;
  getTOUData()
}
// 电压等级 change
function changeVoltageLevel(val) {
  loading.value = true
  searchParams.value.tariffLevelId = val;
  getElectricityPrice()
}

// 获取分时分月电价 峰谷价差
function getElectricityPrice() {
  getMonthPriceData()
  getMonthByTimes()
  getMonthDifferenceData()
}

// 处理分时电价图表
function handleTOUData() {
  let newData = []
  const _defaultData = [
    { name: '尖峰时段', periodType: 'topTime', lineColor: 'rgba(245,63,63,1)', data: [] },
    { name: '高峰时段', periodType: 'highTime', lineColor: 'rgba(255,125,0,1)', data: [] },
    { name: '平时时段', periodType: 'flatTime', lineColor: 'rgba(255,207,29,1)', data: [] },
    { name: '低谷时段', periodType: 'lowTime', lineColor: 'rgba(80,177,66,1)', data: [] },
    { name: '深谷时段', periodType: 'deepTime', lineColor: 'rgba(167,102,244,1)', data: [] }
  ]
  // 处理数据
  const xAxisData = []
  timeElectricityPriceData.value.forEach(item => {
    const eachTimePeriod = Array(timeToMinutes(item.endTime) - timeToMinutes(item.startTime)).fill({ ...item })
    eachTimePeriod.forEach((item, index) => {
      const label = { align: "left", show: true, color: "#1C232F", fontSize: 14, fontWeight: 600, lineHeight: 22, offset: [0, 4], position: "top" }
      if (xAxisData.length === 0) {
        xAxisData.push(item.startTime)
      } else if (index === eachTimePeriod.length - 1) {
        xAxisData.push(item.endTime)
      } else {
        xAxisData.push('')
      }
      _defaultData.forEach(_item => {
        if (item.periodType === _item.periodType) {
          _item.data.push({
            value: item.electrovalence,
            label: index === 0 ? label : { ...label, show: false },
            symbol: index === 0 ? 'circle' : 'none'
          })
        } else {
          _item.data.push({
            value: '-',
            label: { ...label, show: false },
            symbol: index === 0 ? 'circle' : 'none'
          })
        }
      })
    })
    newData = [...newData, ...eachTimePeriod]
  })
  timeEchartsData.value = newData
  let _series = []
  let _color = []
  let _data = []
  const title = `${titleText.value.regionName}代理工商业购电分时电价图`
  const subtitle = `·${titleText.value.electricityTypeOneName}·${titleText.value.electricityTypeTwoName}·${titleText.value.tariffLevelId}`
  _defaultData.forEach(item => {
    if (!item.data.every(item => item.value === '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  options.title[0].text = title;
  options.title[0].subtext = subtitle;
  options.title[1] = titleTwo.value
  options.legend.bottom = '100';
  options.grid = { bottom: "150" };
  options.legend.data = _data;
  options.xAxis.data = xAxisData
  options.color = _color;
  options.series = (_series);
  options.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let index = 0
      let contentText = ''
      params.forEach((item) => {
        if (item.value !== '-') {
          index = item.dataIndex
          contentText = contentText + `<div style="${flexStyle}">
            <div style='width: 150px;'>
              ${item.marker}
              <span style="${textStyle}">${item.seriesName}</span>
            </div>
            <span style="${textStyle}">${item.value}</span>
          </div>`
        }
      })
      const { endTime, startTime } = timeEchartsData.value[index]
      return `<div style="${titleStyle}">${startTime}-${endTime}</div>${contentText}`
    }
  };
  clearEchart()
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  if (myChart) {
    myChart && myChart.setOption(options)
    loading.value = false
  }
}
// 处理分月电价图表
function handleMonthData() {
  const _defaultData = [
    { name: '尖峰时段', periodType: 'topTime', lineColor: 'rgba(245,63,63,1)', data: [] },
    { name: '高峰时段', periodType: 'highTime', lineColor: 'rgba(255,125,0,1)', data: [] },
    { name: '平时时段', periodType: 'flatTime', lineColor: 'rgba(255,207,29,1)', data: [] },
    { name: '低谷时段', periodType: 'lowTime', lineColor: 'rgba(80,177,66,1)', data: [] },
    { name: '深谷时段', periodType: 'deepTime', lineColor: 'rgba(167,102,244,1)', data: [] }
  ]
  const xAxisData = []
  monthElectricityPriceData.value.forEach(item => {
    xAxisData.push(item.month)
    for (const key in item.data) {
      _defaultData.forEach(_item => {
        if (_item.periodType === key) {
          _item.data.push(item.data[key])
        }
      })
    }
  })
  let _series = []
  let _color = []
  let _data = []
  const title = `${titleText.value.regionName}代理工商业购电分月电价图`;
  const subtitle = `·${titleText.value.electricityTypeOneName}·${titleText.value.electricityTypeTwoName}·${titleText.value.tariffLevelId}`
  _defaultData.forEach(item => {
    if (item.data.some(item => item !== '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  options.title[0].text = title;
  options.title[0].subtext = subtitle;
  options.title[1] = titleTwo.value
  options.legend.bottom = '100';
  options.grid = { bottom: "150" };
  options.legend.data = _data;
  options.color = _color;
  options.xAxis.data = xAxisData;
  options.series = (_series);
  options.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let contentText = ''
      params.forEach(item => {
        contentText = item.value === '-' ? contentText : contentText + `<div style="${flexStyle}">
          <div style='width: 150px;'>
            ${item.marker}
            <span style="${textStyle}">${item.seriesName}</span>
          </div>
          <span style="${textStyle}">${item.value}</span>
        </div>`
      })
      return `<div style="${titleStyle}">${params[0].name}</div>${contentText}`
    }
  };
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  myChart.setOption(options)
  loading.value = false
}
// 处理峰谷价差图表
function handlePriceDifferenceData() {
  const _defaultData = [
    { name: '尖峰低谷价差', periodType: 'sharpDifference', lineColor: 'rgba(245,63,63,1)', data: [] },
    { name: '高峰低谷价差', periodType: 'heightDifference', lineColor: 'rgba(255,125,0,1)', data: [] },
    { name: '尖峰平时价差', periodType: 'sharpAdjustment', lineColor: 'rgba(255,207,29,1)', data: [] },
    { name: '高峰平时价差', periodType: 'altitudeBalance', lineColor: 'rgba(80,177,66,1)', data: [] },
  ]
  const xAxisData = []
  monthPriceDifferenceData.value.monthlySpreadData.forEach(item => {
    xAxisData.push(item.month)
    for (const key in item.data) {
      _defaultData.forEach(_item => {
        if (_item.periodType === key) {
          _item.data.push(item.data[key])
        }
      })
    }
  })
  let _series = []
  let _color = []
  let _data = []
  const title = `${titleText.value.regionName}代理工商业购电峰谷价差`
  const subtitle = `·${titleText.value.electricityTypeOneName}·${titleText.value.electricityTypeTwoName}·${titleText.value.tariffLevelId}`
  _defaultData.forEach(item => {
    if (item.data.some(item => item !== '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  options.title[0].text = title;
  options.title[0].subtext = subtitle;
  options.legend.data = _data;
  options.color = _color;
  options.xAxis.data = xAxisData;
  options.series = (_series);
  options.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let contentText = ''
      params.forEach(item => {
        contentText = item.value === '-' ? contentText : contentText + `<div style="${flexStyle}">
          <div style='width: 150px;'>
            ${item.marker}
            <span style="${textStyle}">${item.seriesName}</span>
          </div>
          <span style="${textStyle}">${item.value}</span>
        </div>`
      })
      return `<div style="${titleStyle}">${params[0].name}</div>${contentText}`
    }
  };
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  myChart.setOption(options)
  loading.value = false
}
// 获取分时电价
async function getTOUData() {
  try {
    const { data } = await getTimePrice({ ...searchParams.value, years: monthVal.value })
    timeElectricityPriceData.value = data
    choseSpecific.value === 1 && handleTOUData()
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 获取分月电价
async function getMonthPriceData() {
  try {
    const { data } = await getMonthPrice({ ...searchParams.value })
    monthElectricityPriceData.value = data
    choseSpecific.value === 2 && handleMonthData();
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 获取峰谷差价
async function getMonthDifferenceData() {
  try {
    const { data } = await getMonthDifference({ ...searchParams.value, years: monthVal.value })
    monthPriceDifferenceData.value = data
    choseSpecific.value === 3 && handlePriceDifferenceData();
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
// 重新定义图标大小
function reSizeEchart() {
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  myChart && myChart?.resize();
}
// 清除图表数据
function clearEchart() {
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  myChart && myChart?.clear();
  // myChart && myChart?.dispose();
}
onMounted(() => {
  loading.value = true
  onGetRegionalData()
  // 监听窗口大小变化
  window.addEventListener('resize', reSizeEchart);
})
// 在组件销毁前移除事件监听器
onBeforeUnmount(() => {
  // 销毁echarts实例
  const myChart = echarts.init(document.getElementById('my-chart_electricity-price'));
  myChart && myChart.dispose();
  window.removeEventListener('resize', reSizeEchart);
});
function timeToMinutes(time) {
  // 将时间拆分成小时和分钟
  const [hours, minutes] = time.split(':').map(Number);
  // 计算总分钟数
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.price-type {
  @include flex(center, flex-start);

  .price-type__item {
    @include margin(0, 32px, 0, 0);
    @include padding(6px, 0, 10px, 0);
    @include font(16px, 400, #5B6985, 24px);
    transition: all 0.2s;
    cursor: pointer;
    border-bottom: 2px solid rgba(0, 0, 0, 0);
  }

  .price-type__item-chose {
    @include font(16px, 600, #1D232E, 24px);
    border-bottom: 2px solid #2D5CF6;
  }
}

.filter {
  @include flex();
  @include padding(0, 0, 8px, 0);
  @include margin(24px, 0, 24px, 0);
  border-bottom: 1px solid #E5E6EA;
}

.flex {
  @include flex(center, space-between);
}

.small-price-type {
  @include margin(0, 0, 16px, 0);
}

.export-image {
  @include box(5px 12px, none, #2D5CF6, 4px);
  @include font(14px, 400, #FFFFFF, 22px);
  cursor: pointer;
}

#my-chart_electricity-price {
  @include widthAndHeight(100%, 500px);
}
</style>
