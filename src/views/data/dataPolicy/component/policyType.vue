<template>
  <div v-loading="loading" id="eChart_policyType" ref="eChartsDom" />
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { ref, Ref, watch } from "vue";
import { berEChartsOption } from "@/utils/echarts/berECharts";
const eChartsOption: Ref<any> = ref(berEChartsOption());
// 获取eCharts节点
const eChartsDom = ref<any>(null);
const loading: Ref<boolean> = ref(false);

const prop = defineProps({
  data: {
    type: Array,
    default: () => {
      return {};
    },
  },
  year: {
    type: String,
    default: "2022年2月",
  },
});
watch(
  () => prop.data,
  () => {
    if (prop.data?.length) {
      eChartsOption.value.series.data = cloneDeep(
        prop.data.map((item: any) => item.value),
      );
      eChartsOption.value.xAxis.data = cloneDeep(
        prop.data.map((item: any) => item.name),
      );
      eChartsOption.value.graphic[0].style.width =
        eChartsOption.value.graphic[0].style.width * 0.6;
      eChartsOption.value.graphic[0].style.height =
        eChartsOption.value.graphic[0].style.height * 0.6;
      eChartsOption.value.title.text = prop.year + "储能政策类型";
      const match = prop.year.match(/(\d+)年(\d+)月/);
      const month = match ? parseInt(match[2]) : null;
      eChartsOption.value.title.subtext = month + "月储能政策发布级别";
      eChartsOption.value.tooltip = {
        show: true,
        borderColor: "#fff",
        formatter: (params) => {
          if (params.value && params.value > 0) {
            const { data } = params;
            const contentTitle = `font-size: 16px; font-weight: 600; color: #1C232F; margin-bottom:8px; line-height: 24px;`;
            const pStyle = `width: 208px; height: 32px; background: #F4F5F7; display:flex; justify-content:space-between; align-item:center; padding:5px 8px; border-radius: 4px 4px 0 0;`;
            const spanTitle = `font-size: 14px; font-weight: 400; color: #5B6985; ine-height: 22px;`;
            const spanValue = `font-size: 14px; font-weight: 600; color: #1C232F; line-height: 22px;`;
            return `
        <p style='${contentTitle}'>${params.name}</p>
          <p style='${pStyle}'>
            <span style='${spanTitle}'>数量：</span>
            <span style='${spanValue}'>${data}条</span>
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
  const myChart = echarts.init(document.getElementById("eChart_policyType"));
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
    title: eChartsOption.value.title.text,
  };
}
defineExpose({
  exportImg,
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#eChart_policyType {
  @include widthAndHeight(100%, 400px);
  background-size: 60% auto;
}
</style>
