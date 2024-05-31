<!-- 储能时长分析 -->
<template>
  <div v-loading="loading" :class="ns.b()">
    <!-- 招标分析 -->
    <div :class="ns.b('filter')">
      <Select
        title="招标内容"
        :options="contentList"
        valueKey="id"
        labelKey="paramDesc"
        :defaultValue="searchParams.contentDict"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'contentDict')"
      />
      <Select
        title="发布日期"
        :options="dateList"
        valueKey="paramValue"
        labelKey="paramDesc"
        :defaultValue="searchParams.releaseTime"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'releaseTime')"
      />
      <Select
        title="招标地区"
        :options="regionList"
        valueKey="paramValue"
        labelKey="paramDesc"
        :defaultValue="searchParams.partition"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'partition')"
      />
    </div>
    <div :class="ns.b('btns')">
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div :class="ns.b('content')">
      <div
        v-if="!isEmptyData"
        :class="ns.b('chart')"
        id="eChart-duration-analysis"
        ref="eChartsDomDurationAnalysis"
      />
      <EmptyData v-else />
      <ExportCanvasDialog
        :visible="exportVisible"
        :img-url="exportImgUrl"
        :img-title="eChartName"
        @close="exportVisible = false"
      />
    </div>
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { computed, ref, Ref, watch, nextTick } from "vue";
import { useUserStore } from "@/store/modules/user";
import Select from "@/components/Common/Select.vue";
import { getEnergyStorageDurationAnalysis } from "@/api/data";
import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
const { VITE_DATABASE_URL } = import.meta.env;
const ns = useNamespace("durationAnalysis");
const props = defineProps({
  formOptions: {
    type: Array as any,
    default: () => [],
  },
});
const EChartOptions: Ref<any> = ref({
  ...pieEChartsOption(),
  color: ["#244BF1", "#466FFD", "#7493FE", "#CED9FF"],
  series: {
    type: "pie",
    startAngle: 0,
    radius: [184, 250],
    avoidLabelOverlap: true,
    label: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 16,
      formatter: (param) => `${param.name}：${param.data.percentage}%`,
    },
    data: [],
  },
});
const isEmptyData = ref(false);
const loading = ref(true);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const eChartsDomDurationAnalysis: Ref<any> = ref(null);

const contentList = ref([]); // select options 招标内容
const dateList = ref([]); // select options 发布日期
const regionList = ref([]); // select options 招标地区
// 表单数据
const searchParams = ref({
  contentDict: "",
  releaseTime: "",
  partition: "",
});

const eChartName = computed(() => {
  const year = dateList.value.find(
    (item) => item.paramValue === searchParams.value.releaseTime,
  ).paramDesc;
  const content = contentList.value.find(
    (item) => item.id === searchParams.value.contentDict,
  ).paramDesc;
  return `${year}${searchParams.value.partition}${content}招标不同储能时长能量规模占比`;
});

watch(
  () => props.formOptions,
  (val) => {
    if (val.length) {
      contentList.value = val[0];
      searchParams.value.contentDict = val[0].find(
        (item) => item.defaultValue,
      ).id;
      dateList.value = val[1];
      searchParams.value.releaseTime = val[1].find(
        (item) => item.defaultValue,
      ).paramValue;
      regionList.value = val[2];
      searchParams.value.partition = val[2].find(
        (item) => item.defaultValue,
      ).paramValue;
      getData();
    }
  },
  { immediate: true, deep: true },
);

// 获取数据
async function getData() {
  loading.value = true;
  isEmptyData.value = false;
  try {
    const { datas, resp_code } = await getEnergyStorageDurationAnalysis(
      searchParams.value,
    );
    const data = datas?.data;
    if (resp_code === 0 && data) {
      EChartOptions.value.tooltip = {
        show: false,
      };
      // 添加title
      EChartOptions.value.title.text = eChartName;
      // 添加series
      EChartOptions.value.series.data = data.map((item) => {
        return { ...item, value: Number(item.value) };
      });
      loading.value = false;
      initECharts();
    } else if (resp_code === 10030 || !data) {
      isEmptyData.value = true;
      loading.value = false;
    }
  } catch (e) {
    loading.value = false;
  }
}

// 渲染图表
const initECharts = () => {
  const myChart = echarts.init(
    document.getElementById("eChart-duration-analysis"),
  );
  myChart.setOption(EChartOptions.value);
};

// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsDomDurationAnalysis.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportVisible.value = true;
}

const searchParams_deep = ref(null);
// 用户触发表单
function handleTriggerForm() {
  searchParams_deep.value = cloneDeep(searchParams.value);
}

// 筛选项发生变化时
function handleChange(val, key) {
  const _releaseTime = searchParams.value.releaseTime;
  if (key !== "releaseTime") {
    searchParams.value[key] = val;
    if (
      useUserStore().checkPermission(
        "ANALYSIS_OF_BIDDING_ENERGY_STORAGE_DURATION",
      )
    ) {
      getData();
    } else {
      nextTick(() => {
        searchParams.value = searchParams_deep.value;
      });
    }
  } else {
    const _data = dateList.value.filter((item) => {
      return item.paramValue === val;
    });
    searchParams.value.releaseTime = val;
    if (!_data[0].lock) {
      getData();
    } else {
      useUserStore().openVip(true);
      nextTick(() => {
        searchParams.value.releaseTime = _releaseTime;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style";

.es-durationAnalysis {
  margin-top: 9px;

  .es-durationAnalysis-filter {
    display: flex;
  }

  .es-durationAnalysis-btns {
    margin: 32px 0 16px 0;
    @include flex("center", "flex-start");
    flex-direction: row-reverse;
  }

  .es-durationAnalysis-content {
    @include flex();
    min-height: 320px;

    #eChart-duration-analysis {
      @include widthAndHeight(100%, 642px);
    }
  }
}
</style>
