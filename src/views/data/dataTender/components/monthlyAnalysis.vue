<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <span :class="ns.be('top', 'title')">招标内容</span>
        <Select
          v-model="contentDict"
          width="256px"
          :options="contentFilter"
          labelKey="paramDesc"
          valueKey="id"
          :defaultValue="contentDict"
        />
      </div>
      <div :class="ns.be('top', 'right')">
        <span :class="ns.be('top', 'line')" />
        <el-button type="primary" @click="exportResult">下载图片</el-button>
      </div>
    </div>
    <div v-loading="loading" id="eChart_dataMonthlyAnalysis" ref="eChartsDom" />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getBiddingDynamicsListApi } from "@/api/data";
import { eChartsOptionCommon, textStyleObject } from "@/utils/eCharts";
import { cloneDeep } from "lodash";
import { useUserStore } from "@/store/modules/user";
import { nextTick } from "process";
const eChartsOption: Ref<any> = ref(eChartsOptionCommon());
// 获取eCharts节点
const eChartsDom = ref(null);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("dataMonthlyAnalysis");
const loading: Ref<boolean> = ref(false);
const props = defineProps({
  contentFilter: {
    type: Array as () => any[],
    default: () => [],
  },
});
const contentDict: Ref<number> = ref(props.contentFilter[0].id); // 筛选项结果
watch(
  () => contentDict.value,
  () => {
    if (useUserStore().checkPermission("MONTHLY_ANALYSIS_BIDDING")) {
      getElectricityTypeOneName();
    } else {
      nextTick(() => {
        contentDict.value = props.contentFilter[0].id;
      });
    }
  },
);
onMounted(() => {
  getElectricityTypeOneName();
});

// 获取eCharts数据
async function getElectricityTypeOneName() {
  loading.value = true;
  const { datas }: any = await getBiddingDynamicsListApi(contentDict.value);
  eChartsOption.value.title.text = "储能月度招标分析";
  eChartsOption.value.title.subtext = `储能系统`;
  eChartsOption.value.color = ["#165DFF", "#FF7D00"];
  const _y1 = [];
  const _y2 = [];
  datas.map((item) => {
    _y1.push(item.data.powerScale);
    _y2.push(item.data.energyScale);
  });
  const _series = { type: "bar", barWidth: 14 };
  eChartsOption.value.series = [
    Object.assign(cloneDeep(_series), { name: "功率", data: _y1 }),
    Object.assign(cloneDeep(_series), { name: "能量", data: _y2 }),
  ];
  eChartsOption.value.yAxis.name = "MWh";
  eChartsOption.value.xAxis.data = datas.map((item) => item.month);
  const flexStyle = `display: flex; justify-content: space-between; align-items: center;`;
  (eChartsOption.value.tooltip = {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    formatter: (params) => {
      var htmlStr = `<div >
        <div style="line-height:24px; font-width: 400; ${flexStyle}">
          <span style="font-weight: 600; font-size: 16px; color:#000;">${params[0].name}</span>
        </div>
      `;
      params.forEach((item, index) => {
        htmlStr += `
        <div style=" width: 100%; height: 32px; margin-top: 8px; background: #F4F5F7; border-radius: 4px; padding: 0 8px 0 10px; font-weight: 400; ${flexStyle}" >
          <div style="${flexStyle}" >
            <div style=" width: 12px; height: 12px; margin-right: 10px; background-color: ${index === 0 ? "#165DFF" : "#FF7D00"}; border-radius: 2px; " ></div>
            <span style="font-size: 14px; color: #5B6985;">${item.seriesName}</span>
          </div>
          <span style="font-size: 14px; color: #000; font-weight: 600;margin-left: 36px;">
            ${item.value}${item.seriesName === "功率" ? "MW" : "MWh"}
          </span>
        </div>`;
      });
      htmlStr += "</div>";
      return htmlStr;
    },
  }),
    (eChartsOption.value.legend = [
      {
        x: "center",
        y: "95%",
        textStyle: textStyleObject,
      },
    ]);
  loading.value = false;
  createECharts();
}
// 创建图表
function createECharts() {
  const myChart = echarts.init(
    document.getElementById("eChart_dataMonthlyAnalysis"),
  );
  myChart.setOption(eChartsOption.value);
}

// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsDom.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportImgTitle.value = "储能月度招标分析";
  exportVisible.value = true;
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";
#eChart_dataMonthlyAnalysis {
  @include widthAndHeight(1152px, 505px);
  margin-top: 32px;
}
.es-dataMonthlyAnalysis-top {
  @include flex(center, space-between, nowrap);
}
.es-dataMonthlyAnalysis-top__left {
  width: 328px;
  @include flex(center, flex-start, nowrap);
  .es-dataMonthlyAnalysis-top__title {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-right: 16px;
    flex: 1;
  }
}
.es-dataMonthlyAnalysis-top__right {
  @include flex(center, flex-start, nowrap);
  .es-dataMonthlyAnalysis-top__line {
    @include widthAndHeight(1px, 24px);
    display: inline-block;
    background: #dbdce2;
    margin-right: 24px;
  }
}
</style>
