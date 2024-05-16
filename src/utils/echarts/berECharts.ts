export const EChartColor = ["rgba(36, 75, 241, 1)"];
import { chartWatermark } from "@/utils/echarts/eCharts";
export function berEChartsOption() {
  return {
    title: {
      left: "center",
      text: "",
      subtext: "",
      textStyle: {
        fontSize: 18,
        lineHeight: 26,
        color: "#1C232F",
        fontWeight: "bolder",
      },
    },
    label: {
      show: true,
      position: "top",
    },
    graphic: [chartWatermark],
    color: EChartColor,
    xAxis: {
      type: "category",
      data: ["nodeA", "nodeB"],
    },
    yAxis: {
      type: "value",
    },
    grid: {
      top: 60,
      bottom: 30,
    },
    series: {
      type: "bar",
      barWidth: 32,
      data: [10, 10],
    },
  };
}
