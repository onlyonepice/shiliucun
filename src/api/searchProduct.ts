import { http } from "@/utils/http";

// 查询冷却方式
export const getCoolDownApi = (data: any) => {
  return http.request<void>(
    "post",
    "/eesa-data-center/sysDict/front/v1.0/selectByTypeDefaultHideData",
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
    "/eesa-report/energyStorageProduct/energyStorageProduct/openApi/v1.0/list",
    { data },
  );
};

// 获取产品详情
export const getProductDetailApi = (params: any) => {
  return http.request<void>(
    "get",
    "/eesa-report/energyStorageProduct/energyStorageProduct/openApi/v1.0/detail",
    { params },
  );
};
// 获取产品详情其他关联产品列表
export const getProductDetailListApi = (params: any) => {
  return http.request<void>(
    "get",
    `/eesa-report/energyStorageProduct/energyStorageProduct/front/v1.0/queryOtherProduct`,
    { params },
  );
};

// 获取产品对比
export const getProductComparedApi = (params: any) => {
  return http.request<void>(
    "get",
    `/eesa-report/energyStorageProduct/energyStorageProduct/front/v1.0/contrast?ids=${params.ids}&productType=${params.productType}`,
  );
};

// 获取产品详情
export const getProductDetailsApi = (params) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    "/eesa-report/energyStorageProduct/energyStorageProduct/openApi/v1.0/detail",
    { params },
  );
};
// 表单回填详情接口
export const getProductDetailsEditApi = (id) => {
  return http.request<{ resp_code: number; datas: any }>(
    "get",
    "/eesa-report/energyStorageProduct/energyStorageProduct/front/v1.0/getProductById",
    { params: { id } },
  );
};
// 上传修改参数
export const productCheckInSaveOrUpdateApi = (data: any) => {
  console.log("44444", data);

  return http.request<{ resp_code: number; datas: any }>(
    "post",
    "/eesa-report/energyStorageProduct/energyStorageProduct/front/v1.0/saveOrUpdate",
    { data },
  );
};
// 个人中心_我的产品
export const getProductCheckInListApi = (data: {
  limit: number;
  page: number;
}) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    "/eesa-report/energyStorageProduct/energyStorageProduct/front/v1.0/getCurrentUserProduct",
    { data },
  );
};

// 模糊查询企业
export const getEnterpriseListApi = (params: any) => {
  return http.request<void>(
    "get",
    "/eesa-industrial-map/tEnterprise/back/V1.0/fuzzyMatching",
    { params },
  );
};

// 查询企业详情
export const getEnterpriseDetailApi = (data: any) => {
  return http.request<void>(
    "post",
    "/eesa-industrial-map/tEnterprise/openApi/v1.0/wxAppDetails",
    { data },
  );
};
