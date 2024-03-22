import { http } from "@/utils/http";

// 获取白皮书列表
export const getPaperList = () => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    `/eesa-report/alliance/whitePaper/front/openApi/v1.1/getTopSelected`,
  );
};