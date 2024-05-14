<template>
  <div id="eChart_policyLevel" class="ECharts-el" ref="eChartsDom" />
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { ref, Ref, watch } from "vue";
import {
  treemapEChartsOption,
  EChartColor,
} from "@/utils/echarts/treemapECharts";
const eChartsOption: Ref<any> = ref(treemapEChartsOption());
// 获取eCharts节点
const eChartsDom = ref<any>(null);

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
watch(
  () => prop.data,
  () => {
    if (prop.data?.length) {
      eChartsOption.value.series[0].data = cloneDeep(prop.data);
      eChartsOption.value.series[0].data.forEach((item: any, index: number) => {
        item.itemStyle = { color: EChartColor[index] };
      });
      eChartsOption.value.title.text = prop.year + "储能政策发布级别";
      const match = prop.year.match(/(\d+)年(\d+)月/);
      const month = match ? parseInt(match[2]) : null;
      eChartsOption.value.title.subtext = month + "月储能政策发布级别";
      eChartsOption.value.series[1].data = cloneDeep(prop.data);
      eChartsOption.value.label = {
        formatter: (params: any) => {
          return params.value + "条";
        },
      };
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
      createECharts();
    }
  },
  { deep: true },
);
// 创建图表
function createECharts() {
  const myChart = echarts.init(document.getElementById("eChart_policyLevel"));
  myChart.on("legendselectchanged", function (params: any) {
    eChartsOption.value.series[0].data.forEach((item: any) => {
      item.value = params.selected[item.name]
        ? prop.data.find((_item: any) => item.name === _item.name).value
        : 0;
    });
    myChart.setOption(eChartsOption.value);
  });
  myChart.setOption(eChartsOption.value);
}
function exportImg() {
  const _echarts = echarts.getInstanceByDom(eChartsDom.value);
  return {
    png: _echarts.getDataURL({ type: "png" }),
    jpg: _echarts.getDataURL({
      type: "jpeg",
      backgroundColor: "#fff",
    }),
  };
}
defineExpose({
  exportImg,
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#eChart_policyLevel {
  @include widthAndHeight(100%, 400px);
  background-size: 60% auto;
}
</style>
