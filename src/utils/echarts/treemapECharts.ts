import { textStyleObject } from "./pieECharts";
import downloadBg from "@/assets/img/common/ECharts-bgc-two.png";
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
    graphic: [
      {
        type: "image",
        left: "center",
        bottom: "center",
        style: {
          image: downloadBg, // 图片的 URL
          width: 415, // 图片宽度
          height: 342, // 图片高度
        },
        z: 999,
      },
    ],
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
