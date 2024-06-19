import { http } from "@/utils/http";
interface Request {
  resp_code: number;
  datas: Array<{ any }> | Object;
}
// /electricityPriceTracking/front/openApi/v1.1/getTariffLevelIdByElectricityTypeOneName
//获取地区数据
export const apiRegionalData = (params: { type: string } | null) => {
  return http.request<{ datas: Array<any> }>(
    "get",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/queryRegionIds",
    { params: params || {} },
  );
};

//获取特殊地区数据
export const querySpecialRegionIdsApi = (params: { type: string } | null) => {
  return http.request<{ datas: Array<any> }>(
    "get",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingSpecial/openApi/v1.0/querySpecialRegionIds",
    { params: params || {} },
  );
};

//获取特殊地区用电类型 电压等级
export const electricityTypeVoltageLevelApi = (params) => {
  return http.request<{ datas: Array<any> }>(
    "get",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingSpecial/openApi/v1.0/getElectricityTypeVoltageLevel",
    { params },
  );
};
// 分股价差筛选项
export const getPeakAndValley = () => {
  return http.request<Request>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getPeakValleySpread",
  );
};
// 获取电压等级
export const getVoltageLevel = (params) => {
  return http.request<Request>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getTariffLevelIdByElectricityTypeOneName",
    { params },
  );
};
// 获取月份
export const getMonth = (params) => {
  return http.request<{ datas: Array<any> }>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getYearsByRegionElectricityTypeOneName",
    { params },
  );
};
// 各省峰谷时段
export const getNewTimeSharing = () => {
  return http.request<{ datas: Array<any> }>(
    "post",
    "/eesa-report/front/openApi/v1.1/getNewTimeSharing",
  );
};
// 获取差异排名
export const getDifferentialRanking = (data) => {
  return http.request<{ resp_code: number; datas: Array<any> }>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getDifferentialRanking",
    { data },
  );
};
// 时/月-获取用电类型2
export const getElectricityType = (params) => {
  return http.request<Request>(
    "get",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getElectricityType",
    { params },
  );
};
// 分时月份
export const getMonthByTime = (data) => {
  return http.request<{ datas: Array<any>; resp_code: number }>(
    "post",
    "/eesa-report/electricityTimeShare/electricityTimeShareShow/openApi/v1.1/getSelectMonth",
    { data },
  );
};
// 分月电价
export const getMonthPrice = (data) => {
  return http.request<Request>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getMonthlyTariff",
    { data },
  );
};
// 分时电价
export const getTimePrice = (data) => {
  return http.request<{
    datas: {
      capacityElectricityPrice: number;
      demandElectricityPrice: number;
      timeElectricityPriceResps: Array<any>;
    };
  }>(
    "post",
    "/eesa-report/electricityTimeShare/electricityTimeShareShow/openApi/v1.1/getTimeElectricityPrice",
    { data },
  );
};
// 获取分月差价
export const getMonthDifference = (data) => {
  return http.request<Request>(
    "post",
    "/eesa-report/electricityPriceTracking/electricityPriceTrackingShow/openApi/v1.1/getMonthlyDifference",
    { data },
  );
};
// 请求放电策略
export const getDischargeStrategy = (params) => {
  return http.request<{ datas: { chargeDischargeStrategy: any } }>(
    "get",
    "/eesa-report/front/openApi/v1.1/getChargeDischargeStrategy",
    { params },
  );
};
// 获取各省峰谷时段电价图片
export const getPeakAndValleyImage = () => {
  return http.request<Request>(
    "post",
    "/eesa-report/electricityFutureTimeShare/front/v1.1/getNewTimeSharingPicture",
  );
};
