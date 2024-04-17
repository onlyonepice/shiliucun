// tooltip标题样式
export const titleStyle = `line-height:24px; font-width: 400;font-weight: 600; font-size: 12px; color:#000;`;
// tooltip正文文字样式
export const textStyle = `font-weight: 600; font-size: 12px; color:#000;`;
// tooltip的flex布局
export const flexStyle = `display: flex; align-items: center; justify-content: space-between;`;

export const eChartsOptionCommon = () => {
  return {
    color: ["#244BF1", "#FF892E"],
    // 图例设置
    legend: {
      data: [
        {
          icon: null,
          name: "单一制电价",
        },
        {
          icon: null,
          name: "环比变化",
        },
      ],
      bottom: "10",
    },
    title: {
      show: true,
      text: "月各省市代理购电价峰谷价差排名",
      left: "center",
      subtext: "",
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        startValue: 0,
        endValue: 32,
        xAxisIndex: [0],
        bottom: -25,
      },
      {
        type: "inside",
        start: 0,
        end: 30,
        xAxisIndex: [0],
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
      },
    ],
    grid: {
      top: "15%",
      left: "5%",
      right: "5%",
      bottom: "30%",
    },
    xAxis: {
      type: "category",
      data: ["上海市", "云南省"],
      axisLine: { show: true, lineStyle: { color: "#919DB5" } },
      axisTick: { show: false, interval: 0 },
      axisLabel: { show: true, rotate: 90, interval: 0 },
    },
    yAxis: [
      {
        type: "value",
        name: "元/度",
        position: "left",
        alignTicks: true,
        nameTextStyle: { fontSize: 14, fontWeight: "600", color: "#1D232E" },
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: "#F2F3F5", width: 1 },
        },
      },
      {
        axisLabel: {
          formatter: "{value} %", // 设置轴标签格式化字符串
        },
        type: "value", // 右边的 y 轴
      },
    ],
    series: [
      {
        type: "bar",
        name: "单一制电价",
        yAxisIndex: 0,
        barWidth: 16,
        barGap: 36,
        data: [],
        itemStyle: { borderRadius: [2, 2, 0, 0] },
      },
      {
        type: "line",
        name: "环比变化",
        data: [],
        yAxisIndex: 1,
      },
    ],
  };
};
