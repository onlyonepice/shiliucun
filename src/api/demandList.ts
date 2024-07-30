import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 需求列表-获取分类列表
export const getTypeNotNullApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/need/need/openApi/v1.0/getTypeNotNull",
    { data },
  );
};
// 需求列表-获取需求列表
export const getNeedApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/need/need/openApi/v1.0/getNeed",
    { data },
  );
};
// 需求列表-获取我发布的需求
export const getReleaseNeedApi = (params) => {
  return http.request<responseType>(
    "get",
    "/eesa-data-center/need/need/front/V1.0/getReleaseNeed",
    { params },
  );
};
// 需求列表-获取我报名的需求
export const getApplyNeedApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/need/apply/front/V1.0/apply/need",
    { data },
  );
};
// 需求列表-获取需求类型列表
export const getNeedTypeApi = () => {
  return http.request<responseType>(
    "get",
    "/eesa-data-center/need/need/openApi/v1.0/getNeedType",
  );
};
// 需求列表-发布需求
export const releaseNeedApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/need/need/front/V1.0/releaseNeed",
    { data },
  );
};

// 需求列表-修改需求
export const updateNeedApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/need/need/front/V1.0/updateNeed",
    { data },
  );
};

// 获取需求评价信息
export const getNeedEvaluateApi = (data) => {
  return http.request<responseType>(
    "post",
    "/eesa-data-center/sysDict/openApi/v1.0/queryByTypeAndSuperiorId",
    { data },
  );
};
