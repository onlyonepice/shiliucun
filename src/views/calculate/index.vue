<template>
  <div id="investment-return" class="es-commonPage">
    <Filter
      @onAnalysis="onAnalysis"
      @onReset="onReset"
      @onAddArea="onAddArea"
      @getDesc="getDesc"
    />
    <template v-if="filterFinish">
      <div class="es-calculate-evaluate" v-if="!addAreaType">
        <div class="es-calculate-evaluate__title">
          <h3>测算结果</h3>
          <div
            class="es-calculate-evaluate__title-item"
            v-for="item in evaluateList"
            :key="item.id"
            :type="choseEvaluate === item.text ? item.text : ''"
            :class="
              choseEvaluate === item.text
                ? 'es-calculate-evaluate__title-item--chose'
                : ''
            "
            @click="onEvaluate(item.text)"
          >
            <img
              :src="choseEvaluate === item.text ? item.choseIcon : item.icon"
              alt=""
            />
            <span>{{ item.text }}</span>
          </div>
        </div>
        <el-button type="primary" @click="downloadReportShow = true"
          >下载报告</el-button
        >
      </div>
      <Tabs
        :tabsList="tabsList"
        @onHandleClick="onHandleClick"
        :defaultId="choseTab"
        class="es-calculate-tabs"
      />
      <div v-show="choseTab === 1">
        <Investment
          v-if="showInvestment"
          :searchParams="searchParamsA"
          :showInfoList="showInfoList"
          @onChangeFilter="onChangeFilter"
        />

        <template v-if="showInfoList[0][0].value === 'EMC合同能源'">
          <div
            style="overflow-x: scroll; overflow-y: hidden"
            :style="{ display: addAreaType ? 'flex' : 'block' }"
            v-if="searchResult.internalRateReturn !== null"
          >
            <Estimate
              :addAreaType="addAreaType"
              :revenueEstimateList="revenueEstimateList"
              :searchResult="searchResult"
              :title="addAreaType ? `地区A：${titleA}` : '收益估算B'"
            />
            <Estimate
              v-if="addAreaType"
              :title="'地区B：' + titleB"
              :addAreaType="addAreaType"
              :revenueEstimateList="revenueEstimateListB"
              :searchResult="searchResultB"
            />
          </div>
        </template>
        <template v-else>
          <div
            style="overflow-x: scroll; overflow-y: hidden"
            :style="{ display: addAreaType ? 'flex' : 'block' }"
            v-if="searchResult.contentYield !== null"
          >
            <Proprietor
              :addAreaType="addAreaType"
              :ownerRevenueEstimateList="ownerRevenueEstimateList"
              :searchResult="searchResult"
              :title="addAreaType ? `地区A：${titleA}` : '收益估算B'"
            />
            <Proprietor
              v-if="addAreaType"
              :title="'地区B：' + titleB"
              :addAreaType="addAreaType"
              :ownerRevenueEstimateList="ownerRevenueEstimateListB"
              :searchResult="searchResultB"
            />
          </div>
        </template>
      </div>
      <div v-show="choseTab === 2">
        <div
          style="overflow-x: scroll; overflow-y: hidden"
          :style="{ display: addAreaType ? 'flex' : 'block' }"
        >
          <Electric
            :dischargeList="dischargeList"
            :addAreaType="addAreaType"
            :title="addAreaType ? '充放电量A' : '充放电量'"
          />
          <Electric
            v-if="addAreaType"
            title="充放电量B"
            :dischargeList="dischargeListB"
            :addAreaType="addAreaType"
          />
        </div>
      </div>
    </template>
    <Canvas
      v-if="!addAreaType"
      ref="searchCanvas"
      :searchCanvas="searchCanvas"
      :searchParams="searchParamsA"
      :searchParamsShow="searchParamsShow"
      @onSearch="onSearchData"
    />
  </div>
  <DownloadReport
    v-if="downloadReportShow"
    :defaultTitle="
      searchParamsA.regionName +
      '-' +
      searchParamsA.reportTitle +
      '-工商业投资回报性分析'
    "
    @exportAll="onExportAll"
    @handleCancel="downloadReportShow = false"
  />
  <OpenVip
    title="今日体验次数已达上限，请开通VIP会员继续使用。"
    :visible="useUserStore().$state.openVipVisible"
  />
  <Dom
    v-if="filterFinish"
    ref="formatDom"
    class="format-dom"
    :data="[{ id: 1, ...searchResult }]"
    :mode="showInfoList[0][0].value"
    :condition="searchParamsShow"
  />
  <Loading v-if="downloadLoading" bg="rgba(0,0,0,0.2)" />
  <SkipMask v-bind="titleSkip" @onClose="onClose" />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch, nextTick } from "vue";
import Filter from "./filter/enter.vue";
import Canvas from "./canvas.vue";
import DownloadReport from "./downLoad/DownloadReport.vue";
import Dom from "./downLoad/dom.vue";
import Dissatisfy from "@/assets/img/common/dissatisfy.png";
import ChoseDissatisfy from "@/assets/img/common/chose-dissatisfy.png";
import Normal from "@/assets/img/common/normal.png";
import ChoseNormal from "@/assets/img/common/chose-normal.png";
import Satisfaction from "@/assets/img/common/satisfaction.png";
import ChoseSatisfaction from "@/assets/img/common/chose-satisfaction.png";
import Estimate from "./table/estimate.vue";
import Electric from "./table/electric.vue";
import Proprietor from "./table/proprietor.vue";
import Investment from "./filter/Investment.vue";
import { useUserStore } from "@/store/modules/user";
import {
  apiAnalyzeSearch,
  apiComment,
  apiFileConversion,
} from "@/api/investment";
import { getTimesApi } from "@/api/user";
import { cloneDeep } from "lodash";
import { windowScrollStore } from "@/store/modules/windowScroll";
import { stringifyData, getImageInfo } from "@/utils/richText";
import {
  WORD_COVER,
  VALUE_PROPERTY,
  REPORT_DATA_DOM_TYPE,
} from "@/utils/downReport";
import { exportDocument } from "@/utils/docx";
import { ElMessage } from "element-plus";
// 展示筛选项内容
const showInfoList: Ref<Array<Array<any>>> = ref([
  [{ title: "模式分析：", value: "" }],
]);
const revenueEstimateList: Ref<any> = ref([]); // 收益估算
const revenueEstimateListB: Ref<any> = ref([]); // 收益估算对比地区
const ownerRevenueEstimateList: Ref<any> = ref([]); // 业主自投收益估算
const ownerRevenueEstimateListB: Ref<any> = ref([]); // 业主自投收益估算对比地区
const dischargeList: Ref<any> = ref([]); // 充放电量
const dischargeListB: Ref<any> = ref([]); // 充放电量对比地区
const downloadReportShow: Ref<boolean> = ref(false); // 下载报告弹窗
const showInvestment = ref(false);
const formatDom = ref(null); // dom结构
const downloadLoading: Ref<boolean> = ref(false); // 下载loading
const titleSkip = ref({
  title: "配置数量、系统单价、系统容量等均为默认值，可根据情况自行修改",
  showTips: true,
  cancel: "",
  confirm: "确定",
  showIcon: false,
  show: false,
});
// 查询参数
const searchParamsA: Ref<any> = ref({
  emcComprehensiveTaxRate: 87,
});
const searchParamsB: Ref<any> = ref({});
const addAreaType: Ref<boolean> = ref(false); // 添加地区对比
const scrollTop: Ref<number> = ref(0); // 页面滚动距离
const evaluateList: Ref<any> = ref([
  { id: 1, text: "不满意", icon: Dissatisfy, choseIcon: ChoseDissatisfy },
  { id: 2, text: "一般", icon: Normal, choseIcon: ChoseNormal },
  { id: 3, text: "满意", icon: Satisfaction, choseIcon: ChoseSatisfaction },
]); // 评价列表
const choseEvaluate: Ref<string> = ref(""); // 评价
const searchParamsShow = ref({}); // 展示筛选项
// 生成报告
const report: Ref<any> = ref({
  reportName: "",
  reportRootMenu: {},
  reportSubMenus: [],
  menuRootId: 1078,
  menuSort: 0,
});
const tabsList = ref([
  { id: 1, name: "金融方案" },
  { id: 2, name: "充放电量" },
]);
const titleA = ref("");
const titleB = ref("");

const choseTab: Ref<number> = ref(1);
// 是否完成筛选，由子组件控制
const filterFinish: Ref<boolean> = ref(false);
const searchResult: Ref<any> = ref({
  internalRateReturn: "",
  paybackTime: "",
}); // 搜索结果
const searchResultB: Ref<any> = ref({
  internalRateReturn: "",
  paybackTime: "",
}); // 地区B搜索结果
// 是否展示补贴相关检索的展示
// const showSubsidyInfo = computed(() => (itemInfo: any) => {});
let searchCanvas = ref();
watch(
  () => filterFinish.value,
  (val) => {
    val && (searchCanvas.value = ref());
  },
  { immediate: true },
);
const getDesc = (data: any) => {
  searchParamsShow.value = data;
};
// 添加地区对比
const onAddArea = (type: boolean) => {
  addAreaType.value = type;
};
// tab切换
const onHandleClick = (id: number) => {
  choseTab.value !== id && (choseTab.value = id);
};
// 关闭弹窗
const onClose = (type: boolean, tips: boolean) => {
  window.localStorage.setItem(
    "showCalculateTips",
    JSON.stringify(type && tips),
  );
  titleSkip.value.show = false;
};
// 评论
const onEvaluate = async (text: string) => {
  if (choseEvaluate.value === "") {
    choseEvaluate.value = text;
    await apiComment({
      moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
      satisfactionLevel: text,
    });
    ElMessage.success("感谢您的评价");
  }
};
// 修改投资方案筛选项
function onChangeFilter(data: string, type: string) {
  searchParamsA.value[type] = data;
  searchParamsB.value[type] = data;
  if (type === "ownersShare") {
    searchParamsA.value.dividedByInvestors = 100 - Number(data);
    searchParamsB.value.dividedByInvestors = 100 - Number(data);
  }
  if (type === "dividedByInvestors") {
    searchParamsA.value.ownersShare = 100 - Number(data);
    searchParamsB.value.ownersShare = 100 - Number(data);
  }
  if (!addAreaType.value) {
    onSearch(false, "searchA");
  } else {
    onSearch(false, "searchA");
    onSearch(false, "searchB");
  }
}
// 下载报告
const onExportAll = async (type, value) => {
  downloadLoading.value = true;
  await filterTable();
  let _report = report.value;
  _report.reportName = value;
  _report.reportRootMenu = {
    id: 1078,
    menuName: "投资回报性分析",
    menuRootId: 1078,
    menuSort: 0,
  };
  const cover = JSON.parse(WORD_COVER.NORMAL);

  const curTime = new Date().toLocaleDateString().split("/").join("-");
  _report.updateTime = curTime;

  const { formData, name } = await exportDocument(
    cloneDeep(_report),
    VALUE_PROPERTY,
    {
      type: "word",
      menu: false,
      cover,
      menuOrder: 2,
      menuLevel: "1-2",
    },
  );

  const convertParams = {
    fileType: type,
    moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
    outputFile: true,
  };
  const wordFile = new window.File([formData], `${name}.docx`, {
    type,
  });
  const _files = new FormData();
  _files.set("file", wordFile);

  try {
    const file: any = await apiFileConversion(convertParams, _files);
    downloadLoading.value = false;
    downloadReportShow.value = false;
    const a = document.createElement("a");
    const _url = URL || window.URL || window.webkitURL;
    a.href = _url.createObjectURL(file.data);
    a.download = name + "." + type;
    a.click();
    _url.revokeObjectURL(a.href);
  } catch (err) {
    console.info("business convert file err", err);
  }
};
const filterTable = async () => {
  const arr = [];
  const financialReportsData = formatDom.value.getDom();
  for (const item of financialReportsData) {
    if (item.tagName === REPORT_DATA_DOM_TYPE.DOM_TYPE.TABLE) {
      arr.push({
        dataContent: await stringifyData(item.outerHTML),
        dataSort: 1,
        dataType: REPORT_DATA_DOM_TYPE.DATA_TYPE.TABLE,
      });
    } else if (item.tagName === REPORT_DATA_DOM_TYPE.DOM_TYPE.P) {
      arr.push({
        dataContent: await stringifyData(item.outerHTML),
        dataSort: 1,
        dataType: REPORT_DATA_DOM_TYPE.DATA_TYPE.P,
      });
    } else if (item.tagName === REPORT_DATA_DOM_TYPE.DOM_TYPE.IMG) {
      arr.push({
        dataContent: await getImageInfo(item.src),
        dataSort: 1,
        dataType: REPORT_DATA_DOM_TYPE.DATA_TYPE.IMG,
      });
    } else if (item.tagName === REPORT_DATA_DOM_TYPE.DOM_TYPE.DIV) {
      arr.push({
        dataContent: await stringifyData(item.outerHTML),
        dataSort: 1,
        dataType: REPORT_DATA_DOM_TYPE.DATA_TYPE.DIV,
      });
    }
  }
  arr.forEach((item) => {
    if (item.dataType !== REPORT_DATA_DOM_TYPE.DATA_TYPE.IMG) {
      item.dataContent = JSON.stringify(item.dataContent);
    }
  });
  const finance = {
    id: 1079,
    menuName: "中国工商业储能",
    menuRootId: 1078,
    menuSort: 1,
    parentId: 1078,
    reportMenuData: arr,
    reportSubMenus: [],
    state: 1,
  };
  report.value.reportSubMenus[0] = finance;
};

function onSearchData(data: any) {
  searchParamsA.value = data;
  addAreaType.value = false;
  onSearch(false, "searchA");
}
// 查询接口
async function onSearch(type? = false, source?: string) {
  let _search: any = {};
  _search =
    source === "searchA"
      ? cloneDeep(searchParamsA.value)
      : cloneDeep(searchParamsB.value);
  _search.callingMode = type;
  _search.bankRate =
    _search.bankRate !== undefined
      ? Number(_search.bankRate.split("%")[0])
      : "";
  _search.calculationPeriod =
    _search.calculationPeriod !== undefined
      ? Number(_search.calculationPeriod.split("年")[0])
      : "";
  delete _search.choseProduct;
  _search.systemUnitPrice = Number(_search.systemUnitPrice);
  const { datas, resp_code }: any = await apiAnalyzeSearch(_search);
  if (_search.callingMode) {
    const _datas: any = await getTimesApi({
      moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
    });
    if (_datas.datas !== null) {
      ElMessage({
        message: `<div style="display: flex;align-items: center;"><img width="17.5" height="17.5" style="margin-right: 9px;" src="https://eesa-mini-app.oss-rg-china-mainland.aliyuncs.com/i-report/v1.0/iReport3_icon_comment.png" /><span>剩余使用次数：${_datas.datas}次</span></div>`,
        type: "info",
        dangerouslyUseHTMLString: true,
        duration: 2000,
      });
    }
  }
  if (resp_code === 0) {
    if (source === "searchA") {
      searchResult.value = datas;
    } else {
      searchResultB.value = datas;
    }

    showInvestment.value = true;
    const _data = datas.revenueEstimationResps;
    const _discharge = [];
    _data.annualCharge.unshift("-");
    _data.annualDischarge.unshift("-");

    if (showInfoList.value[0][0].value === "EMC合同能源") {
      const _revenueEstimate = [];
      for (let index = 0; index < _data.variationFactor.length; index++) {
        _revenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          ownersAccumulatedIncome: _data.ownersAccumulatedIncome[index],
          cumulativeReturnInvestors: _data.cumulativeReturnInvestors[index],
          investorNetPresentValue: _data.investorNetPresentValue[index],
        });
      }

      if (source === "searchA") {
        revenueEstimateList.value = _revenueEstimate;
      } else {
        revenueEstimateListB.value = _revenueEstimate;
      }
    } else {
      const _ownerRevenueEstimate = [];
      for (let index = 0; index < _data.variationFactor.length; index++) {
        _ownerRevenueEstimate.push({
          variationFactor: _data.variationFactor[index],
          financialCost: _data.financialCost[index],
          innerReturnRate: _data.innerReturnRate[index],
        });
      }
      if (source === "searchA") {
        ownerRevenueEstimateList.value = _ownerRevenueEstimate;
      } else {
        ownerRevenueEstimateListB.value = _ownerRevenueEstimate;
      }
    }
    for (let index = 0; index < _data.variationFactor.length; index++) {
      _discharge.push({
        variationFactor: _data.variationFactor[index],
        annualCharge: _data.annualCharge[index],
        annualDischarge: _data.annualDischarge[index],
      });
    }
    _discharge.shift();
    if (source === "searchA") {
      dischargeList.value = _discharge;
    } else {
      return (dischargeListB.value = _discharge);
    }
    filterFinish.value = true;
    nextTick(() => {
      windowScrollStore().SET_SCROLL_TOP(940);
    });
    if (source === "searchA" && !addAreaType.value) {
      setTimeout(() => {
        searchCanvas.value.getCanvasData(false);
      }, 200);
      type &&
        setTimeout(() => {
          searchCanvas.value.getSliderConfig();
        }, 400);
    }
  } else if (resp_code === 10027) {
    useUserStore().$state.openVipVisible = true;
  }
}

// 重置按钮
function onReset() {
  filterFinish.value = false;
}
// 开始分析按钮
async function onAnalysis(data: any, type: string) {
  console.log(data);
  showInvestment.value = false;
  addAreaType.value = type === "searchB";

  const _showInfoList = showInfoList.value;
  choseEvaluate.value = "";
  _showInfoList[0][0].value =
    data.patternAnalysis === 1 ? "EMC合同能源" : "业主自投";

  if (type === "searchA") {
    titleA.value = data.regionName;
    searchParamsA.value = Object.assign(searchParamsA.value, cloneDeep(data));
    searchParamsA.value.annualDays = 300;
    searchParamsA.value.bankRate = "5%";
    searchParamsA.value.calculationPeriod = "10年";
    searchParamsA.value.emcComprehensiveTaxRate = 87;
  } else {
    titleB.value = data.regionName;
    searchParamsB.value = Object.assign(searchParamsB.value, cloneDeep(data));
    searchParamsB.value.annualDays = 300;
    searchParamsB.value.bankRate = "5%";
    searchParamsB.value.calculationPeriod = "10年";
    searchParamsB.value.emcComprehensiveTaxRate = 87;
  }
  nextTick(() => {
    showInvestment.value = true;
    onSearch(true, type);
  });
}

function updateScrollTop() {
  scrollTop.value = window.scrollY;
}
onMounted(() => {
  window.addEventListener("scroll", updateScrollTop);
  window.localStorage.getItem("showCalculateTips") !== null &&
    (titleSkip.value.show = JSON.parse(
      window.localStorage.getItem("showCalculateTips"),
    ));
  const _showCalculateTips = window.localStorage.getItem("showCalculateTips");
  if (_showCalculateTips === null || _showCalculateTips === "false") {
    titleSkip.value.show = true;
  } else {
    titleSkip.value.show = false;
  }
});
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

#investment-return {
  padding: 80px 0;
}

.es-calculate-evaluate {
  @include flex(center, space-between, nowrap);

  .es-calculate-evaluate__title {
    @include flex(center, flex-start, nowrap);
  }

  .es-calculate-evaluate__title-item {
    @include widthAndHeight(96px, 32px);
    @include flex(center, center);
    border-radius: 3px;
    border: 1px solid #f2f3f5;
    margin-right: 8px;
    cursor: pointer;
    background: #f2f3f5;

    img {
      @include widthAndHeight(20px, 20px);
      margin-right: 4px;
    }

    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }

    &:nth-of-type(1) {
      margin-left: 16px;
    }
  }

  div[type="不满意"] {
    background: #fde0e2;
    border: 1px solid #fbb4b9;
  }

  div[type="一般"] {
    background: #fff1d1;
    border: 1px solid #ffbd12;
  }

  div[type="满意"] {
    background: #fff1d1;
    border: 1px solid #ffbd12;
  }
}

.scrollbar-flex-content {
  overflow-x: auto;
}

.es-calculate-tabs {
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 999;
}

.format-dom {
  position: absolute;
  z-index: -1;
}
</style>
