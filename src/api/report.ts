import { http } from "@/utils/http";

//获取行业洞察列表数据
export const getReNewsInformations = (params: { limit: number, page: number }) => {
  return http.request<{ datas; resp_code }>("get", "/eesa-report/alliance/newsInformation/front/openApi/v1.1/getReNewsInformations",{params});
};