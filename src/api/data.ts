import { http } from "@/utils/http";

// 获取招标内容筛选项
export const getTenderFilterApi = () => {
  return http.request<void>(
    "get",
    "/eesa-report/Policy/front/openApi/V1.0/getBiddingContent",
  );
};

// 获取招标内容时间筛选项
export const getTenderTimeFilterApi = () => {
  return http.request<void>(
    "get",
    "/eesa-report/Policy/front/openApi/V1.0/getReleaseTime",
  );
};

// 招标月度分析查找结果
export const getBiddingDynamicsListApi = (id: number) => {
  return http.request<void>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getMonthlyBiddingAnalysis?contentDict=${id}`,
  );
};

// 招标企业分析查找结果
export const getBusinessDynamicsListApi = (params: any) => {
  return http.request<void>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getEnterpriseBiddingAnalysis`,
    {
      params,
    },
  );
};
// 招标地区分析查找结果
export const getRegionDynamicsListApi = (params: any) => {
  return http.request<void>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getRegionBiddingAnalysis`,
    {
      params,
    },
  );
};

// 获取招标区域分析颜色
export const getRegionColorApi = (params) => {
  return http.request<void>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getRegionBiddingAnalysisColour`,
    {
      params,
    },
  );
};

// 招标查找-招标内容
export const getBiddingContentApi = () => {
  return http.request<void>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getBiddingContentBox`,
  );
};
// 中标内容列表
export const bidWinningContentData_V2 = () => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/V1.0/biddingContentBox",
  );
};
// 中标时间
export const winingBidTime = () => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/winningBidTime",
  );
};
// 时长列表
export const durationData_V2 = () => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/V1.0/energyStorageDurationBox",
  );
};
// 技术类型列表
export const technologyType_V2 = () => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/V1.0/technologyTypeBox",
  );
};
// 应用场景下拉框
export const applicationScenariosBox = (params) => {
  return http.request(
    "post",
    `/eesa-report/priceTracking/front/openApi/V1.0/applicationScenariosBox?type=${params}`,
  );
};
// 中标容量分析
export const capacityAnalysis_V2 = (data) => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/analyzeBarGraph",
    { data },
  );
};
// 中标企业分析
export const enterpriseAnalysis = (data) => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/enterpriseAnalysis",
    { data },
  );
};
// 中标分析报告
export const winningReport = (data) => {
  return http.request(
    "post",
    "/eesa-report/priceTracking/front/openApi/v1.0/winningReport",
    { data },
  );
};
