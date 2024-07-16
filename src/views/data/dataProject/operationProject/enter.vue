<!-- 储能项目投运规模 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <Select
        :width="'33%'"
        v-for="(item, index) in options"
        :key="item.title"
        :type="item.type"
        v-model="requestData[item.model]"
        :options="item.bind && item.bind['options']"
        :title="item.title"
        :defaultValue="requestData[item.model]"
        :cascaderOption="
          item.type === 'cascader' && item.bind['cascaderOption']
        "
        @onChange="(val) => selectChange(item, index, val)"
        :disabledDate="item.type === 'date' && disabledDate"
      />
    </div>
    <el-button type="primary" @click="exportResult" style="float: right"
      >下载图片</el-button
    >
    <div :class="ns.b('eCharts-box')" v-if="!isEmptyData">
      <div v-loading="loading" id="eChart-operationProject" ref="eChartsDom" />
      <div
        class="echarts-mask animate__animated animate__fadeIn"
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
      :img-title="`储能项目投运规模`"
      @close="exportVisible = false"
    />
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import * as echarts from "echarts";
import { getToken } from "@/utils/auth";
import { operationProjectFormOptions } from "../data";
import useNamespace from "@/utils/nameSpace";
import { ref, watch, Ref, nextTick } from "vue";
import { operationProjectApi, maskPermissions } from "@/api/data";
import { useUserStore } from "@/store/modules/user";
import { chartWatermark } from "@/utils/echarts/eCharts";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

const router = useRouter();
const { VITE_DATABASE_URL } = import.meta.env;
const ns = useNamespace("operationProject");
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
  endYear: "",
  region: "",
  startYear: "",
});
const isEmptyData = ref(false);
const options = ref(operationProjectFormOptions());
interface response {
  datas: any;
}
const _yearTimeFrame = ref([]);
const _region = ref("");
const timeFrame = ref({ start: null, end: null });
const intervalDurationNum = ref(0); // 区间时长
const regionName = ref("");
const foundLabel = ref(""); // 使用递归根据region id查询所选地区label
const regionList = ref([]); // 地区下拉框数据
// 获取默认地区数据
function findDefaultRegions(regions) {
  let result = [];

  regions.forEach((region) => {
    if (region.children && region.children.length > 0) {
      result = result.concat(findDefaultRegions(region.children));
    }
    if (region.isDefaultValue) {
      result.push(region);
    }
  });

  return result;
}
// 使用递归函数查找id为某值的项
function findLabelById(array, targetId) {
  for (let item of array) {
    if (item.id === targetId) {
      foundLabel.value = item.label;
      return;
    }
    if (item.children && item.children.length > 0) {
      findLabelById(item.children, targetId);
    }
  }
}

// 获取筛选项options
watch(
  () => props.formOptions,
  (res: response[]) => {
    if (res.length > 0) {
      nextTick(() => {
        options.value.forEach((item) => {
          switch (item.model) {
            case "yearTimeFrame":
              intervalDurationNum.value = getMonthDifference(
                res[0].datas.min,
                res[0].datas.max,
              ); // 获取后端返回时间区间月份差
              if (intervalDurationNum.value >= 12) {
                requestData.value["yearTimeFrame"] = [
                  getStartMonthFromEnd(res[0].datas.max),
                  res[0].datas.max,
                ];
              } else {
                requestData.value["yearTimeFrame"] = [
                  res[0].datas.min,
                  res[0].datas.max,
                ];
              }
              _yearTimeFrame.value = cloneDeep(
                requestData.value["yearTimeFrame"],
              );
              timeFrame.value.start = getTimeStamp(res[0].datas.min);
              timeFrame.value.end = getTimeStamp(res[0].datas.max);
              break;
            case "region":
              regionList.value = res[1].datas;
              item.bind["options"] = res[1].datas;
              requestData.value.region =
                findDefaultRegions(res[1].datas).length > 0
                  ? findDefaultRegions(res[1].datas)[0].id
                  : res[1].datas[0].children[0].id;
              regionName.value =
                findDefaultRegions(res[1].datas).length > 0
                  ? findDefaultRegions(res[1].datas)[0].label
                  : res[1].datas[0].children[0].label;
              _region.value = cloneDeep(requestData.value.region);

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
// 获取特定时间往前推12个月的时间
function getStartMonthFromEnd(endDateString) {
  const endDate = new Date(endDateString);
  endDate.setMonth(endDate.getMonth() - 11);
  return `${endDate.getFullYear()}-${("0" + (endDate.getMonth() + 1)).slice(-2)}`;
}
// 计算两个时间之间的月份差
function getMonthDifference(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 注意：月份是从0开始的
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  // 计算月份差
  let monthDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

  return Math.abs(monthDifference);
}
// 获取时间戳
function getTimeStamp(time) {
  const [year, month] = time.split("-").map((part) => parseInt(part));
  new Date(year, month).getTime();
  return new Date(year, month - 1).getTime();
}

// 限制时间选择范围
function disabledDate(time) {
  const { start, end } = timeFrame.value;
  const currentTime = time.getTime();
  if (currentTime >= start && currentTime <= end) {
    // return true;
  } else {
    return true;
  }
}

// 获取图表数据--储能项目投运规模
const getData = async () => {
  loading.value = true;
  isEmptyData.value = false;
  try {
    requestData.value.startYear = dayjs(
      requestData.value["yearTimeFrame"][0],
    ).format("YYYY-MM");
    requestData.value.endYear = dayjs(
      requestData.value["yearTimeFrame"][1],
    ).format("YYYY-MM");
    lastSelectedTime.value = [
      requestData.value.startYear,
      requestData.value.endYear,
    ];
    const data = await operationProjectApi(requestData.value);
    const { datas, resp_code } = data;
    const textStyle = {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: 400,
      color: "#5B6985",
    };
    if (resp_code === 0 && datas.length) {
      let lineSeries = []; // 功率数据
      let barSeries = []; // 容量数据
      const priority = [
        "户用储能",
        "工商业储能",
        "电网侧储能",
        "电源侧储能",
        "源网侧储能",
      ];
      barSeries = datas[0].data.map((item) => {
        return {
          type: "bar",
          name: item.applicationScenes,
          value: item.applicationScenes,
          yAxisIndex: 0,
          barWidth: 16,
          stack: "total",
          itemStyle: {
            color: colorEnum[item.applicationScenes],
          },
          connectNulls: true,
          data: [],
        };
      });
      barSeries.sort((a, b) => {
        return priority.indexOf(a.name) - priority.indexOf(b.name);
      });
      lineSeries = cloneDeep(barSeries).map((item) => {
        const result = {
          ...item,
          type: "bar",
          name: `${item.name}`,
          yAxisIndex: 1,
          connectNulls: true,
        };
        delete result.stack;
        result.stack = "Ad";
        return result;
      });
      EChartOptions.value.xAxis.data = [];
      datas.forEach((item) => {
        EChartOptions.value.xAxis.data.push(item.year);

        item.data.forEach((barItem, barIndex) => {
          const bar_target = barSeries.find(
            (item) => item.name === barItem.applicationScenes,
          );
          const line_target = lineSeries.find(
            (item) => item.name === `${barItem.applicationScenes}`,
          );

          const capacity = isNaN(+item.data[barIndex].capacity)
            ? item.data[barIndex].capacity
            : (+item.data[barIndex].capacity).toFixed(2);

          const power = isNaN(+item.data[barIndex].power)
            ? item.data[barIndex].power
            : (+item.data[barIndex].power).toFixed(2);

          bar_target.data.push({
            value: capacity,
            capacity,
            power,
          });
          line_target.data.push({
            value: power,
            capacity,
            power,
          });
        });
      });
      const _barSeries = cloneDeep(barSeries).reverse();
      // 色块展示
      let legend = [
        {
          x: "center",
          y: "90%",
          textStyle,
          data: _barSeries.map((item) => {
            return {
              name: item.name,
              icon: "rect",
            };
          }),
        },
      ];
      EChartOptions.value.series = lineSeries
        .reverse()
        .concat(barSeries.reverse());
      // 根据国家动态改变色块
      if (regionName.value === "中国") {
        legend[0].data = legend[0]["data"].filter(
          (item) => item.name !== "源网侧储能",
        );
      } else {
        legend[0].data = legend[0]["data"].filter(
          (item) => item.name !== "电源侧储能" && item.name !== "电网侧储能",
        );
      }
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
    document.getElementById("eChart-operationProject"),
  );
  myChart.on("mouseover", (params): any => {
    if (params.data === undefined) {
      myChart.dispatchAction({
        type: "downplay",
      });
    }
  });
  if (getToken()) {
    const res = await maskPermissions({ moduleName: "储能项目投运规模" });
    echartsMask.value = res.datas.isCovered;
  }
  myChart.setOption(EChartOptions.value);
};
const colorEnum = {
  源网侧储能: "#244BF1",
  电源侧储能: "#244BF1",
  电网侧储能: "#5B78F5",
  工商业储能: "#91A5F8",
  户用储能: "#C8D2FB",
};
const initData = () => {
  EChartOptions.value = {
    color: ["#165DFF", "#2FAEFF", "#FF7D00"],
    title: {
      show: true,
      text: `储能项目投运规模`,
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
        params = params.slice(0, 5);

        if (regionName.value === "中国") {
          params = params.filter((item) => item.seriesName !== "源网侧储能");
        } else {
          params = params.filter(
            (item) =>
              item.seriesName !== "电源侧储能" &&
              item.seriesName !== "电网侧储能",
          );
        }

        var htmlStr = `<div style="width: 368px;" >
              <div style="line-height:24px; font-width: 400; display: flex; justify-content: space-between;">
                <span style="font-weight: 600; font-size: 16px; color:#000;">${params[0].name}</span>
              </div>
            `;
        const _params = params.reverse();
        _params.forEach((item) => {
          const capacity =
            item.data.capacity === "-" ? "-" : `${item.data.capacity}MWh`;
          const power =
            item.data.power === "-" ? "- | " : `${item.data.power}MW | `;
          const _noData = item.data.capacity === "-" && item.data.power === "-";

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
                  ${!_noData ? power + capacity : "暂无数据"}
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
        name: "容量/MWh",
        position: "right",
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
        name: "功率/MW",
        position: "left",
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
        type: "bar",
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
const lastSelectedTime = ref([]); // 记录上次选择时间

const selectChange = (row, index, val) => {
  if (
    useUserStore().checkPermission("ENERGY_STORAGE_PROJECT_COMMISSIONING_SCALE")
  ) {
    if (row.model === "yearTimeFrame") {
      const nowCheckVal = [
        dayjs(val[0]).format("YYYY-MM"),
        dayjs(val[1]).format("YYYY-MM"),
      ];
      const monthNum = getMonthDifference(nowCheckVal[0], nowCheckVal[1]);
      if (monthNum >= 12) {
        requestData.value["yearTimeFrame"] =
          lastSelectedTime.value.length === 0
            ? _yearTimeFrame.value
            : lastSelectedTime.value;
        ElMessage.warning("最多选择12个月！请重新选择");
        return;
      } else {
        requestData.value["yearTimeFrame"] = val;
      }
    } else {
      requestData.value[row.model] = val;
      findLabelById(regionList.value, val);
      regionName.value = foundLabel.value;
    }
    getData();
  } else {
    nextTick(() => {
      requestData.value[row.model] =
        row.model === "yearTimeFrame" ? _yearTimeFrame.value : _region.value;
    });
  }
};
window.trackFunction("pc_Project_click");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-operationProject {
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
.es-operationProject-filter {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
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
.es-operationProject-eCharts-box {
  width: 100%;
  @include relative();
  margin-top: 80px;

  #eChart-operationProject {
    width: 100%;
    height: 642px;
  }
}
</style>
