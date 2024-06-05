<!-- 招标地区分析 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <Select
          :options="contentFilter"
          labelKey="paramDesc"
          valueKey="id"
          title="招标内容"
          @onChange="
            (val) => {
              return onChangeFilter(val, 'contentDict');
            }
          "
          :defaultValue="contentDict"
        />
        <Select
          :options="timeFilter"
          labelKey="paramDesc"
          valueKey="paramValue"
          title="发布日期"
          @onChange="
            (val) => {
              return onChangeFilter(val, 'releaseTime');
            }
          "
          :defaultValue="releaseTime"
        />
      </div>
      <div :class="ns.be('top', 'right')">
        <el-button type="primary" @click="exportResult">下载图片</el-button>
      </div>
    </div>
    <div v-loading="loading" id="eChart_areaAnalysis" ref="eChartsDom" />
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      :img-title="exportImgTitle"
      @close="exportVisible = false"
    />
  </div>
  <ElectricityText :url="VITE_DATABASE_URL + '#/winningBidLibraryManage'" />
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, nextTick } from "vue";
import * as echarts from "echarts";
import useNamespace from "@/utils/nameSpace";
import { getRegionDynamicsListApi, getRegionColorApi } from "@/api/data";
import { EChartOptions, charsToRemove } from "@/utils/echarts/mapAndPieECharts";
import { cloneDeep, toNumber } from "lodash";
import chinaMap from "@/assets/map/china.json";
import { useUserStore } from "@/store/modules/user";
const { VITE_DATABASE_URL } = import.meta.env;
const eChartsOption: Ref<any> = ref(EChartOptions());
// 获取eCharts节点
const eChartsDom = ref(null);
// 导出图片相关
const exportImgUrl = ref({ png: "", jpg: "" }); // 导出图片地址
const exportImgTitle: Ref<string> = ref("");
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("dataAreaAnalysis");
const loading: Ref<boolean> = ref(false);
const props = defineProps({
  contentFilter: {
    type: Array as () => any[],
    default: () => [],
  },
  timeFilter: {
    type: Array as () => any[],
    default: () => [],
  },
});
const contentDict: Ref<string | number> = ref(props.contentFilter[0].id); // 筛选项结果
const releaseTime: Ref<string | number> = ref("");

const getReleaseTime = () => {
  const _data = props.timeFilter.filter((item) => {
    return item.defaultValue;
  });
  releaseTime.value = _data[0].paramValue;
};

// 招标内容筛选项改变
const onChangeFilter = (id: string | number, type: string) => {
  const _releaseTime = releaseTime.value;
  type === "contentDict" ? (contentDict.value = id) : (releaseTime.value = id);
  if (useUserStore().checkPermission("ANALYSIS_BIDDING_ENTERPRISES")) {
    if (type === "releaseTime") {
      const _data = props.timeFilter.filter((item) => {
        return item.paramValue === id;
      });
      if (!_data[0].lock) {
        getElectricityTypeOneName();
      } else {
        useUserStore().openVipTitle = "开通企业VIP查看完整数据。";
        useUserStore().openVipSubmitTitle = "立即开通";
        useUserStore().openVip(true);
        return nextTick(() => {
          releaseTime.value = _releaseTime;
        });
      }
    }
    getElectricityTypeOneName();
  } else {
    nextTick(() => {
      contentDict.value = props.contentFilter[0].id;
      releaseTime.value = _releaseTime;
    });
  }
};

// 获取eCharts数据
async function getElectricityTypeOneName() {
  loading.value = true;
  const {
    datas: { data, donutChart },
  }: any = await getRegionDynamicsListApi({
    contentDict: contentDict.value,
    releaseTime: releaseTime.value,
  });
  data.map((item) => {
    item.regionName = item.province;
    item.value = item.data;
  });
  eChartsOption.value.title.text = releaseTime.value + "储能招标地区分析";
  eChartsOption.value.title.x = "center";
  // 设置省份标签是否展示
  eChartsOption.value.series[0].label = {
    show: true,
    emphasis: { show: true },
    formatter: (params): any => {
      return isNaN(params.value) ? "" : params.name;
    },
  };
  // 设置省份数据，chinaMap 省份名字需要与后端反的省份一致才展示
  eChartsOption.value.series[1].data = donutChart.map((item) => {
    return {
      name: item.name,
      value: toNumber(item.energyScale),
      data: {
        powerScale: toNumber(item.powerScale),
        energyScale: toNumber(item.energyScale),
      },
    };
  });
  eChartsOption.value.series[0].data = data
    .map((item) => {
      return {
        name: item.regionName.replace(
          new RegExp(`[${charsToRemove}]`, "g"),
          "",
        ),
        value: item.value.energyScale === 0 ? NaN : item.value.energyScale,
        data: item.value,
      };
    })
    .concat({
      name: "南海诸岛",
      value: 0,
      itemStyle: { borderColor: "#f3f3f3" },
      emphasis: { disabled: true },
      select: { disabled: true },
    });
  // 添加鼠标移入展示框
  eChartsOption.value.tooltip = {
    show: true,
    borderColor: "#fff",
    formatter: (params) => {
      if (params.value && params.value > 0) {
        const { data } = params;
        const contentTitle = `font-size: 16px; font-weight: 600; color: #1C232F; margin-bottom:8px; line-height: 24px;`;
        const pStyle = `width: 208px; height: 32px; background: #F4F5F7; display:flex; justify-content:space-between; align-item:center; padding:5px 8px; border-radius: 4px 4px 0 0;`;
        const spanTitle = `font-size: 14px; font-weight: 400; color: #1C232F; ine-height: 22px;`;
        const spanValue = `font-size: 14px; font-weight: 600; color: #1C232F; line-height: 22px;`;
        return `
        <p style='${contentTitle}'>${params.name}</p>
          <p style='${pStyle}'>
            <span style='${spanTitle}'>能量</span>
            <span style='${spanValue}'>${data.data.energyScale}MWh</span>
          </p>
          <p style='=${pStyle}'>
            <span style='style='${spanTitle}''>功率</span>
            <span style='${spanValue}'>${data.data.powerScale}MW</span>
          </p>`;
      } else {
        return "";
      }
    },
  };
  loading.value = false;
  createECharts();
}

// 创建图表
function createECharts() {
  const _chinaMap = cloneDeep(chinaMap);
  // 处理json的省份数据名字去除一些省市等字符
  _chinaMap.features.forEach((item) => {
    item.properties.name = item.properties.name.replace(
      new RegExp(`[${charsToRemove}]`, "g"),
      "",
    );
  });
  echarts.registerMap("china", { geoJSON: _chinaMap });
  const myChart = echarts.init(document.getElementById("eChart_areaAnalysis"));
  // 地图鼠标移入，没有数据不高亮显示
  myChart.on("mouseover", (params): any => {
    if (params.data === undefined) {
      myChart.dispatchAction({
        type: "downplay",
      });
    }
  });
  myChart.setOption(eChartsOption.value);
}

// 获取区域颜色
const getRegionColor = async () => {
  const { resp_code, datas }: any = await getRegionColorApi({
    contentDict: contentDict.value,
    releaseTime: releaseTime.value,
  });
  if (resp_code === 0) {
    eChartsOption.value.dataRange.show = false;
    const _data = [];
    const _color = ["#EAEEFE", "#D5DEFD", "#B6C6FC", "#8CA6FA", "#6285F8"];
    datas.forEach((item, index) => {
      index < 5 &&
        _data.push({
          start: item,
          end: datas[index + 1],
          color:
            item === 0 && datas[index + 1] === 0 ? "#F1F2F6" : _color[index],
        });
    });
    eChartsOption.value.dataRange.splitList = _data;
    getElectricityTypeOneName();
  }
};

// 导出图片
function exportResult() {
  const _echarts = echarts.getInstanceByDom(eChartsDom.value);
  exportImgUrl.value.png = _echarts.getDataURL({ type: "png" });
  exportImgUrl.value.jpg = _echarts.getDataURL({
    type: "jpeg",
    backgroundColor: "#fff",
  });
  exportImgTitle.value = "储能月度招标分析";
  exportVisible.value = true;
}

onMounted(() => {
  getRegionColor();
});
getReleaseTime();
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#eChart_areaAnalysis {
  @include widthAndHeight(100%, 500px);
  margin-top: 32px;
}

.es-dataAreaAnalysis-top {
  @include flex(center, space-between, nowrap);
}

.es-dataAreaAnalysis-top__left {
  width: 80%;
  height: 32px;
  @include flex(center, space-between, nowrap);
  .es-dataAreaAnalysis-top__title {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-right: 16px;
    flex: 1;
  }
}

.es-dataAreaAnalysis-top__right {
  height: 32px;
  @include flex();
  &::before {
    content: "";
    @include widthAndHeight(1px, 24px);
    display: inline-block;
    background: #dbdce2;
    margin-right: 24px;
  }
}
</style>
