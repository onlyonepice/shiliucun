<template>
  <div class="priceTracking-body">
    <div class="MB-filter-head">
      <div class="MB-filter-title">
        <img src="@/assets/img/icon_filter.png" />
        <p>筛选条件</p>
      </div>
      <div class="MB-filter-line" />
      <div class="MB-filter-list">
        <customPicker title="地区" :field-names="{ text: 'regionName', value: 'regionName' }" :columns="regionalData"
          @onChange="changeRegion" :defaultValue="searchParams.regionName" field="regionName" />
        <customPicker title="用电类型 I" :columns="electricityType1" :defaultValue="searchParams.electricityTypeOneName"
          @onChange="changeElectricityTypeOne" field="electricityTypeOneName" />
        <customPicker title="用电类型Ⅱ" :columns="electricityType2" :defaultValue="searchParams.electricityTypeTwoName"
          @onChange="changeElectricityTypeTwo" field="electricityTypeTwoName" />
        <customPicker title="电压等级" :columns="voltageLevelData" :defaultValue="searchParams.tariffLevelId"
          @onChange="changeVoltageLevel" field="tariffLevelId" />
      </div>
    </div>
    <div class="MB-body">
      <div class="MB-body_type">
        <div v-for="item in specificList" :key="item.id" class="MB-body_type_item"
          :class="item.id === choseSpecific ? 'active' : ''" @click="handleSelectSpecific(item.id)">{{ item.text }}</div>
      </div>
      <div class="MB-echarts_title">
        <div v-if="!titleText.title.includes('undefined')" class="MB-echarts_title_text">{{ titleText.title }}</div>
        <div v-if="!titleText.title.includes('undefined')" class="MB-echarts_title_subtext">{{ titleText.subtitle }}
        </div>
      </div>
      <div v-if="choseSpecific === 1" class="month-select">
        <customPicker title="月份选择" :columns="monthData" :defaultValue="monthVal" @onChange="changeMonth"
          field="monthVal" />
      </div>
      <div id="my-echarts-mini"></div>
      <div class="export-img" @click="onExportImg">导出图片</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getTimePrice,
  getMonthPrice,
  getMonthByTime,
  apiRegionalData,
  getElectricityType,
  getMonthDifference,
  getDischargeStrategy
} from '@/api/priceTracking'
import { showLoadingToast } from 'vant';
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'
import { ref, Ref, onMounted, computed } from 'vue'
import customPicker from '@/components/picker.vue'
import { eChartsOptionCommon, computedColor, titleStyleMini, textStyleMini, flexStyle } from '@/utils/eCharts'
import { exportCanvas } from '@/utils/index'
const eChartsOption: Ref<any> = ref({
  ...cloneDeep(eChartsOptionCommon), title: [ // 这里需要用到多个标题
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
  grid: { top: "15%", left: "10%", right: "10%", bottom: "25%" },
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
const specificList: Ref<Array<{ id: number; text: string }>> = ref([
  { id: 1, text: '分时电价' },
  { id: 2, text: '分月电价' },
  { id: 3, text: '峰谷价差' }
])
const choseSpecific = ref<number>(1)

const timeEchartsData: any = ref([])
// data
const regionalData = ref<any>([])
const electricityType1 = ref<any>([])
const electricityType2 = ref<any>([])
const voltageLevelData = ref<any>([])
const monthData = ref<any>([])
// 筛选数据
const searchParams = ref<{
  regionName: string,
  electricityTypeOneName: string,
  electricityTypeTwoName: string,
  tariffLevelId: string
}>({
  regionName: '',
  tariffLevelId: '',
  electricityTypeOneName: '',
  electricityTypeTwoName: ''
})
const monthVal = ref<string>('')

// 数据
const timeElectricityPriceData = ref<any>()
const monthPriceDifferenceData = ref<any>()
const monthElectricityPriceData = ref<any>()

// 放点策略
const dischargeStrategyData = ref('')

const titleText = computed(() => {
  const tariffLevelId = voltageLevelData.value.find(item => item.paramName === searchParams.value.tariffLevelId)?.paramDesc
  const regionName = regionalData.value.find(item => item.regionName === searchParams.value.regionName)?.regionName
  const electricityTypeOneName = electricityType1.value.find(item => item.paramName === searchParams.value.electricityTypeOneName)?.paramDesc
  const electricityTypeTwoName = electricityType2.value.find(item => item.paramName === searchParams.value.electricityTypeTwoName)?.paramDesc
  const mont = monthData.value.find(item => item.paramName === monthVal.value)?.paramDesc
  let title, subtitle = ''
  subtitle = `·${electricityTypeOneName}·${electricityTypeTwoName}·${tariffLevelId}`
  if (choseSpecific.value === 1) {
    title = `${regionName}${mont}代理工商业购电分时电价图`
  } else if (choseSpecific.value === 2) {
    title = `${regionName}代理工商业购电分月电价图`
  } else if (choseSpecific.value === 3) {
    title = `${regionName}代理工商业购电峰谷价差图`
  }
  return { title, subtitle }
})

// 导出图片
function onExportImg() {
  const title = titleText.value.title
  const desc = titleText.value.subtitle
  const _echarts = echarts.getInstanceByDom(document.getElementById('my-echarts-mini'))
  exportCanvas(title, desc, title, _echarts.getDataURL({ type: 'jpeg', backgroundColor: '#fff' }))
  showLoadingToast({
    message: '导出图片中...',
    forbidClick: true,
    loadingType: 'spinner'
  });
}

function handleSelectSpecific(id) {
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
  }
}
// 获取-分时电价
async function getTOUData() {
  try {
    const { data } = await getTimePrice({ ...searchParams.value, years: monthVal.value })
    timeElectricityPriceData.value = data
    choseSpecific.value === 1 && handleTOUData()
  } catch (error) {
    console.error(error)
  }
}
// 获取-分月电价
async function getMonthPriceData() {
  try {
    const { data } = await getMonthPrice({ ...searchParams.value })
    monthElectricityPriceData.value = data
    choseSpecific.value === 2 && handleMonthData();
  } catch (error) {
    console.error(error)
  }
}
// 获取-峰谷价差
async function getMonthDifferenceData() {
  try {
    const { data } = await getMonthDifference({ ...searchParams.value, years: monthVal.value })
    monthPriceDifferenceData.value = data
    choseSpecific.value === 3 && handlePriceDifferenceData();
  } catch (error) {
    console.error(error)
  }
}
/*
  处理图表数据
*/
// 分时电价图
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
    const eachTimePeriod = Array(timeToMinutes(item.endTime) - timeToMinutes(item.startTime)).fill({ ...item, electrovalence: item.electrovalence.toFixed(4) })
    eachTimePeriod.forEach((item, index) => {
      const label = { align: "left", show: true, color: "#1C232F", lineHeight: 22, offset: [0, 4], position: "top" }
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
  _defaultData.forEach(item => {
    if (!item.data.every(item => item.value === '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  // 判断_data的数量调整图表下面的留白空间大小（3为一行，最多5个_defaultData.length）
  if (_data.length > 3) {
    options.grid.bottom = "33%"
  } else if (_data.length <= 3) {
    options.grid.bottom = "25%"
  }
  options.legend.data = _data;
  options.xAxis.data = xAxisData
  options.xAxis.axisLine.lineStyle = { color: '#919DB5' };
  options.xAxis.axisLabel = { ...options.xAxis.axisLabel, rotate: 55 }
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
            <div style='width: 20rem;'>
              ${item.marker}
              <span style="${textStyleMini}">${item.seriesName}</span>
            </div>
            <span style="${textStyleMini}">${item.value}</span>
          </div>`
        }
      })
      const { endTime, startTime } = timeEchartsData.value[index]
      return `<div style="${titleStyleMini}">${startTime}-${endTime}</div>${contentText}`
    }
  };
  clearEchart()
  const myChart = echarts.init(document.getElementById('my-echarts-mini'));
  if (myChart) {
    myChart && myChart.setOption(options)

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
  _defaultData.forEach(item => {
    if (item.data.some(item => item !== '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  // 判断_data的数量调整图表下面的留白空间大小（3为一行，最多5个_defaultData.length）
  if (_data.length > 3) {
    options.grid.bottom = "42%"
  } else if (_data.length <= 3) {
    options.grid.bottom = "32%"
  }
  options.legend.data = _data;
  options.color = _color;
  options.xAxis.data = xAxisData;
  options.xAxis.axisLine.lineStyle = { color: '#919DB5' };
  options.xAxis.axisLabel = { ...options.xAxis.axisLabel, rotate: 55 }
  options.series = (_series);
  options.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let contentText = ''
      params.forEach(item => {
        contentText = item.value === '-' ? contentText : contentText + `<div style="${flexStyle}">
          <div style='width: 20rem;'>
            ${item.marker}
            <span style="${textStyleMini}">${item.seriesName}</span>
          </div>
          <span style="${textStyleMini}">${item.value}</span>
        </div>`
      })
      return `<div style="${titleStyleMini}">${params[0].name}</div>${contentText}`
    }
  };
  clearEchart()
  const myChart = echarts.init(document.getElementById('my-echarts-mini'));
  myChart.setOption(options)

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
  _defaultData.forEach(item => {
    if (item.data.some(item => item !== '-')) {
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
      _color.push(item.lineColor)
      _data.push({ icon: 'roundRect', name: item.name, textStyle: { color: '#5B6985' } })
    }
  })
  const options = cloneDeep(eChartsOption.value)
  // 判断_data的数量调整图表下面的留白空间大小（3为一行，最多5个_defaultData.length）
  if (_data.length > 3) {
    options.grid.bottom = "42%"
  } else if (_data.length <= 3) {
    options.grid.bottom = "32%"
  }
  options.legend.data = _data;
  options.color = _color;
  options.xAxis.data = xAxisData;
  options.xAxis.axisLine.lineStyle = { color: '#919DB5' };
  options.xAxis.axisLabel = { ...options.xAxis.axisLabel, rotate: 55 }
  options.series = (_series);
  options.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let contentText = ''
      params.forEach(item => {
        contentText = item.value === '-' ? contentText : contentText + `<div style="${flexStyle}">
          <div style='width: 20rem;'>
            ${item.marker}
            <span style="${textStyleMini}">${item.seriesName}</span>
          </div>
          <span style="${textStyleMini}">${item.value}</span>
        </div>`
      })
      return `<div style="${titleStyleMini}">${params[0].name}</div>${contentText}`
    }
  };
  clearEchart()
  const myChart = echarts.init(document.getElementById('my-echarts-mini'));
  myChart.setOption(options)

}
function timeToMinutes(time) {
  // 将时间拆分成小时和分钟
  const [hours, minutes] = time.split(':').map(Number);
  // 计算总分钟数
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}
/*
  change
*/
// 地区 change
function changeRegion(val) {
  searchParams.value.regionName = val;
  // // 获取到用电类型1
  const data = regionalData.value.find(item => item.regionName === val)?.reInvestmentElectricityType
  electricityType1.value = data
  searchParams.value.electricityTypeOneName = data[0].paramName
  getElectricityTypeTwo();
}
// 用电类型1 change
function changeElectricityTypeOne(val) {
  searchParams.value.electricityTypeOneName = val;
  getElectricityTypeTwo();
}
// 用电类型2 change
function changeElectricityTypeTwo(val) {
  searchParams.value.electricityTypeTwoName = val;
  const data = electricityType2.value.find(item => item.paramName === val)?.voltageLevel
  voltageLevelData.value = data
  searchParams.value.tariffLevelId = data[0].paramName
  getDischargeStrategyData()
  getElectricityPrice()
}
// 月份 change
function changeMonth(val) {
  monthVal.value = val;
  getTOUData()
}
// 电压等级 change
function changeVoltageLevel(val) {
  searchParams.value.tariffLevelId = val;
  getElectricityPrice()
}
// 清除图表数据
function clearEchart() {
  const myChart = echarts.init(document.getElementById('my-echarts-mini'));
  myChart && myChart?.clear();
  myChart && myChart?.resize();
}
// 获取分时分月电价 峰谷价差
function getElectricityPrice() {
  getMonthPriceData()
  getMonthByTimes()
  getMonthDifferenceData()
}

onMounted(() => {
  onGetRegionalData()
  // 监听窗口大小变化
})
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.priceTracking-body {
  @include box((3.2rem 0 0 0), (0));

  .MB-body {
    @include box(3.2rem, (1.6rem 0 0 0), #FFFFFF);
    border-radius: 0.8rem;

    .MB-body_type {
      @include flex(center, left, nowrap);

      .MB-body_type_item {
        @include widthAndHeight(17.6rem, 6.4rem);
        @include font(2.8rem, 400, rgba(0, 0, 0, 0.6));
        @include box(0, (0 1.6rem 0 0), #F2F3F5, 0.8rem);
        @include flex(center, center, nowrap);
      }

      .active {
        @include font(2.8rem, 400, #FFFFFF);
        @include box(0, (0 1.6rem 0 0), #165DFF, 0.8rem);
      }
    }

    .MB-echarts_title {
      @include margin(4.8rem, 0, 3.2rem, 0);

      .MB-echarts_title_text {
        @include font(2.8rem, 600, rgba(0, 0, 0, 0.9), 4.4rem);
      }

      .MB-echarts_title_subtext {
        @include font(2.8rem, 400, rgba(153, 153, 153, 0.9), 4.4rem);
        @include margin(0.8rem);
      }
    }

    .month-select {
      @include widthAndHeight(100%, 8rem);
      @include flex(center, left, nowrap);
      @include box((1.8rem 1.6rem), (0 0 3.2rem 0), #F2F3F5, 0.8rem);

      .picker {
        @include widthAndHeight(100%);
        @include flex(center, left, nowrap);

        .field-box {
          @include widthAndHeight(100%);
          @include flex(center, left, nowrap);

          .label {
            @include font(2.8rem, 400, rgba(0, 0, 0, 0.6), 4.4rem);
          }

          .value {
            @include font(2.8rem, 400, rgba(0, 0, 0, 0.9), 4.4rem);
            @include margin(0, 2rem, 0, auto)
          }
        }


        img {
          @include widthAndHeight(3rem, 3rem);
        }
      }
    }

    #my-echarts-mini {
      width: 100%;
      height: 50rem;
    }


  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.MB-filter-head {
  @include box(3.2rem, 0rem, #FFFFFF);
  border-radius: 0.8rem;

  .MB-filter-title {
    @include flex(center, left, nowrap);

    img {
      @include widthAndHeight(3.2rem, 3.2rem);
      @include margin(0, 0.8rem);
    }

    p {
      @include font(3.2rem, 600, #000000);
    }
  }

  .MB-filter-line {
    @include widthAndHeight(100%, 0.2rem);
    background-color: #DBDCE2;
    @include margin(3rem, 0, 3.2rem, 0);
  }
}

.export-img {
  @include widthAndHeight(17.6rem, 6.4rem);
  @include font(2.8rem, 400, #FFFFFF, 4.4rem);
  @include box(0, (4rem auto 0 auto), #165DFF, 0.8rem);
  @include flex(center, center, nowrap);
}
</style>
