import { http } from "@/utils/http";

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
  return http.request<void>("get", "/api-user/openApi/configListBefore", {
    params: { value: params },
  });
};

// 获取加密密钥
export const getPublicKeyApi = () => {
  return http.request<void>("post", "/api-uaa/clients/findPublicKey");
};

// 获取小程序二维码
export function getQrCode() {
  return http.request<void>(
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
  return http.request<void>(
    "post",
    `/api-user/wx/miniapp/front/v1.0/queryUserLogin`,
    {
      params,
    },
  );
}

// 发送验证码
export function sendCode(params) {
  return http.request<void>("get", `/api-user/user/sendLoginSMS`, {
    params,
  });
}

// 登录
export function login(params) {
  return http.request<void>("post", `/api-uaa/oauth/token`, {
    params,
  });
}

// 更新用户信息
export function updateUserInfo(data: any) {
  return http.request<void>("post", `/api-user/account/updateAccountInfo`, {
    data,
  });
}
// 修改手机号发送验证码
export function modifyMbCode() {
  return http.request<void>("get", `/api-user/account/sendBoundMobileSMS`);
}
export function modifyMbCode1(params) {
  return http.request<void>(
    "get",
    `/api-user/account/sendMobileSMS?mobile=${params}`,
  );
}
// 发送修改密码手机验证码
export function modifyPasswordCode() {
  return http.request<void>("get", `/api-user/account/sendPasswordSMS`);
}
// 校验修改密码手机验证码
export function checkPasswordCode(params) {
  return http.request<void>(
    "get",
    `/api-user/account/front/v1.0/verifyPasswordSMS?smsCode=${params}`,
  );
}
// 修改登录密码
export function modifyPasswordApi(data: any) {
  return http.request<void>("post", `/api-user/account/modifyPassword`, {
    data,
  });
}
// 校验修改登录密码
// 验证原手机验证码
export function verifyMbCode(params) {
  return http.request<void>("get", `/api-user/account/nextStep`, {
    params,
  });
}
// 修改手机号
export function modifyMb(data: any) {
  return http.request<void>("post", `/api-user/account/modifyMobile`, {
    data,
  });
}

// 获取地区信息
export function getAreaApi() {
  return http.request<void>(
    "get",
    `/eesa-report/region/openApi/getRegions?level=5&page=1&limit=1000&pcode=156`,
  );
}
// 编辑用户信息
export function editUserInfoApi(data: any) {
  return http.request<void>("post", `/api-user/account/updateAccountInfo`, {
    data,
  });
}

// 获取系列产品
export function getSeriesApi() {
  return http.request<void>("get", `/api-user/users/getRecordingTime`);
}

// 我的订单列表
export function myOrderListApi(data:any) {
  return http.request<void>("post", `/eesa-report/user/order/front/v1.0/getUserOrderPageList`, {
    data,
  });
}

// 我的收藏列表
export function myCollectListApi(params:any) {
  return http.request<void>("get", `/eesa-report/collection/front/v1.1/allReportCollection`, {
    params,
  });
}
// 删除收藏
export function deleteCollectApi(id:number) {
  return http.request<void>("delete", `/eesa-report/collection/front/v1.1/deleteByIds?ids=${id}`);
}