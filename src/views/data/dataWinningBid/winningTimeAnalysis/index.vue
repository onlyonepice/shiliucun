<template>
  <div v-loading="loading" :class="ns.b()">
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
        :class="ns.b('chart')"
        id="eChart-duration-analysis"
        ref="eChartsDomDurationAnalysis"
      />
      <ExportCanvasDialog
        :visible="exportVisible"
        :img-url="exportImgUrl"
        :img-title="`${year}${searchParams.partition}（${searchParams.releaseTime}）`"
        @close="exportVisible = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { ref, Ref, watch } from "vue";
import { getToken } from "@/utils/auth";
import useNamespace from "@/utils/nameSpace";
import Select from "@/components/Common/Select.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { getEnergyStorageDurationAnalysis } from "@/api/data";
import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
const ns = useNamespace("durationAnalysis");
const props = defineProps({
  formOptions: {
    type: Array as any,
    default: () => [],
  },
});
const EChartOptions: Ref<any> = ref({
  ...pieEChartsOption(),
  color: ["#244BF1", "#FF892E", "#FFAF0B"],
  series: {
    type: "pie",
    startAngle: 0,
    radius: ["52%", "68%"],
    avoidLabelOverlap: true,
    label: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 16,
      formatter: (param) => param.value + "%",
    },
    data: [],
  },
});
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

const year = ref("");

watch(
  () => props.formOptions,
  (val) => {
    if (val.length) {
      contentList.value = val[0].datas;
      searchParams.value.contentDict = val[0].datas.find(
        (item) => item.defaultValue,
      ).id;
      dateList.value = val[5].datas;
      searchParams.value.releaseTime = val[5].datas.find(
        (item) => item.defaultValue,
      ).paramValue;
      regionList.value = val[7].datas;
      searchParams.value.partition = val[7].datas.find(
        (item) => item.defaultValue,
      ).paramValue;
      year.value = val[5].datas[0].paramDesc;
      getData();
    }
  },
  { immediate: true, deep: true },
);

// 获取数据
async function getData() {
  loading.value = true;
  try {
    const { datas, resp_code } = await getEnergyStorageDurationAnalysis(
      searchParams.value,
    );
    if (resp_code === 0) {
      // 添加title
      EChartOptions.value.title.text = `${year.value}华东地区储能系统招标不同储能时长能量规模占比`;
      // 添加series
      EChartOptions.value.series.data = datas.data.map((item) => {
        return { ...item, value: Number(item.value) };
      });
      loading.value = false;
      initECharts();
    } else if (resp_code === 10030) {
      setTimeout(() => {
        searchParams.value = searchParams_deep.value;
      });
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
  searchParams.value[key] = val;
  if (!getToken()) {
    setTimeout(() => {
      searchParams.value = searchParams_deep.value;
    });
    useUserStoreHook().openLogin(true);
  } else {
    if (key === "releaseTime") {
      year.value = dateList.value.find(
        (item) => item.paramValue === val,
      ).paramDesc;
    }
    getData();
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
    #eChart-duration-analysis {
      @include widthAndHeight(100%, 500px);
    }
  }
}
</style>
