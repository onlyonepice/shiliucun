<template>
  <div id="eChart_regionAnalysis" ref="eChartsDom" />
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { watch, ref, Ref } from "vue";
import chinaMap from "@/assets/map/china.json";
import { EChartOptions, charsToRemove } from "@/utils/echarts/mapECharts";
const eChartsOption: Ref<any> = ref(EChartOptions());
// 获取eCharts节点
const eChartsDom = ref(null);

const prop = defineProps({
  data: {
    type: Array,
    default: () => {
      return {};
    },
  },
  year: {
    type: String,
    default: "2021年1月",
  },
});

// 获取eCharts数据
async function getElectricityTypeOneName() {
  const { data }: any = prop;
  eChartsOption.value.title.text = prop.year + "储能地区分析";
  eChartsOption.value.title.x = "center";
  // 设置省份标签是否展示
  eChartsOption.value.series[0].label = {
    show: true,
    emphasis: { show: true },
    formatter: (params): any => {
      return isNaN(params.value) ? "" : params.name;
    },
  };
  // 设置省份数据，chinaMap 省份名字需要与后端反的省份一致才展示
  eChartsOption.value.series[0].data = data
    .map((item) => {
      return {
        name: item.name.replace(new RegExp(`[${charsToRemove}]`, "g"), ""),
        value: item.value,
      };
    })
    .concat({
      name: "南海诸岛",
      value: 0,
      itemStyle: { borderColor: "#f3f3f3" },
      emphasis: { disabled: true },
      select: { disabled: true },
    });
  // 添加鼠标移入展示框
  eChartsOption.value.tooltip = {
    show: true,
    borderColor: "#fff",
    formatter: (params) => {
      if (params.value && params.value > 0) {
        const {
          data: { value },
        } = params;
        const contentTitle = `font-size: 16px; font-weight: 600; color: #1C232F; margin-bottom:8px; line-height: 24px;`;
        const pStyle = `width: 208px; height: 32px; background: #F4F5F7; display:flex; justify-content:space-between; align-item:center; padding:5px 8px; border-radius: 4px 4px 0 0;`;
        const spanTitle = `font-size: 14px; font-weight: 400; color: #5B6985; ine-height: 22px;`;
        const spanValue = `font-size: 14px; font-weight: 600; color: #1C232F; line-height: 22px;`;
        return `
        <p style='${contentTitle}'>${params.name}</p>
          <p style='${pStyle}'>
            <span style='${spanTitle}'>数量：</span>
            <span style='${spanValue}'>${value}条</span>
          </p>`;
      } else {
        return "";
      }
    },
  };
  eChartsOption.value.visualMap = {
    type: "piecewise",
    max: 24,
    min: 0,
    show: true,
    inRange: {
      color: [
        "rgba(36, 75, 241, 0.2)",
        "rgba(36, 75, 241, 0.4)",
        "rgba(36, 75, 241, 0.6)",
        "rgba(36, 75, 241, 0.8)",
        "rgba(36, 75, 241, 1)",
      ],
    },
  };
  delete eChartsOption.value.dataRange;
  createECharts();
}

// 创建图表
function createECharts() {
  const _chinaMap = cloneDeep(chinaMap);
  // 处理json的省份数据名字去除一些省市等字符
  _chinaMap.features.forEach((item) => {
    item.properties.name = item.properties.name.replace(
      new RegExp(`[${charsToRemove}]`, "g"),
      "",
    );
  });
  echarts.registerMap("china", { geoJSON: _chinaMap });
  const myChart = echarts.init(
    document.getElementById("eChart_regionAnalysis"),
  );
  // 地图鼠标移入，没有数据不高亮显示
  myChart.on("mouseover", (params): any => {
    if (params.data === undefined) {
      myChart.dispatchAction({
        type: "downplay",
      });
    }
  });

  myChart.setOption(eChartsOption.value);
}

watch(
  () => prop.data,
  () => {
    getElectricityTypeOneName();
  },
  { deep: true },
);
function exportImg() {
  const _echarts = echarts.getInstanceByDom(eChartsDom.value);
  return {
    png: _echarts.getDataURL({ type: "png" }),
    jpg: _echarts.getDataURL({
      type: "jpeg",
      backgroundColor: "#fff",
    }),
    title: eChartsOption.value.title.text,
  };
}
defineExpose({
  exportImg,
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#eChart_regionAnalysis {
  @include widthAndHeight(100%, 800px);
  margin-top: 32px;
}
</style>
