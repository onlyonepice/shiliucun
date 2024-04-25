/*
 * 地图Canvas
 */
export function EChartOptions() {
  return {
    title: {
      text: "",
      x: "center",
      top: "5%",
      textStyle: {
        fontSize: 18,
        lineHeight: 26,
        color: "#1C232F",
        fontWeight: "bolder",
      },
    },
    dataRange: {
      show: false,
      selectedMode: false,
      x: "left",
      y: "bottom",
      splitList: [],
    },
    // 平移和缩放
    roam: false,
    tooltip: {
      show: false,
      borderColor: "#fff",
    },

    series: [
      {
        name: "china",
        type: "map",
        map: "china",
        left: "15%", // 地图位置
        top: "25%", // 地图位置
        itemStyle: {
          borderColor: "#fff",
          borderBox: true,
          borderWidth: 2,
          borderType: "solid",
          areaColor: "#F1F2F6",
          left: "center",
          label: {
            show: true,
            formatter: "{b}\n{c}",
          },
        },
        // zoom: 1.2,
        label: {
          show: false,
          fontSize: 14,
          color: "#1C232F",
          left: "center",
          fontWeight: 400,
          lineHeight: 14,
          areaStyle: {
            color: "#F1F2F6", // 默认的地图板块颜色
          },
          formatter: (param) => {
            if (param.name && param.value)
              return `${param.name}\n${param.value}GW`;
            else return "";
          },
        },
        select: {
          disabled: false, //可以被选中
        },
        emphasis: {
          itemStyle: {
            areaColor: "#FFF2E5",
            shadowColor: "rgba(0, 0, 0, 0.4)",
            shadowBlur: 4,
            borderColor: "#FF7D00",
            borderWidth: 1,
          },
          label: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "bold",
            color: "#1C232F",
            formatter: (param) => {
              if (param.name && param.value)
                return `${param.name}\n${param.value}GW`;
              else return "";
            },
          },
        },
        scaleLimit: {
          min: 1,
          max: 6,
        },
        selectedMode: false,
        data: [],
      },
      {
        name: "right",
        type: "pie",
        radius: ["40%", "55%"],
        center: ["75%", "54%"],
        avoidLabelOverlap: false,
        label: {
          color: "rgba(0,0,0,0.6)",
          fontSize: 12,
          formatter: (param) => {
            return `${param.name}${param.percent.toFixed(1)}%`;
          },
        },
        data: [],
      },
    ],
  };
}
// 需要过滤的文字
export const charsToRemove = "市省自治区特别行政区回族壮族维吾尔";
export const RegionEnum = {
  北京市: "beijing",
  天津市: "tianjin",
  河北省: "hebei",
  山西省: "shanxi",
  内蒙古自治区: "neimenggu",
  辽宁省: "liaoning",
  吉林省: "jilin",
  黑龙江省: "heilongjiang",
  上海市: "shanghai",
  江苏省: "jiangsu",
  浙江省: "zhejiang",
  安徽省: "anhui",
  福建省: "fujian",
  江西省: "jiangxi",
  山东省: "shandong",
  河南省: "henan",
  湖北省: "hubei",
  湖南省: "hunan",
  广东省: "guangdong",
  广西壮族自治区: "guangxi",
  海南省: "hainan",
  重庆市: "chongqing",
  四川省: "sichuan",
  贵州省: "guizhou",
  云南省: "yunnan",
  西藏自治区: "xizang",
  陕西省: "shanxi1",
  甘肃省: "gansu",
  青海省: "qinghai",
  宁夏回族自治区: "ningxia",
  新疆维吾尔自治区: "xinjiang",
  香港特别行政区: "xianggang",
  澳门特别行政区: "aomen",
};

export default {
  EChartOptions,
  RegionEnum,
};
