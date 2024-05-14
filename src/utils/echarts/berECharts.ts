export const EChartColor = ["rgba(36, 75, 241, 1)"];
import downloadBg from "@/assets/img/common/ECharts-bgc.png";
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
