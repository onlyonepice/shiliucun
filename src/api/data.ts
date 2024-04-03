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
