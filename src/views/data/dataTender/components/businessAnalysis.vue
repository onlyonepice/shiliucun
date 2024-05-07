<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <div>
          <span :class="ns.be('top', 'title')">招标内容</span>
          <Select
            width="256px"
            :options="contentFilter"
            labelKey="paramDesc"
            valueKey="id"
            @onChange="
              (val) => {
                return onChangeFilter(val, 'contentDict');
              }
            "
            :defaultValue="contentDict"
          />
        </div>
        <div>
          <span :class="ns.be('top', 'title')">发布日期</span>
          <Select
            width="256px"
            :options="timeFilter"
            labelKey="paramDesc"
            valueKey="paramValue"
            @onChange="
              (val) => {
                return onChangeFilter(val, 'releaseTime');
              }
            "
            :defaultValue="releaseTime"
          />
        </div>
      </div>
      <div :class="ns.be('top', 'right')">
        <span :class="ns.be('top', 'line')" />
        <el-button type="primary" @click="exportResult">下载图片</el-button>
      </div>
    </div>
    <div
      v-if="!isEmptyData"
      v-loading="loading"
      id="eChart_businessAnalysis"
      ref="eChartsDom"
    />
    <EmptyData v-else />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, nextTick } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getBusinessDynamicsListApi } from "@/api/data";
import { eChartsOptionCommon, textStyleObject } from "@/utils/echarts/eCharts";
import { cloneDeep } from "lodash";
import { useUserStore } from "@/store/modules/user";
const eChartsOption: Ref<any> = ref(eChartsOptionCommon());
// 获取eCharts节点
const eChartsDom = ref(null);
const isEmptyData = ref(false);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("dataBusinessAnalysis");
const loading: Ref<boolean> = ref(false);
const props = defineProps({
  contentFilter: {
    type: Array as () => any[],
    default: () => [],
  },
  timeFilter: {
    type: Array as () => any[],
    default: () => [],
  },
});
const contentDict: Ref<string | number> = ref(props.contentFilter[0].id); // 筛选项结果
const releaseTime: Ref<string | number> = ref("");
onMounted(() => {
  getElectricityTypeOneName();
});
const getReleaseTime = () => {
  const _data = props.timeFilter.filter((item) => {
    return item.defaultValue;
  });
  releaseTime.value = _data[0].paramValue;
};
getReleaseTime();
// 招标内容筛选项改变
const onChangeFilter = (id: string | number, type: string) => {
  type === "contentDict" ? (contentDict.value = id) : (releaseTime.value = id);
  if (useUserStore().checkPermission("ANALYSIS_BIDDING_ENTERPRISES")) {
    getElectricityTypeOneName();
  } else {
    nextTick(() => {
      contentDict.value = props.contentFilter[0].id;
      const _data = props.timeFilter.filter((item) => {
        return item.defaultValue;
      });
      releaseTime.value = _data[0].paramValue;
    });
  }
};

// 获取eCharts数据
async function getElectricityTypeOneName() {
  loading.value = true;
  isEmptyData.value = false;
  const { datas, resp_code }: any = await getBusinessDynamicsListApi({
    contentDict: contentDict.value,
    releaseTime: releaseTime.value,
  });
  if (datas.length && resp_code === 0) {
    const _data = datas.slice(0, 20);
    eChartsOption.value.title.text = releaseTime.value + "储能招标企业分析";
    eChartsOption.value.title.subtext = `储能系统`;
    eChartsOption.value.color = ["#165DFF", "#FF7D00"];
    eChartsOption.value.grid = {
      top: "15%",
      left: "50",
      right: "3%",
      bottom: "20%",
    };
    const _y1 = [];
    const _y2 = [];
    _data.map((item) => {
      _y1.push(item.data.powerScale);
      _y2.push(item.data.energyScale);
    });
    const _series = { type: "bar", barWidth: 14 };
    eChartsOption.value.series = [
      Object.assign(cloneDeep(_series), { name: "功率", data: _y1 }),
      Object.assign(cloneDeep(_series), { name: "能量", data: _y2 }),
    ];
    eChartsOption.value.yAxis.name = "MWh";
    eChartsOption.value.xAxis.axisLabel.rotate = -90;
    eChartsOption.value.xAxis.axisLabel.formatter = (params) => {
      return params.length > 6 ? params.substr(0, 6) + "..." : params;
    };
    eChartsOption.value.xAxis.data = _data.map((item) =>
      item.abbreviation !== null ? item.abbreviation : item.company,
    );
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
    createECharts();
  } else if (datas.length === 0 || resp_code !== 0) {
    isEmptyData.value = true;
  }
  loading.value = false;
}
// 创建图表
function createECharts() {
  const myChart = echarts.init(
    document.getElementById("eChart_businessAnalysis"),
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
#eChart_businessAnalysis {
  @include widthAndHeight(1152px, 581px);
  margin-top: 32px;
}
.es-dataBusinessAnalysis-top {
  @include flex(center, space-between, nowrap);
}
.es-dataBusinessAnalysis-top__left {
  @include flex(center, flex-start, nowrap);
  & > div {
    @include flex(center, flex-start, nowrap);
    margin-right: 24px;
  }
  .es-dataBusinessAnalysis-top__title {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-right: 16px;
    flex: 1;
  }
}
.es-dataBusinessAnalysis-top__right {
  @include flex(center, flex-start, nowrap);
  .es-dataBusinessAnalysis-top__line {
    @include widthAndHeight(1px, 24px);
    display: inline-block;
    background: #dbdce2;
    margin-right: 24px;
  }
}
</style>
