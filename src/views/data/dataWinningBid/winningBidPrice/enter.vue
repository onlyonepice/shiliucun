<!-- 中标价格分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <div
        v-for="(item, index) in options"
        :style="{ marginRight: index === options.length - 1 ? '16px' : '24px' }"
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
          :labelKey="item.bind.cascaderOption.label"
          :valueKey="item.bind.cascaderOption.value"
          :defaultValue="requestData[item.model]"
          width="256px"
          @onChange="(val) => selectChange(item, index, val)"
        />
      </div>
      <p class="line" />
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div :class="ns.b('hint')">
      <img :src="lament_icon" alt="" />
      <span
        >中标价格在去除最高值和最低值后，以能量规模（MWh）为权重，使用加权平均的方法计算。</span
      >
    </div>
    <div :class="ns.b('eCharts-box')" v-if="!isEmptyData">
      <div v-loading="loading" id="eChart-winningBidPrice" ref="eChartsDom" />
      <div
        class="echarts-mask animate__animated animate__fadeIn"
        v-if="!echartsMask"
      >
        <h4>开通企业VIP查看完整数据</h4>
        <el-button type="primary" @click="useUserStore().openVip(true)"
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
import { get } from "lodash";
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { getToken } from "@/utils/auth";
import { priceFormOptions } from "../data";
import useNamespace from "@/utils/nameSpace";
import { ref, watch, Ref, nextTick } from "vue";
import { capacityAnalysis_V2, maskPermissions } from "@/api/data";
import { useUserStore } from "@/store/modules/user";
import { chartWatermark } from "@/utils/echarts/eCharts";
import lament_icon from "@/assets/img/common/lament_icon.png";
const { VITE_DATABASE_URL } = import.meta.env;
const ns = useNamespace("winningBidPrice");
const EChartOptions: Ref<any> = ref({});
const loading: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const echartsMask: Ref<boolean> = ref(true); // echarts蒙层
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
              item.bind.options = res[1].datas;
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
            case 1:
              requestData.value.technologyType = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
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
    const data = await capacityAnalysis_V2(requestData.value);
    const { datas, resp_code } = data;
    const textStyle = {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: 400,
      color: "#5B6985",
    };
    if (resp_code === 0 && datas.length) {
      let barSeries = [];
      let lineSeries = [];
      barSeries = datas[0].data.map((item) => {
        return {
          type: "bar",
          name: item.hour,
          value: item.hour,
          yAxisIndex: 0,
          barWidth: 16,
          stack: "total",
          itemStyle: {
            color: colorEnum[item.hour],
          },
          data: [],
        };
      });
      lineSeries = cloneDeep(barSeries).map((item) => {
        const result = {
          ...item,
          type: "line",
          name: `${item.name}中标均价`,
          yAxisIndex: 1,
          lineStyle: {
            width: 2,
          },
          symbolSize: 6,
          connectNulls: true,
        };
        delete result.stack;
        return result;
      });
      EChartOptions.value.xAxis.data = [];
      datas.forEach((item) => {
        EChartOptions.value.xAxis.data.push(item.month);

        item.data.forEach((barItem, barIndex) => {
          const bar_target = barSeries.find(
            (item) => item.name === barItem.hour,
          );
          const line_target = lineSeries.find(
            (item) => item.name === `${barItem.hour}中标均价`,
          );

          const energyScale = isNaN(+item.data[barIndex].energyScale)
            ? item.data[barIndex].energyScale
            : (+item.data[barIndex].energyScale).toFixed(1);

          const winningUnitPrice = isNaN(+item.data[barIndex].winningUnitPrice)
            ? item.data[barIndex].winningUnitPrice
            : (+item.data[barIndex].winningUnitPrice).toFixed(2);

          bar_target.data.push({
            value: energyScale,
            energyScale,
            winningUnitPrice,
          });
          line_target.data.push({
            value: winningUnitPrice,
            energyScale,
            winningUnitPrice,
          });
        });
      });
      const legend = [
        {
          x: "center",
          y: "90%",
          textStyle,
          data: barSeries.map((item) => {
            return {
              name: item.name,
              icon: "rect",
            };
          }),
        },
        {
          x: "center",
          y: "95%",
          textStyle,
          data: lineSeries.map((item) => {
            return {
              name: item.name,
              icon: "path://M-0.000,-0.000 L10.000,-0.000 L10.000,1.000 L-0.000,1.000 L-0.000,-0.000 Z",
            };
          }),
        },
      ];
      EChartOptions.value.series = barSeries.reverse().concat(lineSeries);
      EChartOptions.value.legend = legend;
      initECharts();
    } else if (!datas.length) {
      isEmptyData.value = true;
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

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
    const res = await maskPermissions({ moduleName: "中标价格分析" });
    echartsMask.value = res.datas;
  }
  myChart.setOption(EChartOptions.value);
};
const colorEnum = {
  "4小时及以上": "#B8C4FB",
  "2到4小时（含2小时）": "#6F89F6",
  "2小时以内": "#244BF1",
};
const initData = () => {
  EChartOptions.value = {
    color: ["#165DFF", "#2FAEFF", "#FF7D00"],
    title: {
      show: true,
      text: `储能月度中标单价/容量分析-${requestData.value.biddingContent}（${requestData.value.technologyType}）`,
      left: "center",
    },
    graphic: [chartWatermark],
    legend: {},
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
        const barList = params
          .filter((item) => item.seriesType === "bar")
          .reverse();
        const total = barList
          .map((item) => item.data.energyScale)
          .reduce((a, c) => a + (c === "-" ? 0 : +c), 0);

        var htmlStr = `<div style="width: 368px;" >
              <div style="line-height:24px; font-width: 400; display: flex; justify-content: space-between;">
                <span style="font-weight: 600; font-size: 16px; color:#000;">${params[0].name}</span>
                <span style="font-weight: 600; font-size: 16px; color:#000;">合计：${total.toFixed(1)}MWh</span>
              </div>
            `;
        params.forEach((item) => {
          const energyScale =
            item.data.energyScale === "-" ? "" : `${item.data.energyScale}MWh`;
          const winningUnitPrice =
            item.data.winningUnitPrice === "-"
              ? ""
              : ` | ${item.data.winningUnitPrice}元/Wh`;
          const _noData =
            item.data.energyScale === "-" && item.data.winningUnitPrice === "-";

          htmlStr += `<div
              style="
                width: 100%;
                height: 32px;
                margin-top: 8px;
                background: #F4F5F7;
                border-radius: 4px;
                padding: 0 8px 0 10px;
                font-weight: 400;
                display: ${item.seriesType !== "bar" ? "none" : "flex"};
                align-items: center;
                justify-content: space-between;
              "
              >
                <div
                  style="
                    height: 100%;
                    display: flex;
                    align-items: center;
                  "
                >
                  <div
                    style="
                      width: 12px;
                      height: 12px;
                      margin-right: 10px;
                      background-color: ${colorEnum[item.seriesName]};
                      border-radius: 2px;
                    "
                  >
                  </div>
                  <span style="font-size: 14px; color: #5B6985;">${item.seriesName}</span>
                </div>
                <span style="font-size: 14px; color: #000; font-weight: 600;">
                  ${!_noData ? energyScale + winningUnitPrice : "暂无数据"}
                </span>
              </div>`;
        });
        htmlStr += "</div>";
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
      data: [],
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
        name: "MWh",
        position: "left",
        alignTicks: true,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#E5E6EA",
            width: 1,
          },
        },
      },
      {
        type: "value",
        name: "元/Wh",
        position: "right",
        alignTicks: true,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        axisLabel: {
          formatter: function (value) {
            return parseFloat(value.toFixed(1));
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#E5E6EA",
            width: 1,
          },
        },
      },
    ],
    series: [
      {
        name: "容量（MWh）",
        type: "bar",
        yAxisIndex: 0,
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
        data: [],
      },
      {
        name: "中标单价（元/Wh）",
        type: "line",
        yAxisIndex: 1,
        data: [],
      },
    ],
  };
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
.es-winningBidPrice-hint {
  width: 100%;
  margin: 8px 0 32px 0;
  background-color: #eff4ff;
  height: 32px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  span {
    font-weight: 400;
    @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
  }
}
.es-winningBidPrice-eCharts-box {
  width: 100%;
  @include relative();

  #eChart-winningBidPrice {
    width: 100%;
    height: 642px;
  }
}
</style>
