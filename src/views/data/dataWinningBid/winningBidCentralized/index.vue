<!-- 企业集采入围 -->
<template>
  <div :class="ns.b()" v-loading="loading">
    <Select
      title="集采入围时间"
      :titleWidth="100"
      width="300"
      :options="timeList"
      labelKey="paramDesc"
      valueKey="paramName"
      :defaultValue="searchParams.time"
      @on-change="handleChange"
    />
    <div :class="ns.b('btns')">
      <el-button type="primary" @click="exportResult">下载图片</el-button>
    </div>
    <div :class="ns.b('content')">
      <EmptyData v-if="isEmptyData" />
      <template v-else>
        <div
          :class="ns.b('chart')"
          id="eChart-centralized"
          ref="eChartsCentralized"
        />
        <div class="table-box" id="table-box" @scroll="handleScroll">
          <table
            class="invite-tenders"
            id="invite-tenders"
            :style="isWidth ? 'width:100%;' : ''"
          >
            <thead>
              <tr>
                <th :style="`transform: translate(${thTitle}px, 0.1px)`">
                  <div class="tr-title">招标量</div>
                </th>
                <th
                  v-for="item in shortlistedEnterprise.amountOfTender"
                  :key="item"
                  :style="{ minWidth: thWidth }"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in shortlistedEnterprise.collectionScaleResp"
                :key="item.firm"
              >
                <th :style="`transform: translate(${thTitle}px, 0)`">
                  <div class="tr-title">{{ filterText(item.firm) }}</div>
                </th>
                <th
                  v-for="_item in shortlistedEnterprise.amountOfTender"
                  :key="_item"
                >
                  <div class="th-content">
                    <template
                      v-for="(value, index) in item.beShortlistedOrNotResp"
                      :key="index"
                    >
                      <div v-if="value.scale === _item" class="th-content-item">
                        <img
                          v-if="value.beShortlistedOrNot"
                          src="@/assets/img/common/beShortlistedOrNot.png"
                        />
                      </div>
                    </template>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
  <ExportCanvasDialog
    :visible="exportVisible"
    :img-url="exportImgUrl"
    :img-title="eChartName"
    @close="exportVisible = false"
  />
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { Ref, ref, computed, onMounted } from "vue";
import { chartWatermark } from "@/utils/echarts/eCharts";
import { getCollectTimeList, getCollectionEntry } from "@/api/data";
import { nextTick } from "process";

const ns = useNamespace("centralized");
const isWidth = ref(false);
const isEmptyData = ref(false);
const thTitle = ref(0);
const loading: Ref<boolean> = ref(false); // 加载
const timeList: Ref<Array<any>> = ref([]); // 时间筛选项
const eChartsCentralized: Ref<any> = ref(null); // 柱状图
const searchParams: Ref<any> = ref({ time: "" }); // 查询条件
const exportImgUrl = ref({ png: "", jpg: "" }); // 下载图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开下载图片弹窗
// 表格数据
const shortlistedEnterprise = ref<{
  amountOfTender: Array<string>;
  collectionScaleResp: Array<{
    firm: string;
    beShortlistedOrNotResp: Array<{
      beShortlistedOrNot: boolean;
      scale: string;
    }>;
  }>;
}>({
  amountOfTender: [],
  collectionScaleResp: [],
});
const eChartsOption: Ref<any> = ref({
  yAxis: { name: "MWh" },
  series: { type: "bar", barWidth: 24, data: [] },
  xAxis: {
    name: "",
    data: [],
    axisLabel: {
      interval: 0,
    },
  },
  graphic: [chartWatermark],
  color: ["#244BF1"],
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
      const titleStyle =
        "font-weight: 600;font-size: 16px;color: rgba(0,0,0,0.9);";
      const itemStyle =
        "width:128px;height: 32px;background: #F2F3F5;border-radius: 4px;line-height: 32px;padding:0 8px;margin-top: 8px;display:flex;align-items:center;";
      const itemLabelStyle =
        "font-weight: 400;font-size: 14px;color: rgba(0,0,0,0.6);";
      const itemValueStyle =
        "font-weight: 600;font-size: 14px;color: rgba(0,0,0,0.9);margin-left:auto;";
      const isShow = params.every((item) => item.value === "-");
      if (isShow) return itemHtml;
      params.forEach((item) => {
        itemHtml += `<div style="${itemStyle}">
            <div style="background:${item.color};width:12px;height:12px;margin-right:8px;"></div>
            <div style="${itemLabelStyle}"></div>
            <div style="${itemValueStyle}">${item.value}</div>
          </div>`;
      });
      const { axisValueLabel } = params[0];
      var htmlStr = `<div><div style="${titleStyle}">${axisValueLabel}</div>${itemHtml}</div>`;
      return htmlStr;
    },
  },
  title: {
    left: "center",
    text: "",
    textStyle: {
      fontSize: 20,
      lineHeight: 28,
      color: "rgba(0, 0, 0, 0.9)",
      fontWeight: "600",
    },
  },
});

function filterText(text: string) {
  return text.length > 10 ? text.slice(0, 10) + "..." : text;
}

const thWidth = computed(() => {
  if (shortlistedEnterprise.value.collectionScaleResp?.length) {
    let maxCount = 0;
    let mostFrequent = {};
    shortlistedEnterprise.value.collectionScaleResp[0].beShortlistedOrNotResp.forEach(
      ({ scale }) => {
        if (mostFrequent[scale]) {
          mostFrequent[scale] = mostFrequent[scale] += 1;
        } else {
          mostFrequent[scale] = 1;
        }
      },
    );
    for (const key in mostFrequent) {
      if (mostFrequent[key] > maxCount) {
        maxCount = mostFrequent[key];
      }
    }
    return `${maxCount * 30 + 40}px`;
  }
  return `${4 * 30 + 40}px`;
});

const eChartName = computed(() => {
  const { time } = searchParams.value;
  return `${time}企业集采入围`;
});
const initECharts = async () => {
  try {
    const myChart = echarts.init(document.getElementById("eChart-centralized"));
    myChart.setOption(eChartsOption.value);
  } catch (error) {
    console.error("渲染图表出错", error);
  }
};
// change
const handleChange = (val) => {
  searchParams.value.time = val;
  isWidth.value = false;
  // 判断在渲染前是否为空
  if (isEmptyData.value) {
    isEmptyData.value = false;
    nextTick(() => {
      getCollectionEntryList();
    });
  } else getCollectionEntryList();
};
// 下载图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsCentralized.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportVisible.value = true;
}
// 获取时间列表
async function getTimeList() {
  try {
    const { datas } = await getCollectTimeList();
    timeList.value = datas;
    searchParams.value.time = datas.find((item) => item.defaultValue).paramName;
    getCollectionEntryList();
  } catch (error) {
    console.log(error);
  }
}
async function getCollectionEntryList() {
  try {
    loading.value = true;
    const { datas } = await getCollectionEntry({
      time: searchParams.value.time,
    });
    if (
      datas?.collectingParty?.length &&
      datas?.shortlistedEnterprise?.collectionScaleResp?.length
    ) {
      // 获取表格
      shortlistedEnterprise.value = datas.shortlistedEnterprise;
      // 获取图表数据
      eChartsOption.value.title.text = eChartName.value;
      eChartsOption.value.xAxis.data = datas.collectingParty.map(
        (item) => item.collectingParty,
      );
      eChartsOption.value.series.data = datas.collectingParty.map(
        (item) => item.gatheringScale,
      );
      initECharts();
      nextTick(() => {
        handleResize();
      });
    } else {
      isEmptyData.value = true;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getTimeList();
});
function handleResize() {
  const pageWidth = document.querySelector("#table-box");
  const tableWidth = document.querySelector("#invite-tenders");
  isWidth.value = pageWidth.clientWidth >= tableWidth.clientWidth;
}
function handleScroll(e) {
  thTitle.value = e.target.scrollLeft;
}
window.addEventListener("resize", handleResize);
</script>

<style lang="scss" scoped>
@import "@/style";

.es-dataBusinessAnalysis-eCharts-box {
  @include widthAndHeight(1152px, 681px);
  @include relative();
}

#eChart-centralized {
  @include widthAndHeight(1152px, 340px);
  margin-top: 32px;
}

.es-centralized-btns {
  margin: 32px 0 16px 0;
  @include flex("center", "flex-start");
  flex-direction: row-reverse;
}
.table-box {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 16px;
  .invite-tenders {
    box-shadow: border-box;
    * {
      box-shadow: border-box;
    }

    th {
      border: 1px solid #dbdce2;
      &:first-child {
        border: none;
        position: relative;
        .tr-title {
          position: absolute;
          top: -0.5px;
          left: 0px;
          width: calc(100% + 1px);
          height: calc(100% + 1px);
          padding: 0 23px;
          background-color: #f2f3f5;
          border: 1px solid #dbdce2;
        }
      }
    }

    thead {
      tr {
        height: 38px;
        line-height: 38px;
        th {
          padding: 0 23px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          text-align: center;
          z-index: 1;

          &:first-child {
            z-index: 2;
            min-width: 182px;
            width: 186px;
            text-align: right;
            border-radius: 4px;
          }
        }
      }
    }
    tbody {
      tr {
        height: 38px;
        line-height: 38px;
        th {
          padding: 0 23px;
          position: relative;
          z-index: 1;

          &:first-child {
            z-index: 2;
            text-align: right;
            border-radius: 4px;
          }

          .th-content {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            .th-content-item {
              flex: 1;
              border-right: 1px solid #dbdce2;
              display: flex;
              align-items: center;
              justify-content: center;

              &:last-child {
                border-right: none;
              }
              img {
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
