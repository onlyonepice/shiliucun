import { http } from "@/utils/http";

// 行业洞察
export const getReNewsInFormations = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/alliance/newsInformation/front/openApi/v1.1/getReNewsInformations`,
    {
      params,
    },
  );
};

//招标动态
export const getLatestTender = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getLatestTender`,
    {
      params,
    },
  );
};
//最新政策
export const getLatestPolicy = (data) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/eesa-report/Policy/front/openApi/all/V1.0/getLatestPolicy`,
    {
      params: data,
    },
  );
};

//首页搜索详情
export const globalSearch = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/eesa-report/homePage/homepageFrontier/front/openApi/V1.0/globalSearch`,
    {
      params,
    },
  );
};
//储能前沿搜索详情
export const getByKeyword = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/eesa-report/homePage/homepageFrontier/front/openApi/V1.0/getByKeyword`,
    {
      params,
    },
  );
};
//首页行业报告
//免费在线报告
export const getHomeOnlineReportSelected = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/onlineReportNew/front/openApi/v1.1/getHomeOnlineReport`,
    {
      params,
    },
  );
};

// 修改企业名称
export const updateCompanyName = (params) => {
  return http.request<{ resp_code: number; paramss: any }>(
    "get",
    `/api-user/front/v1.0/updateCompanyName`,
    {
      params,
    },
  );
};
// 查询明星企业
export const frontSelectList = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/eesa-industrial-map/tAd/front/V1.0/frontSelectList`,
    {
      data: { regionCodes: ["156"], searchBox: "", sysDictIds: [] },
    },
  );
};
// 需求大厅
export const getHomePage = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    "/eesa-data-center/need/need/openApi/v1.0/homePage",
  );
};

// 更新日志
export const getUpdateLogApi = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-data-center/system/sysUpdateLog/openApi/v1.0/getSysUpdateLog?platform=WEB`,
  );
};
