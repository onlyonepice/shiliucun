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

// 获取产品详情
export const getProductDetailApi = (params: any) => {
  return http.request<void>(
    "get",
    "/eesa-report/energyStorageProduct/productIndustrialEnergyStorage/openApi/v1.0/detail",
    { params },
  );
};
// 获取产品详情其他关联产品列表
export const getProductDetailListApi = (params: any) => {
  return http.request<void>(
    "get",
    "/eesa-report/energyStorageProduct/productIndustrialEnergyStorage/front/v1.0/queryIndustrialEnergyStorageOtherProduct",
    { params },
  );
};

// 获取产品对比
export const getProductComparedApi = (ids: any) => {
  return http.request<void>(
    "get",
    `/eesa-report/energyStorageProduct/productIndustrialEnergyStorage/front/v1.0/contrast?ids=${ids}`,
  );
};
