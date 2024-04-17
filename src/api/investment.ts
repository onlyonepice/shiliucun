import { http } from "@/utils/http";

//获取投资回报性分析地区数据
export const apiAreaData = () => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/electricityPriceTracking/front/openApi/v1.1/queryRegionIds",
  );
};

// 获取策略
export const apiStrategy = (params) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/front/openApi/v1.1/getChargeDischargeStrategy",
    { params },
  );
};

// 获取用电类型2和电压等级
export const apiElectricityType = (params) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/investmentIndustryCommerce/front/v1.1/getElectricityType",
    { params },
  );
};

// 获取产品列表
export const apiProductList = () => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/investmentProductLibrary/front/v1.0/frontFindList",
  );
};
// 选择产品获取详情
export const apiProductDetail = (params) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/investmentProductLibrary/frontBack/v1.0/findUserById",
    { params },
  );
};

// 年利用天数列表
export const apiYearsList = () => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/reInvestmentAnnualDays/front/v1.1/getFindList",
  );
};
// 贴现率列表
export const apiRateList = () => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/reInvestmentBankRate/front/v1.1/getFindList",
  );
};
// 测算周期列表
export const apiPeriodList = () => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/reInvestmentCalculationPeriod/front/v1.1/getFindList",
  );
};

// 分析查询
export const apiAnalyzeSearch = (data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-report/investmentIndustryCommerce/front/v1.1/search",
    { data },
  );
};

// 获取图表数据
export const apiCanvasData = (data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-report/electricityPriceTracking/front/openApi/v1.1/getMonthlyDifference",
    { data },
  );
};
// 获取滑块配置
export const apiSliderConfig = (data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-report/electricityTimeShare/front/openApi/v1.1/dynamicPeriodType",
    { data },
  );
};
// 评论
export const apiComment = (data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-report/sysFeedback/front/v1.1/userFeedback",
    { data },
  );
};

// 文件转换
export const apiFileConversion = (params, data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/file-service/file/convertFile",
    {
      params,
      data,
      responseType: "blob",
    },
  );
};
