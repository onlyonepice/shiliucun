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
    // 图例设置
    legend: [
      {
        x: "center",
        bottom: "10",
        textStyle: textStyleObject,
      },
    ],
    color: [],
    tooltip: {},
    series: [],
  };
}
