<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <span :class="ns.be('top', 'title')">招标内容</span>
      <Select
        v-model="contentDict"
        width="296px"
        :options="contentFilter"
        labelKey="paramDesc"
        valueKey="id"
        :defaultValue="contentDict"
        @onChange="
          (val) => {
            return onChangeFilter(val, 'contentDict');
          }
        "
      />
      <span :class="ns.be('top', 'title')">发布日期</span>
      <Select
        v-model="releaseTime"
        width="296px"
        :options="timeFilter"
        labelKey="paramDesc"
        valueKey="paramValue"
        :defaultValue="releaseTime"
        @onChange="
          (val) => {
            return onChangeFilter(val, 'releaseTime');
          }
        "
      />
      <span :class="ns.be('top', 'title')">统计单位</span>
      <Select
        ref="unitDom"
        v-model="unit"
        width="296px"
        :options="unitFilter"
        labelKey="paramDesc"
        valueKey="paramValue"
        :defaultValue="unit"
        @onChange="
          (val) => {
            return onChangeFilter(val, 'unit');
          }
        "
      />
    </div>
    <div :class="ns.be('top', 'right')" v-if="!showEmpty">
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div
      v-if="!showEmpty"
      v-loading="loading"
      id="eChart_dataScenesAnalysis"
      ref="eChartsDom"
    />
    <EmptyData style="margin-top: 120px" v-else />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="canvasTitle"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getTenderScenariosApi } from "@/api/data";
import { pieEChartsOption } from "@/utils/echarts/pieECharts";
import { cloneDeep } from "lodash";
import { useUserStore } from "@/store/modules/user";
// import { nextTick } from "process";
const unitDom = ref(); // 获取单位下拉框
const eChartsOption: Ref<any> = ref(pieEChartsOption());
// 获取eCharts节点
const eChartsDom = ref(null);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("dataScenesAnalysis");
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
  unitFilter: {
    type: Array as () => any[],
    default: () => [],
  },
});
// 筛选项结果
const contentDict = ref(712);
const releaseTime = ref("2024");
const unit = ref("2");
const showEmpty: Ref<boolean> = ref(false);
const canvasTitle = ref("");
const onChangeFilter = (id: any, type: string) => {
  type === "contentDict" && (contentDict.value = id);
  type === "releaseTime" && (releaseTime.value = id);
  type === "unit" && (unit.value = id);
  if (
    useUserStore().checkPermission("ANALYSIS_OF_BIDDING_APPLICATION_SCENARIOS")
  ) {
    getElectricityTypeOneName();
  } else {
    unitDom.value.onBlur();
    nextTick(() => {
      unit.value = "2";
      contentDict.value = 712;
      releaseTime.value = "2024";
    });
  }
};

onMounted(() => {
  getElectricityTypeOneName();
});

// 获取eCharts数据
async function getElectricityTypeOneName() {
  loading.value = true;
  showEmpty.value = false;
  eChartsOption.value.series = [];
  let _unit = cloneDeep(unit.value);
  const { datas } = await getTenderScenariosApi({
    contentDict: contentDict.value,
    releaseTime: releaseTime.value,
    unit: unit.value,
  });
  if (datas.length === 0) {
    return (showEmpty.value = true);
  }
  datas.forEach((item) => {
    item.data.forEach((item2) => {
      item2.unit = item.unit === "数量" ? "个" : item.unit;
    });
  });
  const _releaseTime = releaseTime.value;
  let _title = "";
  props.contentFilter.forEach((item) => {
    if (item.id === contentDict.value) {
      _title = item.paramDesc;
    }
  });
  canvasTitle.value = `${_releaseTime.split("-")[0]}年${_releaseTime.split("-")[1] !== undefined ? _releaseTime.split("-")[1] + "月" : ""}${_title}招标应用场景分布`;
  eChartsOption.value.title.text = canvasTitle.value;
  eChartsOption.value.color = ["#244BF1", "#FF892E", "#FFAF0B", "#01B82B"];
  eChartsOption.value.series.push({
    type: "pie",
    radius: [184, 250],
    label: {
      show: true,
      formatter: (params) => {
        return `${params.value}${params.data.unit === "MWH" ? "\n" : ""}${params.data.unit}`;
      },
    },
    data: datas[0].data,
  });

  loading.value = false;
  createECharts();
}
// 创建图表
function createECharts() {
  const myChart = echarts.init(
    document.getElementById("eChart_dataScenesAnalysis"),
  );
  myChart.clear();
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
  exportVisible.value = true;
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#eChart_dataScenesAnalysis {
  @include widthAndHeight(100%, 642px);
  margin-top: 80px;
}

.es-dataScenesAnalysis-top {
  @include flex(center, space-between, nowrap);
}

.es-dataScenesAnalysis-top__left {
  width: 328px;
  @include flex(center, flex-start, nowrap);

  .es-dataScenesAnalysis-top__title {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-right: 16px;
    flex: 1;
  }
}

.es-dataScenesAnalysis-top__right {
  float: right;
  margin: 32px 0 16px;

  .es-dataScenesAnalysis-top__line {
    @include widthAndHeight(1px, 24px);
    display: inline-block;
    background: #dbdce2;
    margin-right: 24px;
  }
}
</style>
