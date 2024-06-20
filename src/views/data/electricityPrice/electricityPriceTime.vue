<template>
  <div
    id="time-electricity-price"
    class="es-commonPage time-electricity-price page"
  >
    <div
      :class="
        isSpecialRegion && specialVoltageLevel.length <= 0
          ? 'filter-active'
          : 'filter'
      "
    >
      <Select
        @on-change="changeRegion"
        title="地区"
        @triggerForm="handleTriggerForm"
        :options="regionalData"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="searchParams.regionName"
      />
      <Select
        v-if="!isSpecialRegion"
        @on-change="changeElectricityTypeOne"
        title="用电类型 I"
        @triggerForm="handleTriggerForm"
        :options="electricityType1"
        valueKey="paramName"
        labelKey="paramDesc"
        :defaultValue="searchParams.electricityTypeOneName"
      />
      <Select
        v-if="!isSpecialRegion"
        @on-change="changeElectricityTypeTwo"
        title="用电类型Ⅱ"
        @triggerForm="handleTriggerForm"
        :options="electricityType2"
        valueKey="paramName"
        labelKey="paramDesc"
        :defaultValue="searchParams.electricityTypeTwoName"
      />
      <Select
        v-if="!isSpecialRegion"
        @on-change="changeVoltageLevel"
        :options="voltageLevelData"
        valueKey="paramName"
        @triggerForm="handleTriggerForm"
        labelKey="paramDesc"
        :defaultValue="searchParams.tariffLevelId"
        title="电压等级"
      />
      <!-- 特殊地区特定筛选 深圳 -->
      <Select
        v-if="isSpecialRegion"
        @on-change="changeSpecialElectricityType"
        title="用电类型"
        @triggerForm="handleTriggerForm"
        :options="specialElectricityType"
        valueKey="paramName"
        labelKey="paramDesc"
        :defaultValue="searchParams.electricityTypeOneName"
      />
      <Select
        v-if="isSpecialRegion && specialVoltageLevel.length > 0"
        @on-change="changeSpecialVoltageLevel"
        type="cascader"
        title="电压等级"
        @triggerForm="handleTriggerForm"
        :options="specialVoltageLevel"
        :defaultValue="searchParams.tariffLevelId"
        :cascaderOption="cascaderOption"
        :showAllLevels="false"
      />
    </div>
    <div class="flex small-price-type">
      <div class="price-type">
        <div
          class="price-type__item"
          :class="{ 'price-type__item-chose': choseSpecific === item.id }"
          v-for="item in specificList"
          :key="item.id"
          @click="handleSelectPriceType(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="export-image" @click="exportResult">导出图片</div>
    </div>
    <Select
      @on-change="changeMonth"
      :options="monthData"
      :default-value="monthVal"
      valueKey="paramName"
      labelKey="paramDesc"
      @triggerForm="handleTriggerForm"
      v-if="choseSpecific === 1"
      title="月份选择"
      width="28%"
    />
    <div v-if="choseSpecific !== 1 && monthData.length" class="month-range">
      <div class="month-range-title">时间范围</div>
      <el-date-picker
        v-model="monthRange"
        type="monthrange"
        :clearable="false"
        range-separator="-"
        value-format="YYYY-MM"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :disabled-date="disabledDate"
        @change="handleMonthRangeChange"
        @visible-change="handleTriggerForm"
      />
    </div>
    <div v-loading="loading" id="my-chart_electricity-price" ref="myeCharts" />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import {
  textStyle,
  flexStyle,
  titleStyle,
  computedColor,
  eChartsOptionCommon,
} from "@/utils/echarts/eCharts";
import {
  getTimePrice,
  getMonthPrice,
  getMonthByTime,
  getElectricityType,
  getMonthDifference,
  getDischargeStrategy,
  querySpecialRegionIdsApi,
  electricityTypeVoltageLevelApi,
} from "@/api/priceTracking";
import * as echarts from "echarts";
import { onMounted, computed, Ref, ref, onBeforeUnmount } from "vue";
import { cloneDeep, toNumber } from "lodash";
import { vLoading } from "element-plus";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";

import math from "@/utils/math";

import image from "@/assets/img/electricityPrice/icon_hint_nor.png";
import Select from "@/components/Common/Select.vue";
import ExportCanvasDialog from "@/components/Business/ExportCanvasDialog.vue";

const monthRange = ref<any>(["", ""]);
const eChartsOption: Ref<any> = ref({
  ...cloneDeep(eChartsOptionCommon()),
  title: [
    // 这里需要用到多个标题
    {
      left: "center",
      text: "",
      textStyle: {
        fontSize: 18,
        lineHeight: 26,
        color: "#1C232F",
        fontWeight: "bolder",
      },
    },
  ],
  yAxis: {
    name: "元/度",
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#E5E6EA",
        width: 1,
      },
    },
  },
});

const specificList: Ref<Array<{ id: number; text: string }>> = ref([
  { id: 1, text: "分时电价" },
  { id: 2, text: "分月电价" },
  { id: 3, text: "峰谷价差" },
]);
const loading = ref(false);
// 获取echarts节点
const myeCharts = ref<any>(null);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const choseSpecific: Ref<number> = ref(1);
const monthData = ref<any>([]);
const timeFrame = ref({ start: null, end: null });
const regionalData = ref<any>([]); // 城市数据
const isSpecialRegion = ref(false); // 是否是特殊地区(例：深圳)
const electricityType1 = ref<any>([]); // 用电类型1数组
const electricityType2 = ref<any>([]); // 用电类型2数组
const voltageLevelData = ref<any>([]); // 电压等级
const cascaderOption: any = ref({
  value: "paramName",
  label: "paramDesc",
  children: "children",
  expandTrigger: "hover",
});
const dataTemplate = ref([]); // 特殊地区用电类型、电压等级数据
const specialElectricityType = ref<any>([]); // 特殊地区 用电类型数组
const specialVoltageLevel = ref<any>([]); // 特殊地区 电压等级数组
// 用作展示tip时的判断
const timeEchartsData = ref<any>([]);

// 筛选项搜索结果
const searchParams = ref({
  regionName: "",
  tariffLevelId: "",
  electricityTypeOneName: "",
  electricityTypeTwoName: "",
});

// 月份
const monthVal = ref("");

// 策略
const dischargeStrategyData = ref<string>("");

// 数据
const timeElectricityPriceData = ref<any>([]); // 分时电价数据
const monthPriceDifferenceData = ref<any>({}); // 峰谷价差数据
const monthElectricityPriceData = ref<any>([]); // 分时电价数据
//
const electricityPrice = ref(null);
// 导出图片
const exportResult = () => {
  const _echarts = echarts.getInstanceByDom(myeCharts.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportImgTitle.value = "储能月度招标分析";
  exportVisible.value = true;
};

const titleTwo = computed(() => {
  const width: number = document.getElementById("time-electricity-price")
    ?.offsetWidth as number;
  const singleLineQuantity = Math.round(
    (width - Math.round((width / 40) * 2)) / 14,
  );
  return {
    // 标题组件
    text:
      "{a|}" +
      dischargeStrategyData.value.replace(
        new RegExp(`(.{${singleLineQuantity}})`, "g"),
        `$1\n`,
      ),
    left: "center",
    top: 415,
    textStyle: {
      fontSize: 12,
      lineHeight: 18,
      width: 300,
      fontWeight: 400,
      color: "#565656",
      fontFamily: "Microsoft YaHei",
      rich: {
        a: {
          color: "#F00", // 设置 动态数据字体的颜色
          fontSize: "12", // 设置 动态数据字体的大小
          height: 18,
          width: 18,
          backgroundColor: { image: image },
          align: "center", // 设置水平方向上居中对齐
          verticalAlign: "middle", // 设置垂直方向上居中对齐
        },
      },
    },
  };
});

const titleText = computed(() => {
  const obj = {
    regionName: "",
    electricityTypeOneName: "",
    electricityTypeTwoName: "",
    tariffLevelId: "",
    monthVal: "",

    specialElectricityTypeName: "",
    specialVoltageLevelId: "",
    specialSubVoltageLevelId: "",
  };
  obj.tariffLevelId = voltageLevelData.value.find(
    (item) => item.paramName === searchParams.value.tariffLevelId,
  )?.paramDesc;
  obj.regionName = regionalData.value.find(
    (item) => item.regionName === searchParams.value.regionName,
  )?.regionName;
  obj.electricityTypeOneName = electricityType1.value.find(
    (item) => item.paramName === searchParams.value.electricityTypeOneName,
  )?.paramDesc;
  obj.electricityTypeTwoName = electricityType2.value.find(
    (item) => item.paramName === searchParams.value.electricityTypeTwoName,
  )?.paramDesc;
  obj.monthVal = monthData.value.find(
    (item) => item.paramName === monthVal.value,
  )?.paramDesc;

  obj.specialElectricityTypeName = specialElectricityType.value.find(
    (item) => item.paramName === searchParams.value.electricityTypeOneName,
  )?.paramDesc;

  // 特殊地区 用电类型-电压等级1-电压等级2
  const subVoltageId =
    typeof searchParams.value.tariffLevelId === "object" &&
    searchParams.value.tariffLevelId
      ? searchParams.value.tariffLevelId[1]
      : searchParams.value.tariffLevelId;
  let subVoltage = [];
  specialVoltageLevel.value.forEach((item) => {
    item.children?.forEach((child) => {
      if (child.paramName === searchParams.value.tariffLevelId) {
        obj.specialVoltageLevelId = item.paramDesc;
        subVoltage = item.children;
      }
    });
  });
  obj.specialSubVoltageLevelId = subVoltage.find(
    (item) => item.paramName === subVoltageId,
  )?.paramDesc;

  return obj;
});

function handleSelectPriceType(id) {
  choseSpecific.value = id;
  clearEchart();
  if (choseSpecific.value === 1) handleTOUData();
  else if (choseSpecific.value === 2) handleMonthData();
  else handlePriceDifferenceData();
}
/* 
  getData
*/
// 获取放电策略
async function getDischargeStrategyData() {
  try {
    const { datas } = await getDischargeStrategy({
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
      region: searchParams.value.regionName,
    });
    dischargeStrategyData.value = datas.chargeDischargeStrategy[
      searchParams.value.electricityTypeTwoName
    ]
      ?.replace(/\n/g, "")
      .replace(/\r/g, "");
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取地区数据
const onGetRegionalData = async () => {
  querySpecialRegionIdsApi(null)
    .then((res: any) => {
      regionalData.value = res.datas.filter(
        (item) =>
          !item.regionName.includes("(") &&
          !item.regionName.includes("（") &&
          !item.regionName.includes(")") &&
          !item.regionName.includes("）"),
      );
      // 默认获取到浙江省
      searchParams.value.regionName = res.datas[0].regionName;
      res.datas.forEach((item) => {
        if (item.regionName === searchParams.value.regionName) {
          electricityType1.value = item.reInvestmentElectricityType;
          searchParams.value.electricityTypeOneName =
            item.reInvestmentElectricityType[0].paramName;
        }
      });
      getElectricityTypeTwo();
    })
    .catch((error) => {
      console.error(error);
      loading.value = false;
    });
};

// 获取用电类型2数据
async function getElectricityTypeTwo() {
  try {
    const { datas } = await getElectricityType({
      regionName: searchParams.value.regionName,
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
    });
    electricityType2.value = datas;
    searchParams.value.electricityTypeTwoName = datas[0].paramName;
    // 通过用电类型2获取到电压等级
    voltageLevelData.value = datas[0].voltageLevel;
    searchParams.value.tariffLevelId = datas[0].voltageLevel[0].paramName;
    getDischargeStrategyData();
    getMonthByTimes();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

/**
 * getMonthPriceData 获取分月电价
 * getMonthByTimes 先获取月份 通过月份获取到分时电价
 * getMonthPriceData 获取峰谷价差
 */

// 获取月份
async function getMonthByTimes() {
  try {
    if (isSpecialRegion.value) {
      searchParams.value.electricityTypeTwoName = "";
      const tariffLevelId = searchParams.value.tariffLevelId;
      searchParams.value.tariffLevelId =
        typeof tariffLevelId === "object" && tariffLevelId
          ? tariffLevelId[1]
          : tariffLevelId;
      if (searchParams.value.electricityTypeOneName === "C") {
        searchParams.value.tariffLevelId = "";
      }
    }
    const requestData = searchParams.value;
    const { datas } = await getMonthByTime({ ...requestData });
    monthData.value = datas;
    monthRange.value = [
      datas.length >= 12
        ? dayjs(getTimeStamp(datas[datas.length - 12].paramName)).format(
            "YYYY-MM",
          )
        : dayjs(getTimeStamp(datas[0].paramName)).format("YYYY-MM"),
      dayjs(getTimeStamp(datas[datas.length - 1].paramName)).format("YYYY-MM"),
    ];
    timeFrame.value.start = getTimeStamp(datas[0].paramName);
    timeFrame.value.end = getTimeStamp(datas[datas.length - 1].paramName);
    monthVal.value = datas[datas.length - 1].paramName;
    getTOUData();
    getMonthPriceData();
    getMonthDifferenceData();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}
const filterRegion = (val) => {
  let res = false;
  regionalData.value.forEach((regionItem) => {
    if (val === regionItem.regionName) {
      if (regionItem.special == "1") {
        res = true;
      } else {
        res = false;
      }
    }
  });
  return res;
};
const getSpecialRegionOption = async () => {
  specialElectricityType.value = [];
  specialVoltageLevel.value = [];
  const { resp_code, datas } = await electricityTypeVoltageLevelApi({
    regionName: searchParams.value.regionName,
  });
  if (resp_code === 0) {
    dataTemplate.value = datas;
    dataTemplate.value.forEach((item) => {
      specialElectricityType.value.push(item);
      searchParams.value.electricityTypeOneName =
        specialElectricityType.value[0].paramName;
      specialVoltageLevel.value = specialElectricityType.value[0].children;
      if (specialVoltageLevel.value.length > 0) {
        searchParams.value.tariffLevelId =
          specialVoltageLevel.value[0].children[0].paramName;
      }
    });
  }
  getMonthByTimes();
};
/* change */
// 地区 change
function changeRegion(val) {
  const regionStatus = filterRegion(val);
  if (!regionStatus) {
    isSpecialRegion.value = false;
    searchParams.value.regionName = val;
    if (!getToken()) {
      return handleOpenLogin();
    }
    loading.value = true;
    // 获取到用电类型1
    const data = regionalData.value.find(
      (item) => item.regionName === val,
    )?.reInvestmentElectricityType;
    electricityType1.value = data;
    searchParams.value.electricityTypeOneName = data[0].paramName;
    getElectricityTypeTwo();
  } else {
    searchParams.value.regionName = val;
    searchParams.value.electricityTypeOneName = "";
    if (!getToken()) {
      return handleOpenLogin();
    }
    getSpecialRegionOption();
    isSpecialRegion.value = true;
    loading.value = true;
  }
}

// 特殊地区 用电类型 change
const changeSpecialElectricityType = (val) => {
  searchParams.value.electricityTypeOneName = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;

  dataTemplate.value.forEach((item) => {
    if (val === item.paramName) {
      specialVoltageLevel.value = item.children || [];
      if (specialVoltageLevel.value.length > 0) {
        searchParams.value.tariffLevelId =
          specialVoltageLevel.value[0].children[0].paramName;
      }
    }
  });
  getMonthByTimes();
};

// 特殊地区 电压等级 change
const changeSpecialVoltageLevel = (val) => {
  searchParams.value.tariffLevelId = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;
  getMonthByTimes();
};

// 用电类型1 change
function changeElectricityTypeOne(val) {
  searchParams.value.electricityTypeOneName = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;
  getElectricityTypeTwo();
}

// 用电类型2 change
function changeElectricityTypeTwo(val) {
  searchParams.value.electricityTypeTwoName = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;
  const data = electricityType2.value.find(
    (item) => item.paramName === val,
  )?.voltageLevel;
  voltageLevelData.value = data;
  searchParams.value.tariffLevelId = data[0].paramName;
  getDischargeStrategyData();
  getMonthByTimes();
}

// 月份 change
function changeMonth(val) {
  monthVal.value = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;
  getTOUData();
}

// 电压等级 change
function changeVoltageLevel(val) {
  searchParams.value.tariffLevelId = val;
  if (!getToken()) {
    return handleOpenLogin();
  }
  loading.value = true;
  getMonthByTimes();
}
// 时间范围 change
function handleMonthRangeChange() {
  if (!getToken()) {
    return handleOpenLogin();
  }
  getMonthPriceData();
  getMonthDifferenceData();
}

// 获取echarts子标题
const getSubTitle = () => {
  let subtitle = "";
  if (isSpecialRegion.value) {
    const voltagePart = titleText.value.specialVoltageLevelId
      ? `·${titleText.value.specialElectricityTypeName}·${titleText.value.specialVoltageLevelId}·${titleText.value.specialSubVoltageLevelId}`
      : `${isSpecialRegion.value ? `·${titleText.value.specialElectricityTypeName}` : ""}`;

    const defaultPart = isSpecialRegion.value
      ? ""
      : `·${titleText.value.electricityTypeOneName}·${titleText.value.electricityTypeTwoName}·${titleText.value.tariffLevelId}`;

    subtitle = `${voltagePart}${defaultPart}`;
  } else {
    subtitle = `·${titleText.value.electricityTypeOneName}·${titleText.value.electricityTypeTwoName}·${titleText.value.tariffLevelId}`;
  }
  return subtitle;
};

// 处理分时电价图表
function handleTOUData() {
  try {
    let newData: any = [];
    const _defaultData: any = [
      {
        name: "尖峰时段",
        periodType: "topTime",
        lineColor: "rgba(245,63,63,1)",
        data: [],
      },
      {
        name: "高峰时段",
        periodType: "highTime",
        lineColor: "rgba(255,125,0,1)",
        data: [],
      },
      {
        name: "平时时段",
        periodType: "flatTime",
        lineColor: "rgba(255,207,29,1)",
        data: [],
      },
      {
        name: "低谷时段",
        periodType: "lowTime",
        lineColor: "rgba(80,177,66,1)",
        data: [],
      },
      {
        name: "深谷时段",
        periodType: "deepTime",
        lineColor: "rgba(167,102,244,1)",
        data: [],
      },
    ];
    // 处理数据
    const xAxisData: any = [];
    timeElectricityPriceData.value.forEach((item) => {
      const eachTimePeriod = Array(
        timeToMinutes(item.endTime) - timeToMinutes(item.startTime),
      ).fill({ ...item });
      eachTimePeriod.forEach((item: any, index) => {
        const label = {
          align: "left",
          show: index !== eachTimePeriod.length - 1,
          color: "#1C232F",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 22,
          offset: [0, 4],
          position: "top",
        };
        if (xAxisData.length === 0) {
          xAxisData.push(item.startTime);
        } else if (index === eachTimePeriod.length - 1) {
          xAxisData.push(item.endTime);
        } else {
          xAxisData.push("");
        }
        _defaultData.forEach((_item) => {
          if (item.periodType === _item.periodType) {
            const startData = {
              value: item.electrovalence.toFixed(4),
              label: label,
              symbol: "circle",
              symbolSize: 8,
              symbolKeepAspect: true,
              itemStyle: {
                color: "#fff", // 设置背景色为白色
                borderWidth: 2, // 边框宽度
                borderColor: _item.lineColor, // 边框颜色为白色
              },
            };
            const noneData = {
              value: item.electrovalence.toFixed(4),
              label: label,
              symbol: "none",
            };
            index === 0
              ? _item.data.push(startData)
              : index === eachTimePeriod.length - 1
                ? _item.data.push(startData)
                : _item.data.push(noneData);
          } else {
            _item.data.push({
              value: "-",
              label: { ...label, show: false },
              symbol: index === 0 ? "circle" : "none",
            });
          }
        });
      });
      newData = [...newData, ...eachTimePeriod];
    });
    timeEchartsData.value = newData;
    let _series: any = [];
    let _color: any = [];
    let _data: any = [];
    const title = `${titleText.value.regionName}代理工商业购电分时电价图`;
    const subtitle = getSubTitle();
    _defaultData.forEach((item) => {
      if (!item.data.every((item) => item.value === "-")) {
        _series.push({
          type: "line",
          name: item.name,
          data: item.data,
          areaStyle: { color: computedColor(item.lineColor) },
        });
        _color.push(item.lineColor);
        _data.push({
          icon: "roundRect",
          name: item.name,
          textStyle: { color: "#5B6985" },
        });
      }
    });
    const options = cloneDeep(eChartsOption.value);
    electricityPrice.value.demandElectricityPrice !== 0 &&
      options.graphic.push({
        type: "group",
        right: 0,
        top: "0",
        children: [
          {
            type: "rect",
            shape: {
              width: 190,
              height: 70,
              r: 4,
            },
            style: {
              fill: "#F2F3F5",
              stroke: "#eee",
              lineWidth: 2,
              radius: 10,
            },
          },
          {
            type: "text",
            left: 16,
            top: 16,
            style: {
              text: `需量电价：${electricityPrice.value.demandElectricityPrice}元/千瓦·月`,
              font: "14px Arial",
              fill: "#000",
            },
          },
          {
            type: "text",
            left: 16,
            top: 40,
            style: {
              text: `容量电价：${electricityPrice.value.capacityElectricityPrice}元/千伏安·月`,
              font: "14px Arial",
              fill: "#000",
            },
          },
        ],
      });
    options.title[0].text = title;
    options.title[0].subtext = subtitle;
    options.title[1] = titleTwo.value;
    options.grid = { bottom: "150", top: "80" };
    options.legend = {
      ...options.legend,
      y: "78%",
      data: _data.map((item) => {
        return { ...item, icon: null };
      }),
    };
    options.xAxis = {
      data: xAxisData,
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        interval: function (index, value) {
          return value === "" ? false : true;
        },
      },
    };
    options.color = _color;
    options.series = _series;
    options.tooltip = {
      trigger: "axis",
      axisPointer: { type: "line" },
      formatter: (params) => {
        let index = 0;
        let contentText = "";
        params.forEach((item) => {
          if (item.value !== "-") {
            index = item.dataIndex;
            contentText =
              contentText +
              `<div style="${flexStyle}">
            <div style='width: 150px;'>
              ${item.marker}
              <span style="${textStyle}">${item.seriesName}</span>
            </div>
            <span style="${textStyle}">${item.value}</span>
          </div>`;
          }
        });
        const { endTime, startTime } = timeEchartsData.value[index];
        return `<div style="${titleStyle}">${startTime}-${endTime}</div>${contentText}`;
      },
    };
    clearEchart();
    const myChart = echarts.init(
      document.getElementById("my-chart_electricity-price") as any,
    );
    if (myChart) {
      myChart && myChart.setOption(options);
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

// 处理分月电价图表
function handleMonthData() {
  let averageElectricityPrice: Array<{
    label: string;
    value: number;
    periodType?: string;
    number?: number;
  }> = [
    { label: "平均尖峰电价：", periodType: "topTime", value: 0, number: 0 },
    { label: "平均高峰电价：", periodType: "highTime", value: 0, number: 0 },
    { label: "平均平时电价：", periodType: "flatTime", value: 0, number: 0 },
    { label: "平均低谷电价：", periodType: "lowTime", value: 0, number: 0 },
    { label: "平均深谷电价：", periodType: "deepTime", value: 0, number: 0 },
  ];
  averageElectricityPrice;
  const _defaultData: any = [
    {
      name: "尖峰时段",
      periodType: "topTime",
      lineColor: "rgba(245,63,63,1)",
      data: [],
    },
    {
      name: "高峰时段",
      periodType: "highTime",
      lineColor: "rgba(255,125,0,1)",
      data: [],
    },
    {
      name: "平时时段",
      periodType: "flatTime",
      lineColor: "rgba(255,207,29,1)",
      data: [],
    },
    {
      name: "低谷时段",
      periodType: "lowTime",
      lineColor: "rgba(80,177,66,1)",
      data: [],
    },
    {
      name: "深谷时段",
      periodType: "deepTime",
      lineColor: "rgba(167,102,244,1)",
      data: [],
    },
  ];

  let arbitrageSpace: Array<number> = []; // 度电套利空间
  const xAxisData: any = []; // x轴数据
  monthElectricityPriceData.value.forEach((item) => {
    xAxisData.push(item.month);

    // 计算平均电价
    averageElectricityPrice.forEach((_item) => {
      if (!isNaN(toNumber(item.data[_item.periodType]))) {
        _item.value = math.add(
          toNumber(_item.value),
          toNumber(item.data[_item.periodType]),
        );
        _item.number += 1;
      }
    });
    // 计算套利空间
    const numbers: Array<number> = Object.values(item.data)
      .map((num: string) => {
        return Number(num);
      })
      .filter((num: number) => {
        return !isNaN(num);
      })
      .sort((a, b) => a - b);
    arbitrageSpace.push(
      math.subtract(
        toNumber(numbers[numbers.length - 1]),
        toNumber(numbers[0]),
      ),
    );
    for (const key in item.data) {
      _defaultData.forEach((_item) => {
        if (_item.periodType === key) {
          _item.data.push(
            item.data[key] === "-" ? "-" : toNumber(item.data[key]).toFixed(4),
          );
        }
      });
    }
  });
  averageElectricityPrice = averageElectricityPrice
    .filter((item) => item.value && item.number)
    .map((item) => {
      return {
        label: item.label,
        value: (item.value = math.divide(item.value, item.number)),
      };
    });

  let _series: any = [];
  let _data: any = [];
  let _color: any = [];
  const title = `${titleText.value.regionName}代理工商业购电分月电价图`;
  const subtitle = getSubTitle();
  _defaultData.forEach((item) => {
    if (item.data.some((item) => item !== "-")) {
      _series.push({
        type: "line",
        name: item.name,
        data: item.data,
        areaStyle: { color: computedColor(item.lineColor) },
      });
      _color.push(item.lineColor);
      _data.push({
        icon: null,
        name: item.name,
        textStyle: { color: "#5B6985" },
      });
    }
  });
  _data.push({
    icon: null,
    name: "度电套利空间",
    textStyle: { color: "#5B6985" },
  });
  _series.push({
    type: "line",
    name: "度电套利空间",
    color: "#ADB0C2",
    lineStyle: {
      type: "dashed",
    },
    data: arbitrageSpace,
  });
  // 添加矩形 平均尖峰电价

  const graphicChildren = [];
  const padding = 16;
  const fontLineHeight = 24;
  const fontSize = 14;
  averageElectricityPrice.forEach((item, index) => {
    graphicChildren.push({
      type: "text",
      left: padding,
      top: padding + fontLineHeight * index,
      style: {
        text: `${item.label}${item.value.toFixed(2)}元/度`,
        font: `${fontSize}px Arial`,
        fill: "#000",
      },
    });
  });
  const box = {
    type: "rect",
    shape: {
      width: 190,
      height:
        padding * 2 + (graphicChildren.length - 1) * fontLineHeight + fontSize,
      r: 4,
    },
    style: {
      fill: "#F2F3F5",
      stroke: "#eee",
      lineWidth: 2,
      radius: 10,
    },
  };
  const options = cloneDeep(eChartsOption.value);
  options.graphic.push({
    type: "group",
    left: 0,
    top: "20%",
    children: [box, ...graphicChildren],
  });
  options.title[0].text = title;
  options.title[0].subtext = subtitle;
  options.title[1] = titleTwo.value;
  options.legend = { ...options.legend, y: "78%", data: _data };
  options.grid = { bottom: "150", top: "80", left: "250" };
  options.color = _color;
  options.xAxis = {
    ...options.xAxis,
    data: [...xAxisData],
    axisLabel: {
      interval: xAxisData.length > 14 ? 1 : 0,
    },
  };
  options.series = _series;
  options.tooltip = {
    trigger: "axis",
    axisPointer: { type: "line" },
    formatter: (params) => {
      let contentText = "";
      params.forEach((item) => {
        contentText =
          item.value === "-"
            ? contentText
            : contentText +
              `<div style="${flexStyle}">
          <div style='width: 150px;'>
            ${item.marker}
            <span style="${textStyle}">${item.seriesName}</span>
          </div>
          <span style="${textStyle}">${item.value}</span>
        </div>`;
      });
      return `<div style="${titleStyle}">${params[0].name}</div>${contentText}`;
    },
  };
  clearEchart();
  const myChart = echarts.init(
    document.getElementById("my-chart_electricity-price") as any,
  );
  myChart.setOption(options);
  loading.value = false;
}

// 处理峰谷价差图表
function handlePriceDifferenceData() {
  const _defaultData: any = [
    {
      name: "尖峰低谷价差",
      periodType: "sharpDifference",
      lineColor: "rgba(245,63,63,1)",
      data: [],
    },
    {
      name: "高峰低谷价差",
      periodType: "heightDifference",
      lineColor: "rgba(255,125,0,1)",
      data: [],
    },
    {
      name: "尖峰平时价差",
      periodType: "sharpAdjustment",
      lineColor: "rgba(255,207,29,1)",
      data: [],
    },
    {
      name: "高峰平时价差",
      periodType: "altitudeBalance",
      lineColor: "rgba(80,177,66,1)",
      data: [],
    },
  ];
  const xAxisData: any = [];
  monthPriceDifferenceData.value.forEach((item) => {
    xAxisData.push(item.month);
    for (const key in item.data) {
      _defaultData.forEach((_item) => {
        if (_item.periodType === key) {
          _item.data.push(
            item.data[key] === "-" ? "-" : toNumber(item.data[key]).toFixed(4),
          );
        }
      });
    }
  });
  let _series: any = [];
  let _color: any = [];
  let _data: any = [];
  const title = `${titleText.value.regionName}代理工商业购电峰谷价差`;
  const subtitle = getSubTitle();
  _defaultData.forEach((item) => {
    if (item.data.some((item) => item !== "-")) {
      _series.push({
        type: "line",
        name: item.name,
        data: item.data,
        areaStyle: { color: computedColor(item.lineColor) },
      });
      _color.push(item.lineColor);
      _data.push({
        icon: "roundRect",
        name: item.name,
        textStyle: { color: "#5B6985" },
      });
    }
  });
  const options = cloneDeep(eChartsOption.value);
  options.title[0].text = title;
  options.title[0].subtext = subtitle;
  options.grid = { bottom: "80", top: "80" };
  options.legend = { ...options.legend, data: _data };
  options.color = _color;
  options.xAxis = {
    ...options.xAxis,
    data: xAxisData,
    axisLabel: {
      interval: xAxisData.length > 14 ? 1 : 0,
    },
  };
  options.series = _series;
  options.tooltip = {
    trigger: "axis",
    axisPointer: { type: "line" },
    formatter: (params) => {
      let contentText = "";
      params.forEach((item) => {
        contentText =
          item.value === "-"
            ? contentText
            : contentText +
              `<div style="${flexStyle}">
          <div style='width: 150px;'>
            ${item.marker}
            <span style="${textStyle}">${item.seriesName}</span>
          </div>
          <span style="${textStyle}">${item.value}</span>
        </div>`;
      });
      return `<div style="${titleStyle}">${params[0].name}</div>${contentText}`;
    },
  };
  clearEchart();
  const myChart = echarts.init(
    document.getElementById("my-chart_electricity-price") as any,
  );
  myChart.setOption(options);
  loading.value = false;
}

// 获取分时电价
async function getTOUData() {
  try {
    const {
      datas: {
        timeElectricityPriceResps,
        capacityElectricityPrice, // 容量电价
        demandElectricityPrice, // 需量电价
      },
    } = await getTimePrice({
      ...searchParams.value,
      years: monthVal.value,
    });
    electricityPrice.value = {
      capacityElectricityPrice,
      demandElectricityPrice,
    };
    timeElectricityPriceData.value = timeElectricityPriceResps;
    choseSpecific.value === 1 && handleTOUData();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取分月电价
async function getMonthPriceData() {
  try {
    const [startTime, endTime] = monthRange.value;
    const { datas } = await getMonthPrice({
      ...searchParams.value,
      startTime,
      endTime,
    });
    monthElectricityPriceData.value = datas;
    choseSpecific.value === 2 && handleMonthData();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取峰谷差价
async function getMonthDifferenceData() {
  try {
    const [startTime, endTime] = monthRange.value;
    const { datas } = await getMonthDifference({
      ...searchParams.value,
      startTime,
      endTime,
    });
    monthPriceDifferenceData.value = datas;
    choseSpecific.value === 3 && handlePriceDifferenceData();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 重新定义图标大小
function reSizeEchart() {
  const myChart = echarts.init(
    document.getElementById("my-chart_electricity-price") as any,
  );
  myChart && myChart?.resize();
}

// 清除图表数据
function clearEchart() {
  const myChart = echarts.init(
    document.getElementById("my-chart_electricity-price") as any,
  );
  myChart && myChart?.clear();
}

onMounted(() => {
  loading.value = true;
  onGetRegionalData();
  // 监听窗口大小变化
  window.addEventListener("resize", reSizeEchart);
});

// 在组件销毁前移除事件监听器
onBeforeUnmount(() => {
  // 销毁echarts实例
  const myChart = echarts.init(
    document.getElementById("my-chart_electricity-price") as any,
  );
  myChart && myChart.dispose();
  window.removeEventListener("resize", reSizeEchart);
});

// 计算时间段的分钟数
function timeToMinutes(time) {
  // 将时间拆分成小时和分钟
  const [hours, minutes] = time.split(":").map(Number);
  // 计算总分钟数
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

// 获取时间戳
function getTimeStamp(time) {
  const [year, month] = time.split(".").map((part) => parseInt(part));
  new Date(year, month).getTime();
  return new Date(year, month - 1).getTime();
}

// 限制时间选择范围
function disabledDate(time) {
  const { start, end } = timeFrame.value;
  const currentTime = time.getTime();
  if (currentTime >= start && currentTime <= end) {
    // return true;
  } else {
    return true;
  }
}

// 先把数据拷贝一份如果用户未登录就利用拷贝的数据把数据复原
const backup_monthVal = ref(null); // 月份
const backup_monthRange = ref(null); // 开始结束时间
const backup_searchParams = ref(null); // 表单数据

// 用户触发表单
function handleTriggerForm() {
  backup_monthVal.value = cloneDeep(monthVal.value);
  backup_monthRange.value = cloneDeep(monthRange.value);
  backup_searchParams.value = cloneDeep(searchParams.value);
}

// 打开登录弹窗
function handleOpenLogin() {
  setTimeout(() => {
    monthVal.value = cloneDeep(backup_monthVal.value);
    monthRange.value = cloneDeep(backup_monthRange.value);
    searchParams.value = cloneDeep(backup_searchParams.value);
  });
  useUserStoreHook().openLogin(true);
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.time-electricity-price {
  padding-bottom: 24px;

  .price-type {
    border-radius: 2px;
    height: 32px;
    padding: 0 3px;
    @include flex(center, flex-start);
    background-color: #f2f3f5;

    .price-type__item {
      border-radius: 1px;
      height: 26px;
      @include margin(0, 2px, 0, 0);
      @include padding(2px, 12px, 2px, 12px);
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      transition: all 0.2s;
      cursor: pointer;

      &:last-child {
        @include margin(0, 0, 0, 0);
      }
    }

    .price-type__item-chose {
      @include font(14px, 600, #244bf1, 22px);
      background-color: #fff;
    }
  }

  .filter {
    @include flex(center, space-between);
    @include margin(24px, 0, 24px, 0);

    ::v-deep(.select) {
      width: 32.5% !important;
      margin-top: 0px !important;

      &:nth-child(4) {
        margin-top: 16px !important;
      }
    }
  }
  .filter-active {
    @include flex(center, flex-start);
    @include margin(24px, 0, 24px, 0);

    ::v-deep(.select) {
      width: 32.5% !important;
      margin-top: 0px !important;
      margin-right: 14px;

      &:nth-child(4) {
        margin-top: 16px !important;
      }
    }
  }

  ::v-deep(.select) {
    .select__title {
      @include margin(0, 16px, 0, 0);
    }
  }

  .month-range {
    margin-top: 16px;
    width: 28%;
    @include flex(center, space-between);

    .month-range-title {
      @include margin(0, 16px, 0, 0);
      @include font(14px, 400, #5b6985);
    }

    ::v-deep(.el-date-editor) {
      * {
        cursor: pointer;
      }

      flex: 1;
      background-color: #fff;

      .el-input__wrapper {
        box-shadow: none;
      }
    }
  }

  .flex {
    @include flex(center, space-between);
  }

  .small-price-type {
    @include margin(0, 0, 16px, 0);
  }

  .export-image {
    @include box(5px 12px, none, #2d5cf6, 4px);
    @include font(14px, 400, #ffffff, 22px);
    cursor: pointer;
  }

  #my-chart_electricity-price {
    @include widthAndHeight(100%, 500px);
  }
}
</style>
