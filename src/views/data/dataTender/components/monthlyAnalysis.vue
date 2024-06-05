<!-- 招标月度分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <Select
          v-model="contentDict"
          :options="contentFilter"
          labelKey="paramDesc"
          valueKey="id"
          title="招标内容"
          :defaultValue="contentDict"
        />
      </div>
      <div :class="ns.be('top', 'right')">
        <span :class="ns.be('top', 'line')" />
        <el-button type="primary" @click="exportResult">下载图片</el-button>
      </div>
    </div>
    <div v-if="!isEmptyData" class="echarts-box">
      <div
        v-loading="loading"
        id="eChart_dataMonthlyAnalysis"
        ref="eChartsDom"
      />
      <div
        class="echarts-mask animate__animated animate__fadeIn"
        v-if="echartsMask"
      >
        <h4>开通企业VIP查看完整数据</h4>
        <el-button type="primary" @click="router.push('/vip')"
          >立即开通</el-button
        >
      </div>
    </div>

    <EmptyData v-else />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      :maskSize="{ width: 142, height: 203, show: true }"
      @close="exportVisible = false"
    />
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch, nextTick } from "vue";
import { getToken } from "@/utils/auth";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getBiddingDynamicsListApi, maskPermissions } from "@/api/data";
import { eChartsOptionCommon, textStyleObject } from "@/utils/echarts/eCharts";
import { cloneDeep } from "lodash";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const { VITE_DATABASE_URL } = import.meta.env;
const eChartsOption: Ref<any> = ref(eChartsOptionCommon());
// 获取eCharts节点
const eChartsDom = ref(null);
const isEmptyData = ref(false);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("dataMonthlyAnalysis");
const loading: Ref<boolean> = ref(false);
const echartsMask: Ref<boolean> = ref(false); // echarts蒙层
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
// 获取 eCharts 数据
async function getElectricityTypeOneName() {
  loading.value = false;
  isEmptyData.value = false;
  const { datas }: any = await getBiddingDynamicsListApi(contentDict.value);
  if (datas.length === 0) {
    loading.value = false;
    isEmptyData.value = true;
    return;
  }

  eChartsOption.value.title.text = "储能月度招标分析";
  eChartsOption.value.title.subtext = `储能系统`;
  eChartsOption.value.color = ["#244BF1", "#34BCF4"];
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
            <div style=" width: 12px; height: 12px; margin-right: 10px; background-color: ${index === 0 ? "#244BF1" : "#34BCF4"}; border-radius: 2px; " ></div>
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
  if (getToken()) {
    const res = await maskPermissions({ moduleName: "招标月度分析" });
    echartsMask.value = res.datas.isCovered;
  }
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

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.echarts-box {
  @include widthAndHeight(1152px, 505px);
  @include relative();
}
#eChart_dataMonthlyAnalysis {
  @include widthAndHeight(1152px, 505px);
  margin-top: 32px;
}
.echarts-mask {
  @include widthAndHeight(274px, 455px);
  @include absolute(1, none, 34px, 50px, none);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(25px);
  text-align: center;
  h4 {
    margin-top: 180px;
    margin-bottom: 14px;
  }
}
.es-dataMonthlyAnalysis-top {
  @include flex(center, space-between, nowrap);
}
.es-dataMonthlyAnalysis-top__left {
  width: 80%;
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
