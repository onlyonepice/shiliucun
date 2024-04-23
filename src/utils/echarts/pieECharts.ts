import { graphic, registerMap, getMap } from "echarts/core";
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
    grid: {
      top: "20%",
      left: "50",
      right: "3%",
      bottom: "10%",
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
