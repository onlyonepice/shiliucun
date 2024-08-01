<!-- 中标价格分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <Select
        v-for="(item, index) in options"
        :key="item.title"
        v-model="requestData[item.model]"
        :options="item.bind.options"
        :title="item.title"
        :labelKey="item.bind.cascaderOption.label"
        :valueKey="item.bind.cascaderOption.value"
        :defaultValue="requestData[item.model]"
        @onChange="(val) => selectChange(item, index, val)"
      />
    </div>
    <el-button type="primary" @click="exportResult" style="float: right"
      >下载图片</el-button
    >
    <div :class="ns.b('eCharts-box')" v-if="!isEmptyData">
      <div v-loading="loading" id="eChart-winningBidPrice" ref="eChartsDom" />
      <div
        class="echarts-mask animate__animated animate__fadeIn"
        v-if="echartsMask"
        :style="echartsMaskStyle"
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
      :img-title="`储能月度中标单价/容量分析-${requestData.biddingContent}（${requestData.technologyType}）`"
      @close="exportVisible = false"
    />
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script setup lang="ts">
import { get, toNumber } from "lodash";
import * as echarts from "echarts";
import { getToken } from "@/utils/auth";
import { priceFormOptions } from "../data";
import useNamespace from "@/utils/nameSpace";
import { ref, watch, Ref, nextTick, computed } from "vue";
import { biddingScaleAnalysis, maskPermissions } from "@/api/data";
import { useUserStore } from "@/store/modules/user";
import { chartWatermark } from "@/utils/echarts/eCharts";
import { useRouter } from "vue-router";

const router = useRouter();
const { VITE_DATABASE_URL } = import.meta.env;
const ns = useNamespace("winningBidPrice");
const EChartOptions: Ref<any> = ref({});
const loading: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const echartsMask: Ref<boolean> = ref(false); // echarts蒙层
// 获取eCharts节点
const eChartsDom = ref(null);
const props = defineProps({
  formOptions: {
    type: Array,
    default: () => [],
  },
});
const requestData = ref({
  biddingContent: "",
  technologyType: "",
  applicationScenarios: "",
});
const isEmptyData = ref(false);
const options = ref(priceFormOptions());
interface response {
  datas: any;
}
const echartsMaskStyle: any = computed(() => {
  return {
    width: `${81 * quantity.value}px`,
  };
});

watch(
  () => props.formOptions,
  (res: response[]) => {
    if (res.length > 0) {
      nextTick(() => {
        options.value.forEach((item) => {
          switch (item.model) {
            case "biddingContent":
              item.bind.options = res[0].datas;
              break;
            case "technologyType":
              item.bind.options = res[9].datas;
              break;
            case "applicationScenarios":
              item.bind.options = res[3].datas;
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
            case 9:
              requestData.value.technologyType = get(
                item.datas.find((item) => item.defaultValue),
                "paramName",
                "1",
              );
              break;
            case 3:
              requestData.value.applicationScenarios = get(
                item.datas.find((item) => item.defaultValue),
                "paramName",
                "2",
              );
              break;
          }
        });
        initData();
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
  isEmptyData.value = false;
  try {
    const data = await biddingScaleAnalysis(requestData.value);
    const { datas, resp_code } = data;
    const showData = datas.some(
      (item) =>
        !isNaN(toNumber(item.powerScale)) || !isNaN(toNumber(item.energyScale)),
    );
    if (resp_code === 0 && datas.length && showData) {
      EChartOptions.value.series[0].data = [];
      EChartOptions.value.xAxis.data = [];
      EChartOptions.value.series[1].data = [];
      datas.forEach((item: any) => {
        EChartOptions.value.series[0].data.push(item.powerScale);
        EChartOptions.value.series[1].data.push(item.energyScale);
        EChartOptions.value.xAxis.data.push(item.month);
        EChartOptions.value.title.subtext = requestData.value.biddingContent;
      });
      initECharts();
    } else {
      isEmptyData.value = true;
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};
const quantity = ref();
const initECharts = async () => {
  const myChart = echarts.init(
    document.getElementById("eChart-winningBidPrice"),
  );
  // 地图鼠标移入，没有数据不高亮显示
  myChart.on("mouseover", (params): any => {
    if (params.data === undefined) {
      myChart.dispatchAction({
        type: "downplay",
      });
    }
  });
  if (getToken()) {
    const res = await maskPermissions({ moduleName: "中标规模分析" });
    echartsMask.value = res.datas.isCovered;
    quantity.value = res.datas.quantity;
  }
  myChart.setOption(EChartOptions.value);
};
const initData = () => {
  EChartOptions.value = {
    color: ["#244BF1", "#91A5F8"],
    title: {
      show: true,
      text: "储能月度中标规模分析",
      left: "center",
      subtext: requestData.value.biddingContent,
      subtextStyle: {
        color: "rgba(0,0,0,0.6)",
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    graphic: [chartWatermark],
    legend: {
      show: true,
      left: "center",
      height: 16,
      bottom: "1%",
      itemGap: 48,
      lineStyle: {
        width: 16,
      },
      textStyle: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: 400,
        color: "#5B6985",
      },
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 0,
      axisPointer: {
        type: "line",
        lineStyle: {
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      confine: true,
      className: "custom-tooltip",
      extraCssText: "padding: 16px; border-radius: 8px;",
      formatter: (params) => {
        let itemHtml = "";
        const isShow = params.every((item) => item.value === "-");
        if (isShow) return itemHtml;
        params.forEach((item, index) => {
          itemHtml += `<div style="width: 208px;height: 32px;background: #F2F3F5;border-radius: 4px;line-height: 32px;padding:0 8px;margin-top: 8px;display:flex;align-items:center;">
            <div style="background:${item.color};width:12px;height:12px;margin-right:8px;"></div>
            <div style="font-weight: 400;font-size: 14px;color: rgba(0,0,0,0.6);">
              ${item.seriesName}
            </div>
            <div style="font-weight: 600;font-size: 14px;color: rgba(0,0,0,0.9);margin-left:auto;">
              ${item.value}${index === 0 ? "MW" : "MWh"}
            </div>
          </div>`;
        });
        const { axisValueLabel } = params[0];
        var htmlStr = `<div style="" ><div style="font-weight: 600;font-size: 16px;color: rgba(0,0,0,0.9);">${axisValueLabel}</div>${itemHtml}</div>`;
        return htmlStr;
      },
    },
    grid: {
      left: "8%",
      right: "8%",
      bottom: "15%",
      top: 80,
    },
    xAxis: {
      type: "category",
      data: [1, 2, 3],
      axisLine: {
        show: true,
        lineStyle: {
          color: "#919DB5",
        },
      },
      axisTick: {
        show: false,
        interval: 0,
      },
      axisLabel: {
        show: true,
        interval: 0,
      },
    },
    yAxis: [
      {
        type: "value",
        nameTextStyle: {
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: "功率",
        type: "bar",
        barWidth: 16,
        itemStyle: {
          color: "pink",
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        data: [1, 2, 3],
      },
      {
        name: "能量",
        type: "bar",
        barWidth: 16,
        itemStyle: {
          color: "pink",
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        data: [1, 2, 3],
      },
    ],
  };
};
// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsDom.value as any);
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
window.trackFunction("pc_Winbid_PriceAnalysis_click");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-winningBidPrice {
  width: 100%;
}
.echarts-mask {
  @include widthAndHeight(240px, 475px);
  @include absolute(1, none, 90px, 96px, none);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(25px);
  text-align: center;
  h4 {
    margin-top: 180px;
    margin-bottom: 14px;
  }
}
.es-winningBidPrice-filter {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  .select-item {
    display: flex;
    align-items: center;
    .label {
      @include font(14px.400, rgba(0, 0, 0, 0.6), 22px);
      width: 72px;
    }
  }
  .line {
    width: 1px;
    height: 24px;
    background: #dbdce2;
    margin-right: 15px;
  }
}

.es-winningBidPrice-eCharts-box {
  width: 100%;
  @include relative();
  margin-top: 80px;

  #eChart-winningBidPrice {
    width: 100%;
    height: 642px;
  }
}
</style>
