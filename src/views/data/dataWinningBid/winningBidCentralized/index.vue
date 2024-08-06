<!-- 企业集采入围 -->
<template>
  <div :class="ns.b()">
    <Select
      title="集采入围时间"
      titleWidth="100"
      width="300"
      :options="timeList"
      valueKey="paramValue"
      labelKey="paramDesc"
      :defaultValue="searchParams.time"
      @on-change="handleChange"
    />
    <div :class="ns.b('btns')">
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div :class="ns.b('content')">
      <div
        :class="ns.b('chart')"
        id="eChart-centralized"
        ref="eChartsCentralized"
      />
      <!-- <EmptyData v-else /> -->
    </div>
  </div>
  <ExportCanvasDialog
    :visible="exportVisible"
    :img-url="exportImgUrl"
    :img-title="eChartName"
    @close="exportVisible = false"
  />
</template>

<script setup lang="ts">
import { Ref, ref, computed, onMounted } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
// import { chartWatermark, eChartsOptionCommon } from "@/utils/echarts/eCharts";
import { eChartsOptionCommon } from "@/utils/echarts/eCharts";
const ns = useNamespace("centralized");
const eChartsCentralized: Ref<any> = ref(null); // 柱状图
// const loading: Ref<boolean> = ref(false); // 加载
const exportImgUrl = ref({ png: "", jpg: "" }); // 下载图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开下载图片弹窗
const isEmptyData = ref(false); // 是否无数据
const eChartsOption: Ref<any> = ref(eChartsOptionCommon());
// 查询条件
const searchParams: Ref<any> = ref({
  time: "",
});
const timeList: Ref<Array<any>> = ref([]); // 时间筛选项
const handleChange = (val) => {
  searchParams.value.time = val;
};
const eChartName = computed(() => {
  return `企业集采入围`;
});

// 获取eCharts数据
async function getElectricityTypeOneName() {
  try {
    isEmptyData.value = false;
    eChartsOption.value.title.text = "2024企业集采入围情况";
    (eChartsOption.value.xAxis.data = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ]),
      (eChartsOption.value.yAxis = {
        type: "value",
      }),
      (eChartsOption.value.series = [120, 200, 150, 80, 70, 110, 130]);
    initECharts();
  } catch (error) {
    console.error("渲染图表出错", error);
  }
}
const initECharts = async () => {
  try {
    const myChart = echarts.init(document.getElementById("eChart-centralized"));
    myChart.setOption(eChartsOption.value);
  } catch (error) {
    console.error("渲染图表出错", error);
  }
};
onMounted(() => {
  getElectricityTypeOneName();
});
// 下载图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsCentralized.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportVisible.value = true;
}
</script>

<style lang="scss" scoped>
@import "@/style";
.es-dataBusinessAnalysis-eCharts-box {
  @include widthAndHeight(1152px, 681px);
  @include relative();
}
#eChart-centralized {
  @include widthAndHeight(1152px, 681px);
  margin-top: 32px;
}
.es-centralized-btns {
  margin: 32px 0 16px 0;
  @include flex("center", "flex-start");
  flex-direction: row-reverse;
}
</style>
