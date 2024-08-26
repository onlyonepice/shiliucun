import { formatNumberWithTwoDecimals } from "@/utils/index";
export const ElectricityUsageEchartsOptions = () => {
  return {
    color: ["#01B82B", "#F75964", "#244BF1", "#FF892E", "#FFE1CB"],
    title: {
      show: false,
      text: ``,
      left: "center",
    },
    legend: {
      show: true,
      itemHeight: 8,
      itemWidth: 8,
      y: "bottom",
      x: "center",
      bottom: "20px",
      data: [
        {
          name: "充电",
          icon: "rect",
        },
        {
          name: "放电",
          icon: "rect",
        },
        {
          name: "安装储能前用电负荷",
          icon: "rect",
        },
        {
          name: "安装储能后用电负荷",
          icon: "rect",
        },
        {
          name: "安装储能后最大负荷",
          icon: "rect",
        },
      ],
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 0,
      axisPointer: {
        lineStyle: {
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        crossStyle: {
          color: "#D3DBFC",
        },
      },
      confine: true,
      className: "custom-tooltip",
      extraCssText: "padding: 16px; border-radius: 8px;",
      textStyle: {
        color: "#6d6d6d",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 24,
      },
    },
    grid: {
      left: "5%",
      right: "8%",
      bottom: "13%",
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: [
        "0h",
        "1h",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
        "20h",
        "21h",
        "22h",
        "23h",
      ],
      axisLine: {
        show: true,
        lineStyle: {
          color: "#919DB5",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: function (index, value) {
          if (index % 4 === 0 || value === "23h") {
            return value;
          } else {
            return "";
          }
        },
      },
    },
    yAxis: {
      type: "value",
      name: "kWh",
      nameTextStyle: {
        fontSize: 14,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#E5E6EA",
          width: 1,
        },
      },
    },
    series: [
      {
        name: "充电",
        type: "bar",
        stack: "Ad",
        yAxisIndex: 0,
        barWidth: 8,
        itemStyle: {
          color: "pink",
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        data: [],
        tooltip: {
          valueFormatter: (value) => formatNumberWithTwoDecimals(value) + "kWh",
        },
      },
      {
        name: "放电",
        type: "bar",
        stack: "Ad",
        yAxisIndex: 0,
        barWidth: 8,
        itemStyle: {
          color: "pink",
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        data: [],
        tooltip: {
          valueFormatter: (value) => formatNumberWithTwoDecimals(value) + "kWh",
        },
      },
      {
        name: "安装储能前用电负荷",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: [],
        tooltip: {
          valueFormatter: (value) => formatNumberWithTwoDecimals(value) + "kWh",
        },
      },
      {
        name: "安装储能后用电负荷",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: [],
        tooltip: {
          valueFormatter: (value) => formatNumberWithTwoDecimals(value) + "kWh",
        },
      },
      {
        name: "安装储能后最大负荷",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: [],
        markLine: {
          symbol: ["none", "none"], //去掉箭头
          lineStyle: {
            normal: {
              type: "dashed",
              color: "#FFE1CB", // 这儿设置安全基线颜色
            },
          },
          data: [
            {
              yAxis: 0,
            },
          ],
          label: {
            show: true,
            position: "insideStartBottom",
            color: "#FFE1CB",
          },
        },
      },
    ],
  };
};
