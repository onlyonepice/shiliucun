<!-- 中标企业分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <Select
        v-for="(item, index) in options"
        :key="item.title"
        v-model="requestData[item.model]"
        :options="item.bind.options"
        :type="item.type"
        :title="item.title"
        :labelKey="item.bind.cascaderOption.label"
        :valueKey="item.bind.cascaderOption.value"
        :defaultValue="requestData[item.model]"
        @onChange="(val) => selectChange(item, index, val)"
        style="margin-bottom: 12px"
      />
    </div>
    <div :class="ns.b('hint')">
      <div>
        <img :src="lament_icon" alt="" />
        <span>中标价格以能量规模（MWh）为权重，使用加权平均的方法计算。</span>
      </div>
      <div>
        <img :src="lament_icon" alt="" />
        <span>仅含项目级中标，不含集采/框架。</span>
      </div>
    </div>
    <div :class="ns.b('download')">
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div :class="ns.b('eCharts-box')" v-if="!isEmptyData">
      <div
        v-loading="loading"
        id="eChart-winningBidEnterprise"
        ref="eChartsDom"
      />
      <div
        class="echarts-mask-bottom animate__animated animate__fadeIn"
        v-if="echartsMask"
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
import { get } from "lodash";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getToken } from "@/utils/auth";
import { ref, watch, Ref, nextTick } from "vue";
import { enterpriseAnalysis, maskPermissions } from "@/api/data";
import { enterpriseFormOptions } from "../data";
import { useUserStore } from "@/store/modules/user";
import { chartWatermark } from "@/utils/echarts/eCharts";
import lament_icon from "@/assets/img/common/lament_icon.png";
import { useRouter } from "vue-router";
const router = useRouter();
const { VITE_DATABASE_URL } = import.meta.env;
const ns = useNamespace("winningBidEnterprise");
const isEmptyData = ref(false);
const echartOptions: Ref<any> = ref({});
const loading: Ref<boolean> = ref(false);
const echartsMask: Ref<boolean> = ref(false);
const exportImgUrl = ref({ png: "", jpg: "" }); // 下载图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开下载图片弹窗
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
  energyStorageDuration: "",
  year: "2023",
  applicationScenarios: "",
});
const options = ref(enterpriseFormOptions());
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
            case "energyStorageDuration":
              item.bind.options = res[2].datas;
              break;
            case "applicationScenarios":
              item.bind.options = [
                {
                  paramName: "all",
                  paramDesc: "全部",
                  defaultValue: true,
                  isHidden: false,
                },
                {
                  paramName: "工商业",
                  paramDesc: "工商业",
                  defaultValue: false,
                  isHidden: false,
                },
                {
                  paramName: "大储",
                  paramDesc: "大储",
                  defaultValue: false,
                  isHidden: false,
                },
              ];
              break;
            case "year":
              item.bind.options = res[4].datas;
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
            case 2:
              requestData.value.energyStorageDuration = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
                "2",
              );
              break;
            case 3:
              requestData.value.applicationScenarios = get(
                item.datas.find((item) => item.defaultValue),
                "paramName",
                "3",
              );
              break;
            case 4:
              requestData.value.year = get(
                item.datas.find((item) => item.defaultValue),
                "paramDesc",
                "4",
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
    const res = await enterpriseAnalysis(requestData.value);
    if (res.resp_code === 0 && res.datas.length) {
      echartOptions.value.series[0].data = [];
      echartOptions.value.series[1].data = [];
      echartOptions.value.series[2].data = [];
      echartOptions.value.xAxis.data = [];
      echartOptions.value.xAxis.axisLabel.rotate = -90;
      const structure_encode_data = [];
      res.datas.forEach((item, index) => {
        if (index < 20) {
          if (!item.energyScale && !item.winningUnitPrice) return;

          const energyScale = +item.energyScale.toFixed(2) || "-";
          const winningUnitPrice = +item.winningUnitPrice.toFixed(2) || "-";

          echartOptions.value.series[0].data.push(energyScale);
          echartOptions.value.series[1].data.push(winningUnitPrice);

          echartOptions.value.xAxis.data.push(item.groupEnterpriseName);
          structure_encode_data.push([
            item.groupEnterpriseName,
            +item.energyScale.toFixed(2),
            +item.winningUnitPrice.toFixed(2),
            item.winningUnitPriceMin,
            item.winningUnitPriceMax,
          ]);
        }
      });
      echartOptions.value.series[2].data = structure_encode_data;
      let maxlength = 0;
      echartOptions.value.xAxis.data.forEach((item) => {
        if (item.length > maxlength) {
          maxlength = item.length;
        }
      });
      initECharts();
    } else if (!res.datas.length) {
      isEmptyData.value = true;
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};
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
const initECharts = async () => {
  const myChart = echarts.init(
    document.getElementById("eChart-winningBidEnterprise"),
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
    const res = await maskPermissions({ moduleName: "中标企业分析" });
    echartsMask.value = res.datas.isCovered;
  }
  myChart.setOption(echartOptions.value);
};

const initData = () => {
  function renderItem(params, api) {
    const group = {
      type: "group",
      children: [],
    };
    const coordDims = ["x", "y"];
    const baseDimIdx = 0;
    const otherDimIdx = 1;
    const param = [];

    param[baseDimIdx] = params.dataIndex;

    param[otherDimIdx] = api.value(3);
    const bottomPoint = api.coord(param);

    param[otherDimIdx] = api.value(4);
    const topPoint = api.coord(param);

    const halfWidth = 5;
    const style = api.style({
      stroke: "#50B0F9",
      fill: undefined,
      lineWidth: 1.5,
    });

    group.children.push(
      {
        type: "line",
        transition: ["shape"],
        shape: makeShape(
          baseDimIdx,
          bottomPoint[baseDimIdx] - halfWidth,
          bottomPoint[otherDimIdx],
          bottomPoint[baseDimIdx] + halfWidth,
          bottomPoint[otherDimIdx],
        ),
        style,
      },
      {
        type: "line",
        transition: ["shape"],
        shape: makeShape(
          baseDimIdx,
          bottomPoint[baseDimIdx],
          bottomPoint[otherDimIdx],
          topPoint[baseDimIdx],
          topPoint[otherDimIdx],
        ),
        style,
      },
      {
        type: "line",
        transition: ["shape"],
        shape: makeShape(
          baseDimIdx,
          topPoint[baseDimIdx] - halfWidth,
          topPoint[otherDimIdx],
          topPoint[baseDimIdx] + halfWidth,
          topPoint[otherDimIdx],
        ),
        style,
      },
    );

    function makeShape(baseDimIdx, base1, value1, base2, value2) {
      var shape = {};
      shape[coordDims[baseDimIdx] + "1"] = base1;
      shape[coordDims[1 - baseDimIdx] + "1"] = value1;
      shape[coordDims[baseDimIdx] + "2"] = base2;
      shape[coordDims[1 - baseDimIdx] + "2"] = value2;
      return shape;
    }

    if (!param[otherDimIdx]) {
      group.children = null;
    }

    return group;
  }
  const dimensions = ["group", "energyScale", "winningUnitPrice", "min", "max"];
  // 柱状图配置
  const colorConfig = ["#165DFF", "#6F89F6", "#50B0F9"];
  const unitConfig = ["MWh", "元/Wh", "元/Wh"];
  const labelConfig = ["容量", "中标均价", "中标范围"];
  echartOptions.value = {
    color: ["#165DFF", "#6F89F6"],
    title: {
      show: true,
      text: "中标企业分析",
      left: "center",
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
      selectedMode: "multiple",
      textStyle: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: 400,
        color: "#5B6985",
      },
      data: [
        {
          name: "容量（MWh）",
          icon: "rect",
        },
        {
          name: "中标单价（元/Wh）",
          icon: "circle",
        },
      ],
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
        const cur = params[0];

        var htmlStr = `<div  >
              <div style="line-height:24px; font-width: 400;">
                <span style="font-weight: 600; font-size: 16px; color:#000;">${cur.name}</span>
              </div>
            `;
        params.forEach((item, i) => {
          let value = item.value;
          if (item.value instanceof Array) {
            value = `${item.value[3]}-${item.value[4]}`;
          }
          value += unitConfig[i];

          let display = "none";
          if (item.value instanceof Array) {
            if (item.value[3] && item.value[4]) {
              display = "flex";
            }
          } else {
            if (item.value !== "-") {
              display = "flex";
            }
          }

          htmlStr += `<div
              style="
                width: 208px;
                height: 32px;
                margin-top: 8px;
                background: #F4F5F7;
                border-radius: 4px;
                padding: 0 8px 0 10px;
                font-weight: 400;
                display: ${display};
                align-items: center;
                justify-content: space-between;
              ">
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
                      background-color: ${colorConfig[i]};
                      border-radius: 2px;
                    "
                  >
                  </div>
                  <span
                    style="
                      font-size: 14px;
                      color: #5B6985;
                    "
                  >${labelConfig[i]}
                  </span>
                </div>
                <span
                  style="font-size: 14px; color: #000; font-weight: 600;">${value}
                </span>
              </div>`;
        });

        htmlStr += "</div>";
        return htmlStr;
      },
    },
    grid: {
      left: "6%",
      bottom: "35%",
      right: "3%",
      y2: "35%",
    },
    xAxis: {
      type: "category",
      data: [],
      axisLabel: {
        fontSize: 14,
        fontWeight: 400,
        color: "#919DB5",
        lineHeight: 22,
        rotate: 90,
        interval: "auto",
      },
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
        type: "bar",
        name: "容量（MWh）",
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
        z: 0,
        data: [],
      },
      {
        type: "scatter",
        name: "中标单价（元/Wh）",
        symbolSize: 10,
        yAxisIndex: 1,
        itemStyle: {
          opacity: 1,
        },
        encode: {
          x: ["group"],
          y: ["energyScale"],
          itemName: 1,
          itemGroupId: 1,
        },
        dimensions,
        z: 1,
        data: [],
      },
      {
        type: "custom",
        name: "中标单价（元/Wh）",
        yAxisIndex: 1,
        renderItem,
        encode: {
          x: ["group"],
          y: ["winningUnitPrice", "max", "min"],
          itemName: "group",
          itemGroupId: 2,
        },
        dimensions,
        z: 2,
        data: [],
      },
    ],
  };
};
const selectChange = (row, index, val) => {
  const _year = requestData.value["year"];
  requestData.value[row.model] = val;
  if (useUserStore().checkPermission("ANALYSIS_OF_WINNING_ENTERPRISES")) {
    if (row.model === "year") {
      const _data = props.formOptions[4]["datas"].filter((item) => {
        return item.paramName === val;
      });
      if (!_data[0].lock) {
        getData();
      } else {
        useUserStore().openVipTitle = "开通企业VIP查看完整数据。";
        useUserStore().openVipSubmitTitle = "立即开通";
        useUserStore().openVip(true);
        return nextTick(() => {
          requestData.value["year"] = _year;
        });
      }
    }
    getData();
  } else {
    nextTick(() => {
      requestData.value[row.model] =
        options.value[index].bind.options[0][
          options.value[index].bind.cascaderOption.value
        ];
      requestData.value["year"] = _year;
    });
  }
};
window.trackFunction("pc_Winbid_CompanyAnalysis_click");
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-winningBidEnterprise {
  width: 100%;
}
.es-winningBidEnterprise-filter {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .select-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .label {
      @include font(14px.400, rgba(0, 0, 0, 0.6), 22px);
      width: 72px;
    }
  }
  .select {
    width: 25% !important;
  }
}
.es-winningBidEnterprise-hint {
  width: 100%;
  margin: 0 0 32px 0;
  background-color: #eff4ff;
  // height: 32px;
  padding: 6px 8px;
  div {
    @include flex(center, flex-start, nowrap);
  }
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
.es-winningBidEnterprise-eCharts-box {
  width: 100%;
  @include relative();
  #eChart-winningBidEnterprise {
    width: 100%;
    height: 642px;
  }
}
.es-winningBidEnterprise-download {
  @include flex(center, flex-end, nowrap);
  margin-bottom: 8px;
}
.echarts-mask-bottom {
  @include widthAndHeight(calc(100% - 100px), 150px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7px);
  @include absolute(1, none, 30px, 69px, none);
  text-align: center;
  h4 {
    margin-top: 70px;
    margin-bottom: 14px;
  }
}
</style>
