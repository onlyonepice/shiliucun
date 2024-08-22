import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 获取工商业测算lite地区数据
export const getRegionColorApi = () =>
  http.request<responseType>(
    "get",
    "/eesa-data-center/electricity/calculate/openApi/v1.1/queryRegionIds",
  );

// 获取用电类型2
export const getTechnologyType_V2Api = (params) =>
  http.request<responseType>(
    "get",
    "/eesa-data-center/electricity/calculate/openApi/v1.1/getElectricityType",
    {
      params,
    },
  );
