<template>
  <div class="investment-eCharts">
    <div id="my-chart" ref="eCharts"></div>
    <div class="slider-wrapper">
      <div class="slider-wrapper__title">
        <span>峰谷价差</span>
        <span @click="handleResetSlider">重置参数</span>
      </div>
      <div class="slider-wrapper__desc">
        <img :src="TipsIcon" alt="">
        <p>拖动滑块调整电价查看不同峰谷价差情况下的收益</p>
      </div>
      <div v-for="item in slider" :key="item.id" class="slider-wrapper__content" >
        <div v-if="item.show">
          <div class="wrapper__text">
            <span>{{ getNewDate }}{{item.name}}</span>
            <span :class="{ 'special-color': getElectricityPrice(item.key) < 0 }">{{getElectricityPrice(item.key) < 0 ? '' : '+'}}{{ getElectricityPrice(item.key) }}</span>
          </div>
          <div class="wrapper__content">
            <el-slider v-model="item.value" :min="item.min" :max="item.max" @change="(val) => handleSliderChange(val, item.id,item.key )"
            ></el-slider>
            <Select type="input" specialType="number" width="111px" inputText="元" :defaultValue="defaultElectricityPrice[item.key]" @onChange="$event => { onChange($event,item.id,item.key) }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { ref, Ref, onMounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts/lib/chart/line'
import { eChartsOptionCommon, computedColor, titleStyle, textStyle, flexStyle } from '@/utils/eCharts'
import TipsIcon from '@/assets/img/iReport-tips-icon.png'
import Select from '@/components/select.vue'
import { apiCanvasData, apiSliderConfig } from '@/api/investment'
const emit = defineEmits(['onSearch'])
const props = defineProps({
  searchParams: {
    type: Object,
    default: () => {}
  },
  searchCanvas: {
    type: Boolean,
    default: false
  }
})
const eChartsOption: Ref<any> = ref(cloneDeep(eChartsOptionCommon))
// 滑块配置
const slider: Ref<any> = ref([
  { id: 0, name: '尖峰电价', show: false, key: 'topTime', value: 0, min: -100, max: 100, minNumber: -100, maxNumber: 100, minValue: 0, maxValue: 0, step: 1, range: true },
  { id: 1, name: '高峰电价', show: false, key: 'highTime', value: 0, min: -100, max: 100, minNumber: -100, maxNumber: 100, minValue: 0, maxValue: 0, step: 1, range: true },
  { id: 2, name: '平时电价', show: false, key: 'flatTime', value: 0, min: -100, max: 100, minNumber: -100, maxNumber: 100, minValue: 0, maxValue: 0, step: 1, range: true },
  { id: 3, name: '低谷电价', show: false, key: 'lowTime', value: 0, min: -100, max: 100, minNumber: -100, maxNumber: 100, minValue: 0, maxValue: 0, step: 1, range: true }
])
const echartsConfig = ref([
  { name: '尖峰低谷价差', lineColor: 'rgba(245,63,63,1)', data: [] },
  { name: '高峰低谷价差', lineColor: 'rgba(255,125,0,1)', data: [] },
  { name: '尖峰平时价差', lineColor: 'rgba(255,207,29,1)', data: [] },
  { name: '高峰平时价差', lineColor: 'rgba(80,177,66,1)', data: [] }
])
const defaultElectricityPriceFreeze = ref({}) // 初始电价
const defaultElectricityPrice = ref({}) // 默认电价，用来存储输入框中的值

// 获取最新的日期
const getNewDate = computed(()=>{
  return `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
})
const getElectricityPrice = computed(()=>(key:string)=>{
  return Number((defaultElectricityPrice.value[key] - defaultElectricityPriceFreeze.value[key]).toFixed(4))
})

// 修改电价
function onChange(data:string,id:number,key:string){
  if( Number(data) < slider.value[id].minValue ){
    defaultElectricityPrice.value[key] = slider.value[id].minValue
    slider.value[id].value = slider.value[id].minNumber
  }else if( Number(data) > slider.value[id].maxValue ){
    defaultElectricityPrice.value[key] = slider.value[id].maxValue
    slider.value[id].value = slider.value[id].maxNumber
  }else{
    defaultElectricityPrice.value[key] = Number(data)
    slider.value[id].value = ( defaultElectricityPrice.value[key] - defaultElectricityPriceFreeze.value[key] ) / defaultElectricityPriceFreeze.value[key] * 100
  }
  const _slider = slider.value
  emit('onSearch',Object.assign(props.searchParams,{ topThan: _slider[0].value, highThan: _slider[1].value, flatThan: _slider[2].value, lowThan: _slider[3].value  }))
}
// 重置参数
function handleResetSlider(){
  slider.value.forEach(item=>{
    item.value = 0
  })
  defaultElectricityPrice.value = {
    topTime: defaultElectricityPriceFreeze.value.topTime,
    highTime: defaultElectricityPriceFreeze.value.highTime,
    flatTime: defaultElectricityPriceFreeze.value.flatTime,
    lowTime: defaultElectricityPriceFreeze.value.lowTime
  }
  const _slider = slider.value
  emit('onSearch',Object.assign(props.searchParams,{ topThan: _slider[0].value, highThan: _slider[1].value, flatThan: _slider[2].value, lowThan: _slider[3].value  }))
}
// 滑块发生变化
function handleSliderChange(val:number,id:number,key:string){
  const _data = slider.value[id]
  if( val < _data.minNumber ){
    _data.value = _data.minNumber
  }else if( val > _data.maxNumber ){
    _data.value = _data.maxNumber
  }else{
    _data.value = val
  }
  defaultElectricityPrice.value[key] = Number((defaultElectricityPriceFreeze.value[key] + (defaultElectricityPriceFreeze.value[key] * ( _data.value / 100 ))).toFixed(4))
  const _slider = slider.value
  emit('onSearch',Object.assign(props.searchParams,{ topThan: _slider[0].value, highThan: _slider[1].value, flatThan: _slider[2].value, lowThan: _slider[3].value  }))
}

// 重置图表
function resetCanvas(){
  eChartsOption.value.xAxis.data = []
  echartsConfig.value.forEach(item=>{
    item.data = []
  })
}
// 页面缩放
function onHandleResize(){
  let _open = true
  setTimeout(()=>{
    if( _open ){
      const myChart = echarts.init(document.getElementById('my-chart'));
      myChart.resize();
      _open = true
    }
    _open = false;
  },1000)
}
// 获取初始值

// 获取图表数据
async function getCanvasData(type=true){
  const myChart = echarts.init(document.getElementById('my-chart'));
  myChart.clear()
  resetCanvas()
  const _data = { topThan: slider.value[0].value, highThan: slider.value[1].value, flatTime: slider.value[2].value, lowThan: slider.value[3].value }
  const res:any = await apiCanvasData(Object.assign(props.searchParams,_data))
  if( type ){
    const _finallyMonthElectronically = res.data.finallyMonthElectronically
    for (const key in res.data.finallyMonthElectronically) {
      _finallyMonthElectronically[key] = Number(_finallyMonthElectronically[key].toFixed(4))
    }
    defaultElectricityPrice.value = JSON.parse(JSON.stringify(_finallyMonthElectronically))
    defaultElectricityPriceFreeze.value = JSON.parse(JSON.stringify(_finallyMonthElectronically))
  }else{
    res.data.monthlySpreadData.forEach(item => {
      eChartsOption.value.xAxis.data.push(item.month)
      echartsConfig.value[0].data.push({value: item.data.sharpDifference})
      echartsConfig.value[1].data.push({value: item.data.heightDifference})
      echartsConfig.value[2].data.push({value: item.data.sharpAdjustment})
      echartsConfig.value[3].data.push({value: item.data.altitudeBalance})
    })
    let _series = []
    echartsConfig.value.forEach(item=>{
      _series.push({ type: 'line', name: item.name, data: item.data, areaStyle: { color: computedColor(item.lineColor) } })
    })
    eChartsOption.value.series = (_series);
    myChart.setOption(eChartsOption.value)
  }
  // 获取滑块配置
  getSliderConfig()
}

// 获取滑块配置
async function getSliderConfig(){
  const res:any = await apiSliderConfig(props.searchParams)
  const _freeze = defaultElectricityPriceFreeze.value
  res.data.forEach(item=>{
    slider.value.forEach(_item=>{
      if (_item.key === item.bucketType) {
        _item.show = true
        _item.minNumber = item.min || -100
        _item.maxNumber = item.max || 100
        _item.minValue = Number((_freeze[_item.key] + (_freeze[_item.key] * ( item.min / 100 ))).toFixed(4))
        _item.maxValue = Number((_freeze[_item.key] + (_freeze[_item.key] * ( item.max / 100 ))).toFixed(4))
      }
    })
  })
}

onMounted(()=>{
  window.addEventListener('resize', onHandleResize);
  const _defaultData = echartsConfig.value
  eChartsOption.value.title.text = `代理工商业购电分月电价图`;
  let _color = []
  let _data = []
  _defaultData.forEach(item=>{
    _color.push(item.lineColor)
    _data.push({ icon: 'roundRect', name: item.name, textStyle:{ color: '#5B6985' } })
  })
  eChartsOption.value.legend.data = _data;
  eChartsOption.value.color = _color;
  eChartsOption.value.tooltip = {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: params => {
      let contentText = ''
      params.forEach(item => {
        contentText = contentText + `<div style="${flexStyle}">
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
  const myChart = echarts.init(document.getElementById('my-chart'));
  myChart.setOption(eChartsOption.value)
  getCanvasData(true)
});


/* eslint-disable */
defineExpose({ getCanvasData })
/* eslint-enable */

</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.investment-eCharts{
  @include flex(center,space-between,no-wrap)
}
#my-chart{
  width: 76% !important;
  height: 402px;
  min-width: 480px;
}
.slider-wrapper{
  @include widthAndHeight(24%,402px);
  @include padding(0,0,0,17px);
  // @include flex();
  box-sizing: border-box;
  min-width: 200px;
}
.slider-wrapper__content{
  @include margin(0,0,4px,0);
}
.slider-wrapper__title{
  @include flex(center,space-between);
  @include widthAndHeight(100%,22px);
  span:nth-of-type(1){
    @include font(14px,600,#1D232E,22px);
  }
  span:nth-of-type(2){
    @include font(12px,400,#165DFF,22px);
    cursor: pointer;
  }
}
.slider-wrapper__desc{
  @include flex(flex-start,center,no-wrap);
  @include font(12px,400,#5B6985,20px);
  @include margin(0,0,8px,0);
  img{
    @include widthAndHeight(16px,16px);
    @include margin(2px,4px,0,0);
  }
  span{
    @include font(12px,400,#5B6985,20px);
  }
}
.wrapper__text{
  @include flex(center,space-between);
  @include margin(0,0,8px,0);
  span:nth-of-type(1){
    @include font(14px,400,#5B6985,22px);
  }
  span:nth-of-type(2){
    @include font(14px,600,green,22px);
  }
  .special-color{
    color: #F53F3F !important;
  }
}
.wrapper__content{
  @include flex(center,space-between,no-wrap);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.slider-wrapper{
  .el-slider{
    @include widthAndHeight(120px,32px);
    @include margin(0,8px,0,0);
  }
  .select{
    width: 111px;
    margin: 0 0 0 0 !important;
    flex: 1;
  }
  .el-slider__runway{
    height: 2px;
  }
  .el-slider__bar{
    height: 2px;
    background-color: #165DFF;
  }
  .el-slider__button{
    @include widthAndHeight(16px,16px);
    @include margin(-4px,0,0,0);
    border: 2px solid #165DFF;
  }
}
</style>
