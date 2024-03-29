import { graphic } from "echarts/core";

export const eChartsOptionCommon = {
  // 设置标题
  title: {
    left: "center",
    text: "",
    textStyle: {
      fontSize: 18,
      lineHeight: 26,
      color: "#1C232F",
      fontWeight: "bolder",
    },
  },
  // 设置图标结构：默认为折线图
  axisPointer: { type: "line" },
  // 设置x轴信息
  // 'category' 类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据。
  xAxis: {
    name: "",
    type: "category",
    data: [],
    axisLabel: { interval: 0 }, // 不显示x轴的标签
    axisLine: {
      show: true,
      lineStyle: {
        fontSize: 14,
        lineHeight: 22,
        color: "#919DB5",
      },
    },
    // 坐标轴刻度
    axisTick: { show: false },
  },
  // 设置y轴信息
  yAxis: {
    name: "",
    type: "value",
    // 坐标轴在 grid 区域中的分隔线。
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#E5E6EA",
        width: 1,
      },
    },
  },
  // 图例设置
  legend: {
    show: true,
    bottom: "0",
    data: [],
  },
  color: [],
  tooltip: {},
  series: [],
};

export const eChartsOptionMobile = {
  // 设置标题
  title: {
    left: "center",
    text: "",
    textStyle: {
      fontSize: 14,
      lineHeight: 22,
      color: "rgba(0,0,0,0.9)",
      fontWeight: "bolder",
    },
  },
  // 设置图标结构：默认为折线图
  axisPointer: { type: "line" },
  // 设置x轴信息
  // 'category' 类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据。
  xAxis: {
    name: "",
    type: "category",
    data: [],
    axisLabel: { interval: 0 }, // 不显示x轴的标签
    axisLine: {
      show: true,
      lineStyle: {
        fontSize: 12,
        lineHeight: 20,
        color: "rgba(0,0,0,0.6)",
      },
    },
    // 坐标轴刻度
    axisTick: { show: false },
  },
  // 设置y轴信息
  yAxis: {
    name: "",
    type: "value",
    // 坐标轴在 grid 区域中的分隔线。
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#E5E6EA",
        width: 1,
      },
    },
  },
  // 图例设置
  legend: {
    show: true,
    bottom: "0",
    data: [],
  },
  color: [],
  tooltip: {},
  series: [],
};

// 获取置顶颜色透明度
const colorRgbReg =
  /^(rgb|RGB|rgba|RGBA)\((\d+),\s*(\d+),\s*(\d+)(,\s*)?(\d+)?\)$/;
export function getColorTransparent(color: string, count = 1) {
  return color.replace(
    colorRgbReg,
    ($1, $2, $3, $4, $5) => `rgba(${$3}, ${$4}, ${$5}, ${count})`,
  );
}

// 计算出颜色数值
export const computedColor = (lineColor: string) => {
  return new graphic.LinearGradient(
    0,
    0,
    0,
    1,
    [
      {
        offset: 0,
        color: getColorTransparent(lineColor, 0.15),
      },
      {
        offset: 1,
        color: getColorTransparent(lineColor, 0),
      },
    ],
    false,
  );
};

// tooltip标题样式
export const titleStyle = `line-height:24px; font-width: 400;font-weight: 600; font-size: 16px; color:#000;`;
export const titleStyleMini = `font-weight: 600; color:#000;`;
// tooltip正文文字样式
export const textStyle = `font-weight: 600; font-size: 16px; color:#000;`;
export const textStyleMini = `font-weight: 400; color:#000;`;
// tooltip的flex布局
export const flexStyle = `display: flex; align-items: center; justify-content: space-between;`;
