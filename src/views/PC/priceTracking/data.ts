export const eChartsOptionCommon = {
  title: {
    show: true,
    text: "月各省市代理购电价峰谷价差排名",
    left: "center",
    subtext: ""
  },
  tooltip: {
    trigger: "axis",
    borderWidth: 0,
    axisPointer: {
      type: "line",
      lineStyle: {
        shadowColor: "rgba(0, 0, 0, 0.5)"
      }
    },
    textStyle: {
      color: "#6d6d6d",
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 24
    },
    confine: true,
    className: "custom-tooltip",
    extraCssText: "padding: 16px; border-radius: 8px;"
  },
  dataZoom: [
    {
      type: "slider",
      show: true,
      startValue: 0,
      endValue: 32,
      xAxisIndex: [0],
      bottom: -25
    },
    {
      type: "inside",
      start: 0,
      end: 30,
      xAxisIndex: [0],
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true
    }
  ],
  grid: {
    top: "15%",
    left: "5%",
    right: "5%",
    bottom: "30%"
  },
  xAxis: {
    type: "category",
    data: ["上海市", "云南省",],
    axisLine: { show: true, lineStyle: { color: "#919DB5" } },
    axisTick: { show: false, interval: 0 },
    axisLabel: { show: true, rotate: 90, interval: 0 }
  },
  yAxis: {
    type: "value",
    name: "元/度",
    position: "left",
    alignTicks: true,
    nameTextStyle: { "fontSize": 14, "fontWeight": "600", "color": "#1D232E" },
    splitLine: { "show": true, "lineStyle": { "type": "dashed", "color": "#F2F3F5", "width": 1 } },
    // max: "0.00"
  },
  series: {
    type: "bar",
    yAxisIndex: 0,
    barWidth: 16,
    barGap: 36,
    data: [2, 10],
    itemStyle: { color: "#165DFF", borderRadius: [2, 2, 0, 0] }
  }
};