import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 退出登录
export const loginOutApi = (token) => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/api-uaa/oauth/remove/token?access_token=${token}`,
  );
};

//获取用户信息
export const getUserInfo = () => {
  return http.request<{ datas; resp_code }>("get", "/api-user/users/current");
};
// 获取用户详细信息
export const getUserDetailInfo = () => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/api-user/account/getAccountInfo",
  );
};

//获取图片域名
export const configListBefore = (params) => {
  return http.request<responseType>(
    "get",
    "/api-user/openApi/configListBefore",
    {
      params: { value: params },
    },
  );
};

// 获取加密密钥
export const getPublicKeyApi = () => {
  return http.request<responseType>("post", "/api-uaa/clients/findPublicKey");
};

// 获取小程序二维码
export function getQrCode() {
  return http.request<responseType>(
    "post",
    `/api-user/wx/miniapp/front/v1.0/loginQRCode`,
    {
      params: { tenantId: "iReport-front", specialBlob: true },
      responseType: "blob",
    },
  );
}

// 轮询登录
export function pollLogin(params) {
  return http.request<responseType>(
    "post",
    `/api-user/wx/miniapp/front/v1.0/queryUserLogin`,
    {
      params,
    },
  );
}

// 发送验证码
export function sendCode(params) {
  return http.request<responseType>("get", `/api-user/user/sendLoginSMS`, {
    params,
  });
}

// 登录
export function login(params) {
  return http.request<responseType>("post", `/api-uaa/oauth/token`, {
    params,
  });
}

// 更新用户信息
export function updateUserInfo(data: any) {
  return http.request<responseType>(
    "post",
    `/api-user/account/updateAccountInfo`,
    {
      data,
    },
  );
}
// 修改手机号发送验证码
export function modifyMbCode() {
  return http.request<responseType>(
    "get",
    `/api-user/account/sendBoundMobileSMS`,
  );
}
export function modifyMbCode1(params) {
  return http.request<responseType>(
    "get",
    `/api-user/account/sendMobileSMS?mobile=${params}`,
  );
}
// 发送修改密码手机验证码
export function modifyPasswordCode() {
  return http.request<responseType>("get", `/api-user/account/sendPasswordSMS`);
}
// 校验修改密码手机验证码
export function checkPasswordCode(params) {
  return http.request<responseType>(
    "get",
    `/api-user/account/front/v1.0/verifyPasswordSMS?smsCode=${params}`,
  );
}
// 修改登录密码
export function modifyPasswordApi(data: any) {
  return http.request<responseType>(
    "post",
    `/api-user/account/modifyPassword`,
    {
      data,
    },
  );
}
// 校验修改登录密码
// 验证原手机验证码
export function verifyMbCode(params) {
  return http.request<responseType>("get", `/api-user/account/nextStep`, {
    params,
  });
}
// 修改手机号
export function modifyMb(data: any) {
  return http.request<responseType>("post", `/api-user/account/modifyMobile`, {
    data,
  });
}

// 获取地区信息
export function getAreaApi(
  params = { level: 5, page: 1, limit: 1000, pcode: 156 },
) {
  return http.request<responseType>(
    "get",
    `/eesa-report/region/openApi/getRegions`,
    {
      params,
    },
  );
}
// 编辑用户信息
export function editUserInfoApi(data: any) {
  return http.request<responseType>(
    "post",
    `/api-user/account/updateAccountInfo`,
    {
      data,
    },
  );
}

// 获取系列产品
export function getSeriesApi() {
  return http.request<responseType>("get", `/api-user/users/getRecordingTime`);
}

// 我的订单列表
export function myOrderListApi(data: any) {
  return http.request<responseType>(
    "post",
    `/eesa-report/user/order/front/v1.0/getUserOrderPageList`,
    {
      data,
    },
  );
}

// 我的收藏列表
export function myCollectListApi(params: any) {
  return http.request<responseType>(
    "get",
    `/eesa-report/collection/front/v1.1/allReportCollection`,
    {
      params,
    },
  );
}
// 删除收藏
export function deleteCollectApi(id: number) {
  return http.request<responseType>(
    "delete",
    `/eesa-report/collection/front/v1.1/deleteByIds?ids=${id}`,
  );
}

// 获取用户权限
export function getPermissionApi() {
  return http.request<responseType>(
    "get",
    `/api-user/system/rolePermission/front/v1.0/getPermission`,
  );
}

// 获取次数提示
export function getTimesApi(params: any) {
  return http.request<responseType>(
    "get",
    `/eesa-report/homePage/reportNewDataCenter/back/v1.1/numberUses`,
    { params },
  );
}
// 查询字典表选择项（通用）
export function getSelectByTypeApi(data: { type: string }) {
  return http.request<responseType>(
    "post",
    `/eesa-report/front/openApi/v1.0/selectByTypeDefaultHideData`,
    { data },
  );
}
// 获取岗位类型
export function getPositionTypeApi() {
  return http.request<responseType>(
    "post",
    `/api-user/sysDict/front/V1.0/frontSelectTreeByType/positionType`,
  );
}

// 埋点
export function trackApi(data: any) {
  return http.request<responseType>(
    "post",
    `/eesa-data-center/event/back/V1.0/creat`,
    { data },
  );
}

// 获取是否需要评分
export function isNpsMarkApi(moduleName: string) {
  return http.request<responseType>(
    "get",
    `/api-user/satisfaction/front/openApi/V1.0/getSatisfactionQuestionnaire?moduleName=${moduleName}`,
  );
}

// 打分接口
export function scoreMarkApi(data: any) {
  return http.request<responseType>(
    "post",
    `/api-user/satisfaction/front/openApi/V1.0/getSatisfaction`,
    { data },
  );
}
