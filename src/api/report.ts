import { http } from "@/utils/http";

// 获取白皮书列表
export const getPaperList = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/alliance/whitePaper/front/openApi/v1.1/getTopSelected`,
  );
}
//获取行业洞察列表数据
export const getReNewsInformations = (params: { limit: number, page: number }) => {
  return http.request<{ datas; resp_code }>("get", "/eesa-report/alliance/newsInformation/front/openApi/v1.1/getReNewsInformations",{params});
};
//在线报告
export const getOnlineReportSelected = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/onlineReportNew/front/openApi/v1.1/getOnlineReportSelected`,
    {
      params
    }
  );
};
//置顶在线报告
export const getTopOnlineReportSelected = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/onlineReportNew/front/openApi/v1.1/getTopSelected`,
    {
      params
    }
  );
};
//免费在线报告
export const getFreeOnlineReportSelected = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/onlineReportNew/front/openApi/v1.1/getFreeReportSelected`,
    {
      params
    }
  );
};
//报告标签列表
export const getReportTagList = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/front/openApi/v1.0/tagList`,
  );
};

// 获取季报月报列表
export const reportList = (data) => {
  return http.request<{ resp_code: number; datas: any; resp_msg: string }>(
    "get",
    `/eesa-report/alliance/quarterlyMonthlyReport/front/openApi/v1.1/getMonthlyReport`,
    {params: data}
  );
}

// 获取是否可以查看季报月报详情
export const quarterlyMonthlyLimits = () => {
  return http.request<{ resp_code: number; datas: any; resp_msg: string }>(
    "get",
    `/eesa-report/alliance/quarterlyMonthlyReport/front/v1.1/getQuarterlyMonthlyLimits`
  );
}
