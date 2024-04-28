import { http } from "@/utils/http";

// 查询冷却方式
export const getCoolDownApi = (data: any) => {
  return http.request<void>(
    "post",
    "/eesa-data-center/sysDict/back/V1.0/selectByTypeDefaultHideData",
    { data },
  );
};

// 查产品筛选项列表
export const getProductFilterApi = (params: any) => {
  return http.request<void>(
    "get",
    "/eesa-report/energyStorageProduct/energyStorageProduct/openApi/v1.0/listBrand",
    { params },
  );
};

// 查询产品列表
export const getProductListApi = (data: any) => {
  return http.request<void>(
    "post",
    "/eesa-report/energyStorageProduct/productIndustrialEnergyStorage/openApi/V1.0/list",
    { data },
  );
};
