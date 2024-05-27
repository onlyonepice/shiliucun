<!-- 应用场景分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <div
        v-for="(item, index) in options"
        :key="item.label"
        class="select-item"
      >
        <span class="label">
          {{ item.label }}
        </span>
        <Select
          :ref="item.model"
          v-model="requestData[item.model]"
          :options="item.bind.options"
          :type="item.type"
          :multiple="item.multiple"
          :labelKey="item.bind.cascaderOption.label"
          :valueKey="item.bind.cascaderOption.value"
          :defaultValue="requestData[item.model]"
          width="296px"
          @onChange="(val) => selectChange(item, index, val)"
        />
      </div>
    </div>
    <el-button
      v-if="!showEmpty"
      style="float: right; margin-top: 32px"
      type="primary"
      @click="exportResult"
      >下载图片</el-button
    >
    <div :class="ns.b('eCharts-box')">
      <div
        v-if="!showEmpty"
        v-loading="loading"
        id="eChart-winningBidScenes"
        ref="eChartsDom"
      />
      <EmptyData v-else />
    </div>
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="canvasTitle"
      @close="exportVisible = false"
    />
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { ref, watch, Ref, nextTick } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidScenes");
import { getWinningScenariosApi } from "@/api/data";
import { enterScenesFormOptions } from "../data.js";
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
const { VITE_DATABASE_URL } = import.meta.env;
const loading: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const canvasTitle = ref(""); // 弹窗标题
const unit = ref(); // 单位选择dom
const showEmpty: Ref<boolean> = ref(false);
// 获取eCharts节点
const eChartsDom: Ref<any> = ref(null);
const eChartsOption: Ref<any> = ref(pieEChartsOption());
const props = defineProps({
  formOptions: {
    type: Array as any,
    default: () => [],
  },
});
const requestData: Ref<any> = ref({
  contentDict: "",
  releaseTime: "",
  unit: "",
});
const options = ref(enterScenesFormOptions());
interface response {
  datas: any;
}
watch(
  () => props.formOptions,
  (res: response[]) => {
    if (res.length > 0) {
      nextTick(() => {
        options.value.forEach((item) => {
          switch (item.model) {
            case "contentDict":
              item.bind.options = res[0].datas;
              break;
            case "releaseTime":
              item.bind.options = res[4].datas;
              break;
            case "unit":
              item.bind.options = res[6].datas;
              break;
          }
        });
        res.forEach((item, index) => {
          switch (index) {
            case 0:
              item.datas.forEach((item: any) => {
                if (item.defaultValue) {
                  requestData.value.contentDict = item.id;
                }
              });
              break;
            case 4:
              item.datas.forEach((item: any) => {
                if (item.defaultValue) {
                  requestData.value.releaseTime = item.paramName;
                }
              });
              break;
            case 6:
              item.datas.forEach((item: any) => {
                item.defaultValue && (requestData.value.unit = item.paramValue);
              });
              break;
          }
        });
        getData();
      });
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const getData = async () => {
  eChartsOption.value.series = [];
  loading.value = true;
  showEmpty.value = false;
  try {
    const _filter: any = cloneDeep(requestData.value);
    const { datas } = await getWinningScenariosApi(_filter);
    if (datas.length === 0) {
      return (showEmpty.value = true);
    }
    const _releaseTime = _filter.releaseTime;
    let _title = "123";
    props.formOptions[0].datas.forEach((item) => {
      if (item.id === _filter.contentDict) {
        _title = item.paramName;
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
    initECharts();
  } catch (e) {
    loading.value = false;
  }
};

const initECharts = () => {
  const myChart = echarts.init(
    document.getElementById("eChart-winningBidScenes"),
  );
  myChart.clear();
  myChart.setOption(eChartsOption.value);
};
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

const selectChange = (row, index, val) => {
  if (
    useUserStore().checkPermission("APPLICATION_SCENARIOS_FOR_WINNING_BIDS")
  ) {
    requestData.value[row.model] = val;
    getData();
  } else {
    unit.value[0].onBlur();
    nextTick(() => {
      requestData.value = {
        contentDict: 712,
        releaseTime: "2024",
        unit: "1",
      };
    });
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-winningBidScenes {
  width: 100%;
}
.es-winningBidScenes-filter {
  width: 100%;
  @include flex(center, space-between, nowrap);
  .select-item {
    @include flex(center, flex-start, nowrap);
    .label {
      @include font(14px.400, rgba(0, 0, 0, 0.6), 22px);
      width: 72px;
    }
  }
}
.es-winningBidScenes-eCharts-box {
  width: 100%;
  margin-top: 80px;
  #eChart-winningBidScenes {
    width: 100%;
    height: 642px;
  }
}
</style>
