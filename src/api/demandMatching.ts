import { http } from "@/utils/http";

// 获取需求详情
export const getDemandDetailApi = (params: any) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-industrial-map/need/need/openApi/v1.0/getNeedById",
    { params },
  );
};

// 报名需求
export const applyDemandApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-industrial-map/need/apply/front/V1.0/apply",
    { data },
  );
};

// 获取报名列表
export const getApplyListApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-industrial-map/need/apply/openApi/v1.0/apply/getApplyByNeedId",
    { data },
  );
};
