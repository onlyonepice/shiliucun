import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 获取招标查找列表
export const getBidFinderApi = () => {
  return http.request<responseType>(
    "post",
    "/eesa-report/Policy/front/openApi/V1.0/getBidFinder",
  );
};
