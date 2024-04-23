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
      <div v-loading="loading" id="eChart-winningBidPrice" ref="eChartsDom" />
      <ExportCanvasDialog
        :visible="exportVisible"
        :img-url="exportImgUrl"
        :img-title="`储能月度中标单价/容量分析-${requestData.biddingContent}（${requestData.technologyType}）`"
        @close="exportVisible = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { ref, watch, Ref, nextTick } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidScenes");
import { get } from "lodash";
import { enterScenesFormOptions } from "../data.js";
// import { capacityAnalysis_V2 } from "@/api/data";
// import { cloneDeep } from "lodash";
import * as echarts from "echarts";
// import { pieEChartsOption } from "@/utils/echarts/pieECharts.ts";
const EChartOptions: Ref<any> = ref({});
const loading: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
// 获取eCharts节点
const eChartsDom: Ref<any> = ref(null);
// const eChartsOption: Ref<any> = ref(pieEChartsOption());
const props = defineProps({
  formOptions: {
    type: Array as any,
    default: () => [],
  },
});
const requestData = ref({
  biddingContent: "",
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
    console.log("1231311231", res);
    if (res.length > 0) {
      nextTick(() => {
        options.value.forEach((item) => {
          switch (item.model) {
            case "biddingContent":
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
              requestData.value.biddingContent = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
                "2",
              );
              break;
            case 5:
              requestData.value.releaseTime = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
                "5",
              );
              break;
            case 6:
              requestData.value.unit = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
                "1",
              );
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
  loading.value = true;
  try {
    loading.value = false;
    initECharts();
  } catch (e) {
    loading.value = false;
  }
};

const initECharts = () => {
  const myChart = echarts.init(
    document.getElementById("eChart-winningBidPrice"),
  );
  myChart.setOption(EChartOptions.value);
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

  #eChart-winningBidScenes {
    width: 100%;
    height: 642px;
  }
}
</style>
