<template>
  <div class="common-title common-title-margin">峰谷价差</div>
  <div class="investment-eCharts">
    <div id="my-chart" ref="eCharts" />
    <div class="slider-wrapper">
      <div class="slider-wrapper__desc">
        <img :src="TipsIcon" alt="" />
        <p>拖动滑块调整电价查看不同峰谷价差情况下的收益</p>
      </div>
      <div class="slider-wrapper__title">
        <span>峰谷价差</span>
        <span @click="handleResetSlider">重置参数</span>
      </div>
      <div
        v-for="item in slider"
        :key="item.id"
        class="slider-wrapper__content"
      >
        <div v-if="item.show">
          <div class="wrapper__text">
            <span>{{ getNewDate }}{{ item.name }}</span>
            <span
              >{{ getElectricityPrice(item.key) < 0 ? "-" : ""
              }}{{ slider[item.id].value }}%</span
            >
          </div>
          <el-slider
            v-model="item.value"
            :min="item.min"
            :max="item.max"
            @change="(val) => handleSliderChange(val, item.id, item.key)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, defineProps, computed, defineEmits } from "vue";
import * as echarts from "echarts";
import "echarts/lib/chart/line";
import {
  eChartsOptionCommon,
  computedColor,
  titleStyle,
  textStyle,
  flexStyle,
} from "@/utils/echarts/eCharts";
import TipsIcon from "@/assets/img/common/lament_icon.png";
import { apiCanvasData, apiSliderConfig } from "@/api/investment";
const emit = defineEmits(["onSearch"]);
const props = defineProps({
  searchParams: {
    type: Object,
    default: () => {},
  },
  searchCanvas: {
    type: Boolean,
    default: false,
  },
  searchParamsShow: {
    type: Object,
    default: () => {},
  },
});
const eChartsOption: Ref<any> = ref(eChartsOptionCommon());
// 滑块配置
const slider: Ref<any> = ref([
  {
    id: 0,
    name: "尖峰电价",
    show: false,
    key: "topTime",
    value: 0,
    min: -100,
    max: 100,
    minNumber: -100,
    maxNumber: 100,
    minValue: 0,
    maxValue: 0,
    step: 1,
    range: true,
  },
  {
    id: 1,
    name: "高峰电价",
    show: false,
    key: "highTime",
    value: 0,
    min: -100,
    max: 100,
    minNumber: -100,
    maxNumber: 100,
    minValue: 0,
    maxValue: 0,
    step: 1,
    range: true,
  },
  {
    id: 2,
    name: "平时电价",
    show: false,
    key: "flatTime",
    value: 0,
    min: -100,
    max: 100,
    minNumber: -100,
    maxNumber: 100,
    minValue: 0,
    maxValue: 0,
    step: 1,
    range: true,
  },
  {
    id: 3,
    name: "低谷电价",
    show: false,
    key: "lowTime",
    value: 0,
    min: -100,
    max: 100,
    minNumber: -100,
    maxNumber: 100,
    minValue: 0,
    maxValue: 0,
    step: 1,
    range: true,
  },
]);
const echartsConfig = ref([
  { name: "尖峰低谷价差", lineColor: "rgba(245,63,63,1)", data: [] },
  { name: "高峰低谷价差", lineColor: "rgba(255,125,0,1)", data: [] },
  { name: "尖峰平时价差", lineColor: "rgba(255,207,29,1)", data: [] },
  { name: "高峰平时价差", lineColor: "rgba(80,177,66,1)", data: [] },
]);
const defaultElectricityPriceFreeze = ref({}); // 初始电价
const defaultElectricityPrice = ref({}); // 默认电价，用来存储输入框中的值

// 获取最新的日期
const getNewDate = computed(() => {
  return `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`;
});
const getElectricityPrice = computed(() => (key: string) => {
  return Number(
    (
      defaultElectricityPrice.value[key] -
      defaultElectricityPriceFreeze.value[key]
    ).toFixed(4),
  );
});
// 重置参数
function handleResetSlider() {
  slider.value.forEach((item) => {
    item.value = 0;
  });
  defaultElectricityPrice.value = {
    topTime: defaultElectricityPriceFreeze.value.topTime,
    highTime: defaultElectricityPriceFreeze.value.highTime,
    flatTime: defaultElectricityPriceFreeze.value.flatTime,
    lowTime: defaultElectricityPriceFreeze.value.lowTime,
  };
  const _slider = slider.value;
  emit(
    "onSearch",
    Object.assign(props.searchParams, {
      topThan: _slider[0].value,
      highThan: _slider[1].value,
      flatThan: _slider[2].value,
      lowThan: _slider[3].value,
    }),
  );
}
// 滑块发生变化
function handleSliderChange(val: number, id: number) {
  const _data = slider.value[id];
  if (val < _data.minNumber) {
    _data.value = _data.minNumber;
  } else if (val > _data.maxNumber) {
    _data.value = _data.maxNumber;
  } else {
    _data.value = val;
  }
  const _slider = slider.value;
  emit(
    "onSearch",
    Object.assign(props.searchParams, {
      topThan: _slider[0].value,
      highThan: _slider[1].value,
      flatThan: _slider[2].value,
      lowThan: _slider[3].value,
    }),
  );
}

// 重置图表
function resetCanvas() {
  eChartsOption.value.xAxis.data = [];
  echartsConfig.value.forEach((item) => {
    item.data = [];
  });
}
// 页面缩放
function onHandleResize() {
  let _open = true;
  setTimeout(() => {
    if (_open) {
      const myChart = echarts.init(document.getElementById("my-chart"));
      myChart.resize();
      _open = true;
    }
    _open = false;
  }, 1000);
}
// 获取初始值

// 获取图表数据
async function getCanvasData() {
  const myChart = echarts.init(document.getElementById("my-chart"));
  myChart.clear();
  resetCanvas();
  const _data = {
    topThan: slider.value[0].value,
    highThan: slider.value[1].value,
    flatTime: slider.value[2].value,
    lowThan: slider.value[3].value,
  };
  const { datas, resp_code }: any = await apiCanvasData(
    Object.assign(props.searchParams, _data),
  );
  if (resp_code === 0) {
    datas.forEach((item) => {
      eChartsOption.value.xAxis.data.push(item.month);
      echartsConfig.value[0].data.push({ value: item.data.sharpDifference });
      echartsConfig.value[1].data.push({ value: item.data.heightDifference });
      echartsConfig.value[2].data.push({ value: item.data.sharpAdjustment });
      echartsConfig.value[3].data.push({ value: item.data.altitudeBalance });
    });
    let _series = [];
    echartsConfig.value.forEach((item) => {
      _series.push({
        type: "line",
        name: item.name,
        data: item.data,
        areaStyle: { color: computedColor(item.lineColor) },
      });
    });
    eChartsOption.value.series = _series;
    myChart.setOption(eChartsOption.value);
  }
}

// 获取滑块配置
async function getSliderConfig() {
  const { datas, resp_code }: any = await apiSliderConfig(props.searchParams);
  if (resp_code === 0) {
    datas.forEach((item) => {
      slider.value.forEach((_item: any) => {
        if (_item.key === item.bucketType) {
          _item.show = true;
          _item.minNumber = item.min || -100;
          _item.maxNumber = item.max || 100;
        }
      });
    });
  }
}

onMounted(() => {
  window.addEventListener("resize", onHandleResize);
  const _defaultData = echartsConfig.value;
  const {
    regionName,
    electricityTypeOneName,
    tariffLevelId,
    electricityTypeTwoName,
  } = props.searchParamsShow;
  eChartsOption.value.title.text = `${regionName}·${electricityTypeOneName}·${tariffLevelId}·${electricityTypeTwoName}·代理工商业代理购电分月价差图`;
  let _color = [];
  let _data = [];
  _defaultData.forEach((item) => {
    _color.push(item.lineColor);
    _data.push({
      icon: "roundRect",
      name: item.name,
      textStyle: { color: "#5B6985" },
    });
  });
  eChartsOption.value.legend.data = _data;
  eChartsOption.value.color = _color;
  eChartsOption.value.tooltip = {
    trigger: "axis",
    axisPointer: { type: "line" },
    formatter: (params) => {
      let contentText = "";
      params.forEach((item) => {
        contentText =
          contentText +
          `<div style="${flexStyle}">
          <div style='width: 150px;'>
            ${item.marker}
            <span style="${textStyle}">${item.seriesName}</span>
          </div>
          <span style="${textStyle}">${item.value}</span>
        </div>`;
      });
      return `<div style="${titleStyle}">${params[0].name}</div>${contentText}`;
    },
  };
  const myChart = echarts.init(document.getElementById("my-chart"));
  myChart.setOption(eChartsOption.value);
});

/* eslint-disable */
defineExpose({ getCanvasData, getSliderConfig });
/* eslint-enable */
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.investment-eCharts {
  @include flex(center, space-between, no-wrap);
}

#my-chart {
  width: 76% !important;
  height: 448px;
  min-width: 480px;
}

.slider-wrapper {
  @include widthAndHeight(24%, 448px);
  @include padding(0, 0, 0, 17px);
  box-sizing: border-box;
  min-width: 200px;
}

.slider-wrapper__content {
  width: 100%;
  @include margin(0, 0, 4px, 0);
}

.slider-wrapper__title {
  @include flex(center, space-between);
  @include widthAndHeight(100%, 22px);

  span:nth-of-type(1) {
    @include font(14px, 600, #1d232e, 22px);
  }

  span:nth-of-type(2) {
    @include font(12px, 400, #165dff, 22px);
    cursor: pointer;
  }
}

.slider-wrapper__desc {
  @include flex(flex-start, center, no-wrap);
  @include font(12px, 400, #5b6985, 20px);
  @include margin(0, 0, 8px, 0);
  @include padding(6px, 8px, 6px, 8px);
  background: #eff4ff;
  border-radius: 4px;

  img {
    @include widthAndHeight(16px, 16px);
    @include margin(2px, 4px, 0, 0);
  }

  span {
    @include font(12px, 400, #5b6985, 20px);
  }
}

.wrapper__text {
  @include flex(center, space-between);
  @include margin(0, 0, 8px, 0);

  span {
    @include font(14px, 400, #5b6985, 22px);
  }
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
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.slider-wrapper {
  .el-slider {
    @include widthAndHeight(100%, 32px);
    @include margin(0, 8px, 0, 0);
  }

  .select {
    width: 111px;
    margin: 0 0 0 0 !important;
    flex: 1;
  }

  .el-slider__runway {
    height: 2px;
  }

  .el-slider__bar {
    height: 2px;
    background-color: #165dff;
  }

  .el-slider__button {
    @include widthAndHeight(16px, 16px);
    @include margin(-4px, 0, 0, 0);
    border: 2px solid #165dff;
  }
}
</style>
