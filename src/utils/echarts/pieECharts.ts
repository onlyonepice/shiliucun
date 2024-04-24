import { graphic, registerMap, getMap } from "echarts/core";

// 样式配置
export const textStyleObject = {
  fontSize: 14,
  lineHeight: 22,
  fontWeight: 400,
  color: "#5B6985",
};
export function pieEChartsOption() {
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
    xAxis: {
      type: "category",
      axisLabel: { interval: 0 }, // 不显示x轴的标签
      axisLine: {
        show: false,
      },
      // 坐标轴刻度
      axisTick: { show: false },
    },
    // grid: {
    //   top: "20%",
    //   left: "50",
    //   right: "3%",
    //   bottom: "10%",
    // },
    // 图例设置
    legend: [
      {
        x: "center",
        y: "95%",
        textStyle: textStyleObject,
      },
    ],
    color: [],
    tooltip: {},
    series: [],
  };
}
