<template>
  <div :class="ns.b()">
    <div :class="ns.b('content')">
      <div id="policyAnalysis" />
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import { cloneDeep } from "lodash";
import { onMounted, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import chinaMap from "@/assets/map/china.json";
import { EChartOptions, charsToRemove } from "@/utils/echarts/mapECharts";
const myChart = ref(null);
const ns = useNamespace("policyAnalysis");
const eChartsOption: any = ref({ ...EChartOptions() });

function getData() {
  const _chinaMap = cloneDeep(chinaMap);
  // 处理json的省份数据名字去除一些省市等字符
  _chinaMap.features.forEach((item) => {
    item.properties.name = item.properties.name.replace(
      new RegExp(`[${charsToRemove}]`, "g"),
      "",
    );
  });

  echarts.registerMap("china", { geoJSON: _chinaMap });

  myChart.value = echarts.init(document.getElementById("policyAnalysis"));

  eChartsOption.value.series[0].zoom = 1.2;
  eChartsOption.value.grid = null;
  myChart.value.on("mouseover", (params): any => {
    if (params.data === undefined) {
      myChart.value.dispatchAction({
        type: "downplay",
      });
    }
  });
  eChartsOption.value.series[0].label = {
    show: true,
    emphasis: { show: true },
    formatter: (params): any => {
      return isNaN(params.value) ? "" : params.name;
    },
  };
  eChartsOption.value.tooltip = {
    borderColor: "#fff",
    formatter: (params) => {
      if (params.value && params.value > 0) {
        const contentTitle = `font-size: 16px; font-weight: 600; color: #1C232F; margin-bottom:8px; line-height: 24px;`;
        const pStyle = `width: 208px; height: 32px; background: #F4F5F7; display:flex; justify-content:space-between; align-item:center; padding:5px 8px; border-radius: 4px 4px 0 0;`;
        const spanTitle = `font-size: 14px; font-weight: 400; color: #5B6985; ine-height: 22px;`;
        const spanValue = `font-size: 14px; font-weight: 600; color: #1C232F; line-height: 22px;`;
        return `
        <p style='${contentTitle}'>${params.name}</p>
          <p style='${pStyle}'>
            <span style='${spanTitle}'>能量</span>
            <span style='${spanValue}'>***</span>
          </p>
          <p style='=${pStyle}'>
            <span style='style='${spanTitle}''>功率</span>
            <span style='${spanValue}'>***</span>
          </p>`;
      } else {
        return "";
      }
    },
  };
  console.log(eChartsOption.value);
  myChart.value.setOption(eChartsOption.value);
}

onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>
.es-policyAnalysis {
  .es-policyAnalysis-content {
    margin-top: 9px;

    #policyAnalysis {
      width: 100%;
      height: 800px;
      background: #000;
      border: 1px solid rgb(255, 0, 0);
    }
  }
}
</style>
