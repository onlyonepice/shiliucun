import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 获取工商业测算lite地区数据
export const getRegionColorApi = () =>
  http.request<responseType>(
    "get",
    "/eesa-data-center/electricity/calculate/openApi/v1.1/queryRegionIds",
  );
