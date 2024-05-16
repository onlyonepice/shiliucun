import { graphic, registerMap, getMap } from "echarts/core";
import downloadBg from "@/assets/img/common/ECharts-bgc.png";
export const chartWatermark = {
  type: "image",
  left: "center",
  bottom: "center",
  silent: true,
  style: {
    image: downloadBg,
    width: 415,
    height: 342,
  },
  z: 999,
};
export function eChartsOptionCommon() {
  return {
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
    graphic: [chartWatermark],
    grid: {
      top: "20%",
      left: "50",
      right: "3%",
      bottom: "10%",
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
      x: "center",
      y: "95%",
      show: true,
      bottom: "0",
      data: [],
    },
    color: [],
    tooltip: {},
    series: [],
  };
}

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
export const titleStyle = `line-height:22px; font-width: 400;font-weight: 600; font-size: 14px; color:#000;`;
export const titleStyleMini = `font-weight: 600; color:#000;`;
// tooltip正文文字样式
export const textStyle = `font-weight: 600; font-size: 14px; color:#000;`;
export const textStyleMini = `font-weight: 400; color:#000;`;
// tooltip的flex布局
export const flexStyle = `display: flex; align-items: center; justify-content: space-between;`;

// 样式配置
export const textStyleObject = {
  fontSize: 14,
  lineHeight: 22,
  fontWeight: 400,
  color: "#5B6985",
};

// 结构地图JSON数据
export function handleEChartsRegisterMap(getName, geoJson) {
  const maps = getMap(getName);
  if (maps) {
    return;
  }
  registerMap(getName, geoJson);
}

export const RegionEnum = {
  北京市: "beijing",
  天津市: "tianjin",
  河北省: "hebei",
  山西省: "shanxi",
  内蒙古自治区: "neimenggu",
  辽宁省: "liaoning",
  吉林省: "jilin",
  黑龙江省: "heilongjiang",
  上海市: "shanghai",
  江苏省: "jiangsu",
  浙江省: "zhejiang",
  安徽省: "anhui",
  福建省: "fujian",
  江西省: "jiangxi",
  山东省: "shandong",
  河南省: "henan",
  湖北省: "hubei",
  湖南省: "hunan",
  广东省: "guangdong",
  广西壮族自治区: "guangxi",
  海南省: "hainan",
  重庆市: "chongqing",
  四川省: "sichuan",
  贵州省: "guizhou",
  云南省: "yunnan",
  西藏自治区: "xizang",
  陕西省: "shanxi1",
  甘肃省: "gansu",
  青海省: "qinghai",
  宁夏回族自治区: "ningxia",
  新疆维吾尔自治区: "xinjiang",
  香港特别行政区: "xianggang",
  澳门特别行政区: "aomen",
};
