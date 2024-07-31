<!-- 应用场景分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <Select
        v-model="contentDict"
        :options="contentFilter"
        labelKey="paramDesc"
        valueKey="id"
        :defaultValue="contentDict"
        title="招标内容"
        @onChange="
          (val) => {
            return onChangeFilter(val, 'contentDict');
          }
        "
      />
      <Select
        v-model="releaseTime"
        :options="timeFilter"
        labelKey="paramDesc"
        valueKey="paramValue"
        :defaultValue="releaseTime"
        title="发布日期"
        @onChange="
          (val) => {
            return onChangeFilter(val, 'releaseTime');
          }
        "
      />
      <Select
        ref="unitDom"
        v-model="unit"
        :options="unitFilter"
        labelKey="paramDesc"
        valueKey="paramValue"
        :defaultValue="unit"
        title="统计单位"
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
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getTenderScenariosApi } from "@/api/data";
import { pieEChartsOption } from "@/utils/echarts/pieECharts";
import { useUserStore } from "@/store/modules/user";
const { VITE_DATABASE_URL } = import.meta.env;
// import { nextTick } from "process";
const unitDom = ref(); // 获取单位下拉框
const eChartsOption: Ref<any> = ref(pieEChartsOption());
// 获取eCharts节点
const eChartsDom = ref(null);
// 下载图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 下载图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开下载图片弹窗
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
const unit = ref("");
const showEmpty: Ref<boolean> = ref(false);
const canvasTitle = ref("");
const onChangeFilter = (id: any, type: string) => {
  const _releaseTime = releaseTime.value;
  type === "contentDict"
    ? (contentDict.value = id)
    : type === "unit"
      ? (unit.value = id)
      : (releaseTime.value = id);
  if (
    useUserStore().checkPermission("ANALYSIS_OF_BIDDING_APPLICATION_SCENARIOS")
  ) {
    if (type === "releaseTime") {
      const _data = props.timeFilter.filter((item) => {
        return item.paramValue === id;
      });
      if (!_data[0].lock) {
        getElectricityTypeOneName();
      } else {
        useUserStore().openVipTitle = "开通企业VIP查看完整数据。";
        useUserStore().openVipSubmitTitle = "立即开通";
        useUserStore().openVip(true);
        return nextTick(() => {
          releaseTime.value = _releaseTime;
        });
      }
    }
    getElectricityTypeOneName();
  } else {
    nextTick(() => {
      contentDict.value = 712;
      props.unitFilter.forEach((item) => {
        item.defaultValue && (unit.value = item.paramValue);
      });
      releaseTime.value = _releaseTime;
    });
  }
};

onMounted(() => {
  window.trackFunction("pc_Bidding_ScenceAnalysis_click");
  props.unitFilter.forEach((item) => {
    item.defaultValue && (unit.value = item.paramValue);
  });
  props.timeFilter.forEach((item) => {
    item.defaultValue && (releaseTime.value = item.paramValue);
  });
  getElectricityTypeOneName();
});

// 获取eCharts数据
async function getElectricityTypeOneName() {
  loading.value = true;
  showEmpty.value = false;
  eChartsOption.value.series = [];
  const { datas } = await getTenderScenariosApi({
    contentDict: contentDict.value,
    releaseTime: releaseTime.value,
    unit: unit.value,
  });
  if (datas.length === 0) {
    return (showEmpty.value = true);
  }
  const _releaseTime = releaseTime.value;
  let _title = "";
  props.contentFilter.forEach((item) => {
    if (item.id === contentDict.value) {
      _title = item.paramDesc;
    }
  });
  canvasTitle.value = `${_releaseTime.split("-")[0]}年${_releaseTime.split("-")[1] !== undefined ? _releaseTime.split("-")[1] + "月" : ""}${_title}招标应用场景分布`;
  eChartsOption.value.title.text = canvasTitle.value;
  eChartsOption.value.color = ["#244BF1", "#466FFD", "#7493FE", "#CED9FF"];
  eChartsOption.value.tooltip = {
    show: false,
  };
  eChartsOption.value.series.push({
    type: "pie",
    radius: [184, 250],
    label: {
      show: true,
      formatter: (params) => {
        return `${params.name}：${params.data.percentage}%`;
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

// 下载图片
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
