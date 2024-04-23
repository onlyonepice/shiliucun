<template>
  <div class="electricity-price-analysis">
    <div class="filter-form">
      <div class="select select-p">
        <span class="select__title">地区</span>
        <el-select
          :class="searchParams.regionName.length === 1 ? 'no-close-one' : ''"
          @remove-tag="handelRemoveTag"
          @visible-change="visibleChange"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
          v-model="searchParams.regionName"
          placeholder="请选择"
          class="select__content"
          @change="handleChange"
        >
          <el-option
            v-for="item in regionalData"
            :key="item.regionName"
            :label="item.regionName"
            :value="item.regionName"
          />
        </el-select>
      </div>
      <Select
        :options="electricityTypes"
        :defaultValue="searchParams.electricityTypeOneName"
        value-key="paramName"
        :label-key="'paramDesc'"
        title="用电类型 I"
        @onChange="changeElectricityTypes"
      />
      <Select
        :options="voltageLevelData"
        value-key="paramName"
        :label-key="'paramDesc'"
        @onChange="changeVoltageLevel"
        :defaultValue="searchParams.tariffLevelId"
        title="电压等级"
      />
      <Select
        :options="yearData"
        value-key="paramName"
        :label-key="'paramDesc'"
        :defaultValue="searchParams.years"
        @onChange="changeMonth"
        title="月份选择"
      />
    </div>
    <div class="flex small-price-type">
      <Select
        @onChange="changePriceDifference"
        :defaultValue="searchParams.differencePrice"
        :options="priceDifferenceData"
        value-key="paramName"
        :label-key="'paramDesc'"
        title="峰谷价差"
        width="20%"
      />
      <div class="export-image" @click="exportResult">导出图片</div>
    </div>
    <div
      v-loading="loading"
      id="my-chart_electricity-price-analysis"
      ref="myeCharts1"
    />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  getMonth,
  apiRegionalData,
  getPeakAndValley,
  getVoltageLevel,
  getDifferentialRanking,
} from "@/api/priceTracking";
import { eChartsOptionCommon } from "./data";
import { titleStyle, textStyle, flexStyle } from "@/utils/echarts/eCharts";
import * as echarts from "echarts";
import { onMounted, computed, Ref, ref } from "vue";
import Select from "@/components/Common/Select.vue";
import ExportCanvasDialog from "@/components/Business/ExportCanvasDialog.vue";
const eChartsOption: Ref<any> = ref({
  ...eChartsOptionCommon(),
  tooltip: {
    trigger: "axis",
    borderWidth: 0,
    confine: true,
    className: "custom-tooltip",
    extraCssText: "padding: 16px; border-radius: 8px;",
    formatter: (params: any) => {
      let contentText = "";
      const { differencePrice } = searchParams.value;
      const type = priceDifferenceData.value.find(
        (item: { paramName: string; paramDesc: string }) => {
          return item.paramName === differencePrice;
        },
      ).paramDesc;
      params.forEach((item, index: number) => {
        contentText += `<div style="${flexStyle}"><div style='width: 150px;'>${item.marker}<span style="${textStyle}">${index === 0 ? type : item.seriesName}</span></div><span style="${textStyle}">${item.value}</span></div>`;
      });
      return `<div style="${titleStyle}">${params[0].axisValueLabel}</div>${contentText}`;
    },
    axisPointer: {
      type: "line",
      lineStyle: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  },
});

const seriesName = computed(() => {
  const { differencePrice } = searchParams.value;
  return priceDifferenceData.value.find(
    (item: { paramName: string; paramDesc: string }) => {
      return item.paramName === differencePrice;
    },
  )?.paramDesc;
});

// 获取echarts节点
const myeCharts1 = ref<any>(null);

// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗

// select option 数据
const yearData = ref<any>([]); // 时间数据
const regionalData = ref<any>([]); // 城市数据
const voltageLevelData = ref<any>([]); // 电压等级
const priceDifferenceData = ref<any>([]); // 峰谷价差
const electricityTypes = ref<any>([]); // 用电类型1数组

const loading = ref(false);

// 筛选项搜索结果
const searchParams = ref<any>({
  regionName: [], // 地区
  electricityTypeOneName: "", // 用电类型
  differencePrice: "", // 峰谷价差
  tariffLevelId: "", // 电压等级
  years: "",
});

// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(myeCharts1.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportImgTitle.value = "储能月度招标分析";
  exportVisible.value = true;
}

// 返回副标题
const titleText = computed(() => {
  const obj = {
    electricityTypeOneName: "", // 用电类型
    differencePrice: "", // 峰谷价差
    tariffLevelId: "", // 电压等级
    years: "",
  };
  obj.electricityTypeOneName = electricityTypes.value.find(
    (item) => item.paramName === searchParams.value.electricityTypeOneName,
  ).paramDesc;
  obj.differencePrice = priceDifferenceData.value.find(
    (item) => item.paramName === searchParams.value.differencePrice,
  ).paramDesc;
  obj.tariffLevelId = voltageLevelData.value.find(
    (item) => item.paramName === searchParams.value.tariffLevelId,
  ).paramDesc;
  obj.years = yearData.value.find(
    (item) => item.paramName === searchParams.value.years,
  ).paramDesc;
  return obj;
});

// 获取地区数据
async function onGetRegionalData() {
  try {
    const { datas } = await apiRegionalData({ type: "all" });
    regionalData.value = datas;
    searchParams.value.regionName = [datas[0].regionName];
    datas.forEach((item) => {
      if (
        item.reInvestmentElectricityType &&
        item.reInvestmentElectricityType.length > 0
      ) {
        item.reInvestmentElectricityType.forEach((_item) => {
          const index = electricityTypes.value.findIndex(
            (__item) => __item.paramName === _item.paramName,
          );
          if (index === -1) {
            electricityTypes.value.push(_item);
            searchParams.value.electricityTypeOneName =
              electricityTypes.value[0].paramName;
          }
        });
      }
    });
    handelGetVoltageLevel();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取电压等级
async function handelGetVoltageLevel() {
  try {
    const { datas } = await getVoltageLevel({
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
    });
    voltageLevelData.value = datas;
    searchParams.value.tariffLevelId = datas[0].paramName;
    onGetMonth();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取峰谷价差筛选项
async function onGetPeakAndValley() {
  try {
    const { datas } = await getPeakAndValley();
    priceDifferenceData.value = datas;
    searchParams.value.differencePrice = datas[0].paramName;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 获取月份
async function onGetMonth() {
  try {
    const { datas } = await getMonth({
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
      regionName: searchParams.value.regionName.join(","),
    });
    yearData.value = datas;
    searchParams.value.years = datas[datas.length - 1].paramName;
    getElectricityTypeOneName();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

// 地区change
function handleChange(val: Array<string>) {
  if (val[val.length - 1] === "全国") {
    searchParams.value.regionName = ["全国"];
  } else {
    val.indexOf("全国") !== -1 && val.splice(val.indexOf("全国"), 1);
    searchParams.value.regionName = val;
  }
  if (val.length === 0) {
    searchParams.value.regionName = ["全国"];
  }
}

// 用电类型change
function changeElectricityTypes(val: string) {
  loading.value = true;
  searchParams.value.electricityTypeOneName = val;
  handelGetVoltageLevel();
}

// 电压等级change
function changeVoltageLevel(val) {
  loading.value = true;
  searchParams.value.tariffLevelId = val;
  onGetMonth();
}

// 月份change
function changeMonth(val) {
  loading.value = true;
  searchParams.value.years = val;
  getElectricityTypeOneName();
}

// 峰谷价差change
function changePriceDifference(val) {
  loading.value = true;
  searchParams.value.differencePrice = val;
  getElectricityTypeOneName();
}

// 当地区选择框关闭时触发
function visibleChange(val) {
  if (!val) {
    loading.value = true;
    handelGetVoltageLevel();
  }
}
// 删除tbg时触发
function handelRemoveTag() {
  getElectricityTypeOneName();
  // searchParams.value.differencePrice = ''
}
// 获取差异排名
async function getElectricityTypeOneName() {
  const {
    electricityTypeOneName,
    differencePrice,
    tariffLevelId,
    regionName,
    years,
  } = searchParams.value;
  const { datas } = await getDifferentialRanking({
    electricityTypeOneName,
    differencePrice,
    tariffLevelId,
    regionName,
    years,
  });
  eChartsOption.value.title.text =
    titleText.value.years + "月各省市代理购电价峰谷价差排名";
  eChartsOption.value.title.subtext = `·${titleText.value.electricityTypeOneName}·${titleText.value.tariffLevelId}·${titleText.value.differencePrice}`;
  eChartsOption.value.series[0].data = datas.map(
    (item) => item.electrovalenceDifference,
  );
  eChartsOption.value.series[0].name = seriesName;
  eChartsOption.value.legend.data[0].name = seriesName;
  eChartsOption.value.series[1].data = datas.map((item) => item.sameRatio);
  eChartsOption.value.xAxis.data = datas.map((item) => item.regionName);
  loading.value = false;
  createEcharts();
}

// 创建图表
function createEcharts() {
  if (document.getElementById("my-chart_electricity-price-analysis")) {
    const myChart = echarts.init(
      document.getElementById("my-chart_electricity-price-analysis") as any,
    );
    myChart.setOption(eChartsOption.value);
  }
}

onMounted(() => {
  loading.value = true;
  // 获取所有数据
  Promise.all([onGetRegionalData(), onGetPeakAndValley()]);
});
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.electricity-price-analysis {
  padding-bottom: 80px;

  .filter-form {
    @include flex(center, space-between);
    @include margin(24px, 0, 24px, 0);

    ::v-deep(.select) {
      width: 32.5% !important;
      margin-top: 0px !important;

      &:nth-child(4) {
        margin-top: 16px !important;
      }
    }

    .select-p {
      @include widthAndHeight(32.5%, 32px);
      @include flex(center, flex-start);
      @include margin(0, 0, 0, 0);

      .select__title {
        width: 70px;
        text-align: right;
        @include margin(0, 44px, 0, 0);
        @include margin(0, 44px, 0, 0);
        @include font(14px, 400, #5b6985, 22px);
      }

      ::v-deep(.no-close-one) {
        .el-select__tags {
          .el-tag__close {
            display: none;
          }
        }

        .el-tag {
          padding-right: 9px !important;
        }
      }

      .select__content {
        flex: 1;
        // ::v-deep(.el-select__wrapper) {
        //   .el-select__selected-item {
        //     .el-tag {
        //       .el-tag__content {
        //         max-width: 40px;
        //       }
        //     }
        //   }
        // }
      }
    }

    ::v-deep(.select) {
      width: 32.5% !important;

      &:nth-child(3) {
        @include margin();
      }

      .select__title {
        @include margin(0, 16px, 0, 0);
      }
    }
  }

  .small-price-type {
    @include flex(center, space-between);
    @include margin(0, 0, 16px, 0);

    ::v-deep(.select) {
      .select__title {
        @include margin(0, 16px, 0, 0);
      }
    }

    .export-image {
      @include box(5px 12px, none, #2d5cf6, 4px);
      @include font(14px, 400, #ffffff, 22px);
      cursor: pointer;
    }
  }

  #my-chart_electricity-price-analysis {
    @include widthAndHeight(100%, 518px);
  }
}
</style>
