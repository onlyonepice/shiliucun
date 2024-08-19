import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 获取招标查找列表
export const getBidFinderApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/V1.0/getBidFinder",
    { data },
  );
};
// 获取招标查找详情
export const getBidFinderDetail = (params) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/front/openApi/V1.0/getTenderParticulars",
    { params },
  );
};
//前台_招标查找筛选条件
export const getTenderLookupApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/front/openApi/v1.0/tenderLookup",
  );
};
// 获取招标内容筛选项
export const getTenderFilterApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/front/openApi/V1.0/getBiddingContent",
  );
};

// 获取招标内容时间筛选项
export const getTenderTimeFilterApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/front/openApi/V1.0/getReleaseTime",
  );
};

// 招标月度分析查找结果
export const getBiddingDynamicsListApi = (id: number) => {
  return http.request<responseType>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getMonthlyBiddingAnalysis?contentDict=${id}`,
  );
};

// 招标企业分析查找结果
export const getBusinessDynamicsListApi = (params: any) => {
  return http.request<responseType>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getEnterpriseBiddingAnalysis`,
    {
      params,
    },
  );
};
// 招标地区分析查找结果
export const getRegionDynamicsListApi = (params: any) => {
  return http.request<responseType>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getRegionBiddingAnalysis`,
    {
      params,
    },
  );
};

// 获取招标区域分析颜色
export const getRegionColorApi = (params) => {
  return http.request<responseType>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getRegionBiddingAnalysisColour`,
    {
      params,
    },
  );
};

// 招标查找-招标内容
export const getBiddingContentApi = () => {
  return http.request<responseType>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getBiddingContentBox`,
  );
};
// 中标报告列表
export const getWinningReportPageApi = (data) => {
  return http.request<responseType>(
    "post",
    `/eesa-report/priceTracking/front/openApi/v1.0/winningReportPage`,
    { data },
  );
};
// 中标内容列表
export const bidWinningContentData_V2 = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/V1.0/biddingContentBox",
  );
};
// 中标时间
export const winingBidTime = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/winningBidTime",
  );
};
// 时长列表
export const durationData_V2 = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/V1.0/energyStorageDurationBox",
  );
};
// 技术类型列表
export const technologyType_V2 = (type?: string) => {
  return http.request<responseType>(
    "post",
    `/eesa-report/priceTracking/front/openApi/V1.0/technologyTypeBox?type=${type}`,
  );
};
// 应用场景下拉框
export const applicationScenariosBox = (params) => {
  return http.request<responseType>(
    "post",
    `/eesa-report/priceTracking/front/openApi/V1.0/applicationScenariosBox?type=${params}`,
  );
};
// 中标容量分析
export const capacityAnalysis_V2 = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/analyzeBarGraph",
    { data },
  );
};
// 中标企业分析
export const enterpriseAnalysis = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/enterpriseAnalysis",
    { data },
  );
};
// 中标分析报告
export const winningReport = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/winningReport",
    { data },
  );
};

// 政策详情
export const getPolicyDetailsApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/all/V1.0/getPolicyDetails",
    { data },
  );
};
// 政策查找筛选类
export const policyFilterSearch = (year) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/V1.0/policySearch",
    { data: { year } },
  );
};
//政策_根据筛选获取有政策的省份政策查找不分页
export const getPolicyByFiltrateNoPagination = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/V1.0/getPolicyByFiltrateNoPagination",
    { data },
  );
};
//政策查找详情
export const getPolicyDetails = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/all/V1.0/getPolicyDetails",
    { data },
  );
};
// 专家访谈列表 /eesa-report/alliance/newsInformation/openApi/v1.0/appletListExpertInterviews
export const getExpertInterviewList = (params) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/alliance/newsInformation/front/openApi/v1.0/expertInterviews",
    { params },
  );
};

// 获取统计单位
export const getUnitListApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/openApi/v1.0/getUnitsStatistics",
  );
};

// 获取招标地区
export const getBiddingAreaApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/openApi/v1.0/getProvincialDivisions",
  );
};

// 获取招标储能时长分析
export const getEnergyStorageDurationAnalysis = (params) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/openApi/v1.0/getEnergyStorageDurationAnalysis",
    { params },
  );
};

// 获取中标储能时长分析
export const getWinningEnergyStorageDurationAnalysis = (params) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/priceTracking/openApi/v1.0/getBidderEnergyStorageDurationAnalysis",
    { params },
  );
};
// 获取招标应用场景分析
export const getTenderScenariosApi = (params: any) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/Policy/openApi/v1.0/getApplicationScenarioAnalysis",
    {
      params,
    },
  );
};

// 获取中标应用场景分析
export const getWinningScenariosApi = (params: any) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/priceTracking/openApi/v1.0/getBidderApplicationScenarioAnalysis",
    {
      params,
    },
  );
};

// 政策_政策分析 echart
export const policyAnalysis = (params) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/v1.0/policyAnalysis",
    { params },
  );
};

// 政策_政策发布年月下拉框
export const getPolicyReleased = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/v1.0/getPolicyReleased",
  );
};

// 招中标模块遮罩层权限
export const maskPermissions = (params: any) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/homePage/public/front/v1.0/maskLayerPermissions",
    { params },
  );
};

/** 储能项目投运规模 **/
// 时间默认值
export const yearDefaultApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/operationScaleEnergyStorageProjects/energyStorageProjects/openApi/v1.0/getItemModuleTimeFrame",
  );
};
// 地区下拉框
export const areaTypeApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/operationScaleEnergyStorageProjects/energyStorageProjects/openApi/v1.0/getDistrict",
  );
};
// 储能项目投运规模数据
export const operationProjectApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/operationScaleEnergyStorageProjects/energyStorageProjects/openApi/v1.0/getEnergyStorageProjectCommissioningScale",
    { data },
  );
};

// 开通电价获取验证码
export const getVerificationCode = (data: any) => {
  return http.request<responseType>(
    "post",
    "/api-user/sms/openApi/v1.0/sendAVerificationCodeSMS",
    { data },
  );
};

// 开通api接口
export const openApiApi = (data: any) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/vipForm/front/v1.0/loginCreat",
    { data },
  );
};

// 获取api接口最新时间
export const getApiTime = () => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/statistics/openApi/v1.0/getLastUpdateTime",
  );
};

// 前台_中标价格分析
export const biddingPriceAnalysis = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/openApi/v1.0/biddingPriceAnalysis",
    { data },
  );
};
// 储能时长2.0
export const newEnergyStorageDurationBox = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/openApi/v1.0/newEnergyStorageDurationBox",
  );
};
// 前台_中标规模分析
export const biddingScaleAnalysis = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/priceTracking/openApi/v1.0/biddingScaleAnalysis",
    { data },
  );
};
// 采集入围时间列表
export const getCollectTimeList = () => {
  return http.request<responseType>(
    "get",
    "/eesa-report/priceTracking/openApi/v1.0/collectionEntryTime",
  );
};
// 企业采集入围
export const getCollectionEntry = (params: { time: string }) => {
  return http.request<responseType>(
    "get",
    "/eesa-report/priceTracking/openApi/v1.0/collectionEntry",
    { params },
  );
};

// 获取充放电策略获取地区
export const getChargeDischargePolicyArea = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/electricityFutureTimeShare/openApi/v1.1/getRegionChargeDischargeStrategy",
  );
};

// 获取充放电策略
export const getChargeDischargePolicy = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-report/electricityFutureTimeShare/openApi/v1.1/getTheLatestTickPeriods",
    { data },
  );
};
