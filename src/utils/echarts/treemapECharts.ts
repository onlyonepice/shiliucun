import { textStyleObject } from "./pieECharts";
import { chartWatermark } from "@/utils/echarts/eCharts";
export const EChartColor = [
  "rgba(36, 75, 241, 1)",
  "rgba(36, 75, 241, 0.8)",
  "rgba(36, 75, 241, 0.6)",
  "rgba(36, 75, 241, 0.4)",
  "rgba(36, 75, 241, 0.2)",
];
export function treemapEChartsOption() {
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
    legend: {
      x: "center",
      bottom: "0",
      textStyle: textStyleObject,
    },
    color: EChartColor,
    graphic: [chartWatermark],
    series: [
      {
        type: "treemap",
        top: "60",
        bottom: "40",
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        label: {
          position: "insideBottomLeft",
        },
        data: [],
      },
      {
        type: "pie",
        left: "2000%",
        data: [],
      },
    ],
  };
}