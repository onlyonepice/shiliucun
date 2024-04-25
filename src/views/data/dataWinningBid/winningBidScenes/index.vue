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
      style="float: right; margin-top: 32px"
      type="primary"
      @click="exportResult"
      >下载图片</el-button
    >
    <div :class="ns.b('eCharts-box')">
      <div v-loading="loading" id="eChart-winningBidScenes" ref="eChartsDom" />
    </div>
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="`储能月度中标单价/容量分析-${requestData.contentDict}（${requestData.technologyType}）`"
      @close="exportVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { ref, watch, Ref, nextTick } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidScenes");
import { get } from "lodash";
import { getWinningScenariosApi } from "@/api/data";
import { enterScenesFormOptions } from "../data.js";
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
const loading: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
// 获取eCharts节点
const eChartsDom: Ref<any> = ref(null);
const eChartsOption: Ref<any> = ref(pieEChartsOption());
const props = defineProps({
  formOptions: {
    type: Array as any,
    default: () => [],
  },
});
const requestData = ref({
  contentDict: "",
  releaseTime: "",
  unit: [],
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
              item.bind.options = res[5].datas;
              break;
            case "unit":
              item.bind.options = res[6].datas;
              break;
          }
        });
        res.forEach((item, index) => {
          switch (index) {
            case 0:
              requestData.value.contentDict = get(
                item.datas.find((item) => item.defaultValue),
                "id",
                "2",
              );
              break;
            case 5:
              item.datas.forEach((item: any) => {
                if (item.defaultValue) {
                  requestData.value.releaseTime = item.paramValue;
                }
              });
              break;
            case 6:
              item.datas.forEach((item: any) => {
                if (item.defaultValue) {
                  requestData.value.unit.push(item.paramValue);
                }
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
  try {
    const _filter: any = cloneDeep(requestData.value);
    _filter.unit = _filter.unit.join(",");
    const { datas } = await getWinningScenariosApi(_filter);
    datas.forEach((item) => {
      item.data.forEach((item2) => {
        item2.unit = item.unit === "数量" ? "个" : item.unit;
      });
    });
    const _releaseTime = _filter.releaseTime;
    eChartsOption.value.title.text = `${_releaseTime.split("-")[0]}年${_releaseTime.split("-")[1] !== undefined ? _releaseTime.split("-")[1] + "月" : ""}储能系统招标应用场景分布`;
    eChartsOption.value.color = ["#244BF1", "#FF892E", "#FFAF0B", "#01B82B"];
    requestData.value.unit.forEach((item, index) => {
      eChartsOption.value.series.push({
        type: "pie",
        radius: [204 - index * 50, 250 - index * 50],
        label: {
          show: true,
          position: "inside",
          formatter: (params) => {
            return `${params.value}${params.data.unit === "MWH" ? "\n" : ""}${params.data.unit}`;
          },
        },
        data: datas[index].data,
      });
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
  if (useUserStore().checkPermission("BID_PRICE_ANALYSIS")) {
    requestData.value[row.model] = val;
    getData();
  } else {
    nextTick(() => {
      requestData.value[row.model] =
        options[index].bind.options[0][
          options[index].bind.cascaderOption.value
        ];
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
