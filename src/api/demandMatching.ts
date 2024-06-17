import { http } from "@/utils/http";

export const getDemandDetailApi = (params: any) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-industrial-map/need/need/openApi/v1.0/getNeedById",
    { params },
  );
};
