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
    <div :class="ns.b('hint')">
      <img :src="lament_icon" alt="" />
      <span
        >中标价格在去除最高值和最低值后，以能量规模（MWh）为权重，使用加权平均的方法计算。</span
      >
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
import * as echarts from "echarts";
import { get, toNumber } from "lodash";
import { getToken } from "@/utils/auth";
import useNamespace from "@/utils/nameSpace";
import { priceFormOptionsNews } from "../data";
import { ref, watch, Ref, nextTick, computed } from "vue";
import { biddingPriceAnalysis, maskPermissions } from "@/api/data";
import { useUserStore } from "@/store/modules/user";
import { chartWatermark } from "@/utils/echarts/eCharts";
import lament_icon from "@/assets/img/common/lament_icon.png";
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
  energyStorageDuration: "",
  stepSize: "月",
});
const isEmptyData = ref(false);
const options = ref(priceFormOptionsNews());
interface response {
  datas: any;
}
const echartsMaskStyle: any = computed(() => {
  let itemWidth = 0;
  if (requestData.value.stepSize === "月") {
    itemWidth = 81.5;
  } else if (requestData.value.stepSize === "季") {
    itemWidth = 242;
  }
  return {
    width: `${itemWidth * quantity.value}px`,
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
              item.bind.options = res[1].datas;
              break;
            case "energyStorageDuration":
              item.bind.options = res[8].datas;
              break;
            case "stepSize":
              item.bind.options = [
                { paramDesc: "季", paramName: "季", defaultValue: true },
                { paramDesc: "月", paramName: "月" },
              ];
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
            case 8:
              requestData.value.energyStorageDuration = get(
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

const initData = () => {
  EChartOptions.value = {
    color: ["#165DFF", "#6F89F6"],
    title: {
      show: true,
      text: "",
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
      textStyle: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: 400,
        color: "#5B6985",
      },
      data: [
        {
          name: "中标价格范围",
        },
        {
          name: "加权中标均价（元/Wh）",
          icon: "path://M-0.000,-0.000 L10.000,-0.000 L10.000,1.000 L-0.000,1.000 L-0.000,-0.000 Z",
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
        const { name } = params[0];
        const popupStyle =
          "padding:0px;font-size:14px;line-height:22px;color:#5B6985;width:300px;";
        const titleStyle =
          "font-weight: 600;font-size: 16px;color: rgba(0,0,0,0.9);line-height: 24px;";
        const itemLabelStyle =
          "font-weight: 400;font-size: 14px;color: rgba(0,0,0,0.6);line-height: 32px;";
        const itemValueStyle =
          "font-weight: 600;font-size: 14px;color: rgba(0,0,0,0.9);line-height: 32px;margin-left:auto;";
        const value1 = isNaN(params[0].value)
          ? 0
          : toNumber(params[0].value) % 1 == 0
            ? toNumber(params[0].value).toFixed(0)
            : toNumber(params[0].value).toFixed(4);
        const value2 = isNaN(params[1].value)
          ? 0
          : (toNumber(value1) * 10000 + toNumber(params[1].value) * 10000) /
            10000;
        const value3 = isNaN(params[2].value)
          ? 0
          : toNumber(params[2].value) % 1 == 0
            ? toNumber(params[2].value).toFixed(0)
            : toNumber(params[2].value).toFixed(4);
        if (!value1 && !value2 && !value3) return "";
        const itemOneHtml = `
          <div style="display:flex;margin-top:8px;height:32px;background:#F2F3F5;border-radius:4px;padding:0 8px;display:flex;align-items:center;">
            <div style="background:${params[1].color};width:12px;height:12px;margin-right:8px;"></div>
            <div style="${itemLabelStyle}">中标价格范围</div>
            <div style="${itemValueStyle}">${value1}元-${value2}元</div>
          </div>
        `;
        const htmlStr = `
          <div style="${popupStyle}">
            <div style="${titleStyle}">${name}</div>
            ${toNumber(value1) == toNumber(value2) ? "" : itemOneHtml}
            <div style="display:flex;margin-top:8px;height:32px;background:#F2F3F5;border-radius:4px;padding:0 8px;display:flex;align-items:center;">
              <div style="background:${params[2].color};width:12px;height:4px;margin-right:8px;"></div>
              <div style="${itemLabelStyle}">加权中标均价（元/Wh）</div>
              <div style="${itemValueStyle}">${value3}元</div>
            </div>
          </div>
        `;
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
      data: [],
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: [{ name: "元/Wh" }],
    series: [],
  };
};
const getData = async () => {
  loading.value = true;
  isEmptyData.value = false;
  try {
    const data = await biddingPriceAnalysis(requestData.value);
    const { datas, resp_code } = data;
    if (resp_code === 0 && datas.length) {
      const series = [
        {
          name: "",
          type: "bar",
          stack: "Total",
          silent: true,
          barWidth: "16",
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: [],
        },
        {
          name: "中标价格范围",
          type: "bar",
          stack: "Total",
          barWidth: "16",
          label: {
            show: false,
            position: "top",
          },
          data: [],
        },
        {
          name: "加权中标均价（元/Wh）",
          type: "line",
          data: [],
          silent: true,
          lineStyle: {
            // 隐藏折线
            opacity: 0,
          },
          itemStyle: {
            // 显示数据点
            opacity: 1,
          },
          symbol: "rect", // 数据点的形状
          symbolSize: [16, 4], // 数据点的大小
        },
      ];
      const xAxisData = [];
      datas.forEach((item: any) => {
        xAxisData.push(item.month);
        series[0].data.push(item.minUnitPrice);
        series[1].data.push(
          (item.maxUnitPrice * 100 - item.minUnitPrice * 100) / 100,
        );
        series[2].data.push(item.avgUnitPrice);
      });
      EChartOptions.value.xAxis.data = xAxisData;
      EChartOptions.value.series = series;
      setTitle(datas);
      initECharts();
    } else if (!datas.length) {
      isEmptyData.value = true;
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

const setTitle = (datas) => {
  const { biddingContent, technologyType, energyStorageDuration } =
    requestData.value;
  const Duration = get(
    props.formOptions[8]?.datas.find(
      (item: any) => item.paramName === energyStorageDuration,
    ),
    "paramDesc",
    "",
  );
  EChartOptions.value.title.text = `${datas[0].month}-${datas[datas.length - 1].month}${biddingContent}（${technologyType}，${Duration}）中标均价趋势分析`;
};

const quantity = ref(0);
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
    const res = await maskPermissions({
      moduleName: "中标价格分析",
      stepSize: requestData.value.stepSize,
    });
    echartsMask.value = res.datas.isCovered;
    quantity.value = res.datas.quantity;
  }
  myChart.setOption(EChartOptions.value);
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
window?.trackFunction("pc_Winbid_PriceAnalysis_click");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-winningBidPrice {
  width: 100%;
}
.echarts-mask {
  @include widthAndHeight(243px, 475px);
  @include absolute(1, none, 91px, 96px, none);
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
  margin-top: 80px;

  #eChart-winningBidPrice {
    width: 100%;
    height: 642px;
  }
}
</style>
