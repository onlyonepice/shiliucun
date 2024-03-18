<template>
  <div>
    <div class="filter">
      <div class="select-p"><span class="select__title">地区</span>
        <el-select :class="searchParams.regionName.length === 1 ? 'no-close-one' : ''" @remove-tag="handelRemoveTag"
          @visible-change="visibleChange" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
          v-model="searchParams.regionName" placeholder="请选择" class="select__content" @change="handleChange">
          <el-option v-for="item in regionalData" :key="item.regionName" :label="item.regionName"
            :value="item.regionName" />
        </el-select>
      </div>
      <Select :options="electricityTypes" :defaultValue="searchParams.electricityTypeOneName" value-key="paramName"
        :label-key="'paramDesc'" title="用电类型 I" @onChange="changeElectricityTypes" />
      <Select :options="voltageLevelData" value-key="paramName" :label-key="'paramDesc'" @onChange="changeVoltageLevel"
        :defaultValue="searchParams.tariffLevelId" title="电压等级" />
      <Select :options="yearData" value-key="paramName" :label-key="'paramDesc'" :defaultValue="searchParams.years"
        @onChange="changeMonth" title="月份选择" />
    </div>
    <div class="flex small-price-type">
      <Select @onChange="changePriceDifference" :defaultValue="searchParams.differencePrice"
        :options="priceDifferenceData" value-key="paramName" :label-key="'paramDesc'" title="峰谷价差" width="30%" />
      <div class="export-image" @click="exportResult">导出图片</div>
    </div>
  </div>
  <div v-loading="loading" id="my-chart_electricity-price-analysis" ref="myeCharts1"></div>
  <ExportCanvasDialog :visible="exportVisible" :img-url="exportImgUrl" :img-title="exportImgTitle"
    @close="exportVisible = false" />
</template>


<script lang="ts" setup>
import { onMounted, computed, Ref, ref } from 'vue'
import Select from '@/components/select.vue'
import * as echarts from 'echarts'
import ExportCanvasDialog from './components/exportCanvasDialog.vue'
import { eChartsOptionCommon } from './data'
import { apiRegionalData, getPeakAndValley, getVoltageLevel, getMonth, getDifferentialRanking } from '@/api/priceTracking'
const eChartsOption: Ref<any> = ref(eChartsOptionCommon)
// 获取echarts节点
const myeCharts1 = ref(null)
// 导出图片相关
const exportImgUrl = ref({ png: '', jpg: '' }) // 导出图片地址
const exportImgTitle: Ref<string> = ref('')
const exportVisible: Ref<boolean> = ref(false) // 是否打开导出图片弹窗
// select option 数据
const regionalData = ref<any>([]) // 城市数据
const priceDifferenceData = ref<any>([]) // 峰谷价差
const voltageLevelData = ref<any>([]) // 电压等级
const yearData = ref<any>([]) // 时间数据
const electricityTypes = ref<any>([])// 用电类型1数组
const loading = ref(false)

// 筛选项搜索结果
const searchParams = ref({
  regionName: [], // 地区
  electricityTypeOneName: '', // 用电类型
  differencePrice: '', // 峰谷价差
  tariffLevelId: '', // 电压等级
  years: ''
})

// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(myeCharts1.value)
  exportImgUrl.value.png = _echarts.getDataURL({ type: 'png' })
  exportImgUrl.value.jpg = _echarts.getDataURL({ type: 'jpeg', backgroundColor: '#fff' })
  exportImgTitle.value = '储能月度招标分析'
  exportVisible.value = true
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
    loading.value = false
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
    loading.value = false
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
    loading.value = false
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
    loading.value = false
  }
}
// 地区change
function handleChange(val: Array<string>) {
  if (val[val.length - 1] === '全国') {
    searchParams.value.regionName = ['全国']
  } else {
    val.indexOf('全国') !== -1 && val.splice(val.indexOf('全国'), 1)
    searchParams.value.regionName = val
  }
  if (val.length === 0) {
    searchParams.value.regionName = ['全国']
  }
}
// 用电类型change
function changeElectricityTypes(val: string) {
  loading.value = true
  searchParams.value.electricityTypeOneName = val
  handelGetVoltageLevel()
}
// 电压等级change
function changeVoltageLevel(val) {
  loading.value = true
  searchParams.value.tariffLevelId = val
  onGetMonth()
}
// 月份change
function changeMonth(val) {
  loading.value = true
  searchParams.value.years = val
  getElectricityTypeOneName()
}
// 峰谷价差change
function changePriceDifference(val) {
  loading.value = true
  searchParams.value.differencePrice = val
  getElectricityTypeOneName()
}
// 当地区选择框关闭时触发
function visibleChange(val) {
  if (!val) {
    loading.value = true
    handelGetVoltageLevel()
  }
}
// 删除tbg时触发
function handelRemoveTag() {
  getElectricityTypeOneName()
  // searchParams.value.differencePrice = ''
}
// 获取差异排名
async function getElectricityTypeOneName() {
  const { data } = await getDifferentialRanking({
    electricityTypeOneName: searchParams.value.electricityTypeOneName,
    differencePrice: searchParams.value.differencePrice,
    tariffLevelId: searchParams.value.tariffLevelId,
    regionName: searchParams.value.regionName,
    years: searchParams.value.years,
  })
  eChartsOption.value.title.text = titleText.value.years + '月各省市代理购电价峰谷价差排名'
  eChartsOption.value.title.subtext = `·${titleText.value.electricityTypeOneName}·${titleText.value.tariffLevelId}·${titleText.value.differencePrice}`
  eChartsOption.value.series.data = data.map(item => item.electrovalenceDifference)
  eChartsOption.value.xAxis.data = data.map(item => item.regionName)
  loading.value = false
  createEcharts()
}
// 创建图表
function createEcharts() {
  if (document.getElementById('my-chart_electricity-price-analysis')) {
    const myChart = echarts.init(document.getElementById('my-chart_electricity-price-analysis'));
    myChart.setOption(eChartsOption.value)
  }
}
onMounted(() => {
  loading.value = true
  // 获取所有数据
  Promise.all([onGetRegionalData(), onGetPeakAndValley()])
})
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

  .select-p {
    @include widthAndHeight(48%, 32px);
    @include flex(center, flex-start);
    @include margin(0, 24px, 16px, 0);

    .select__title {
      @include margin(0, 44px, 0, 0);
      @include margin(0, 44px, 0, 0);
      @include font(14px, 400, #5B6985, 22px);
    }

    .select__content {
      flex: 1;
    }
  }
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

#my-chart_electricity-price-analysis {
  @include widthAndHeight(100%, 418px);
}

::v-deep(.no-close-one) {
  .el-select__tags {

    // padding-right: 9px !important;
    .el-tag__close {
      display: none;
    }
  }

  .el-tag {
    padding-right: 9px !important;
  }
}
</style>
