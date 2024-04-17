import { http } from "@/utils/http";
export const sddFindList = (data) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-report/energyStorageFront/financingPlan/front/v1.0/sddFindList",
    { data },
  );
};
