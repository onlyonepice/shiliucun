import { http } from "@/utils/http";

// 行业洞察
export const getReNewsInFormations = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/alliance/newsInformation/front/openApi/v1.1/getReNewsInformations`,
    {
      params
    }
  );
};

//招标动态
export const getLatestTender = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/Policy/front/openApi/V1.0/getLatestTender`,
    {
      params
    }
  );
};
//最新政策
export const getLatestPolicy = (data) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/eesa-report/Policy/front/openApi/all/V1.0/getLatestPolicy`,
    {
      params:data
    }
  );
};
//白皮书
export const getWhitePaper = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report//alliance/whitePaper/front/openApi/v1.1/getWhitePaper`,
    {
      params
    }
  );
};