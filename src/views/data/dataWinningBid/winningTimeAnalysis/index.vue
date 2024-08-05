<!-- 储能时常分析 -->
<template>
  <div v-loading="loading" :class="ns.b()">
    <!-- 中标 -->
    <div :class="ns.b('filter')">
      <Select
        title="中标内容"
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
        valueKey="paramName"
        labelKey="paramName"
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
    <EchartsTips />
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
import { ref, Ref, watch, computed, nextTick } from "vue";
import { useUserStore } from "@/store/modules/user";
import Select from "@/components/Common/Select.vue";
import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
import { getWinningEnergyStorageDurationAnalysis } from "@/api/data";
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
const exportImgUrl = ref({ png: "", jpg: "" }); // 下载图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开下载图片弹窗
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

watch(
  () => props.formOptions,
  (val) => {
    if (val.length) {
      contentList.value = val[0].datas;
      searchParams.value.contentDict = val[0].datas.find(
        (item) => item.defaultValue,
      ).id;
      // 时间
      dateList.value = val[4].datas;
      searchParams.value.releaseTime = val[4].datas.find(
        (item) => item.defaultValue,
      ).paramName;
      // 地区
      regionList.value = val[7].datas;
      searchParams.value.partition = val[7].datas.find(
        (item) => item.defaultValue,
      ).paramValue;
      getData();
    }
  },
  { immediate: true, deep: true },
);
const eChartName = computed(() => {
  const content = contentList.value.find(
    (item) => item.id === searchParams.value.contentDict,
  ).paramDesc;
  return `${searchParams.value.releaseTime}${searchParams.value.partition}${content}中标不同储能时长能量规模占比`;
});
// 获取数据
async function getData() {
  isEmptyData.value = false;
  loading.value = true;
  try {
    const { datas, resp_code } = await getWinningEnergyStorageDurationAnalysis(
      searchParams.value,
    );
    const data = datas?.data;
    if (resp_code === 0 && data) {
      // 添加title
      EChartOptions.value.title.text = eChartName;
      EChartOptions.value.tooltip = {
        show: false,
      };
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

// 下载图片
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
  searchParams.value[key] = val;
  if (useUserStore().checkPermission("BID_WINNING_ENERGY_STORAGE_DURATION")) {
    if (key === "releaseTime") {
      const _data = dateList.value.filter((item) => {
        return item.paramName === val;
      });
      if (!_data[0].lock) {
        getData();
      } else {
        useUserStore().openVipTitle = "开通企业VIP查看完整数据。";
        useUserStore().openVipSubmitTitle = "立即开通";
        useUserStore().openVip(true);
        return nextTick(() => {
          searchParams.value.releaseTime = _releaseTime;
        });
      }
    }
    getData();
  } else {
    nextTick(() => {
      searchParams.value = searchParams_deep.value;
    });
  }
}
window.trackFunction("pc_Winbid_TimeAnalysis_click");
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
