import { http } from "@/utils/http";

// 退出登录
export const loginOutApi = token => {
  return http.request<{ resp_code: number; datas: any }>(
    "post",
    `/api-uaa/oauth/remove/token?access_token=${token}`
  );
};

//获取用户信息
export const getUserInfo = () => {
  return http.request<{ datas; resp_code }>("get", "/api-user/users/current");
};
// 获取用户详细信息
export const getUserDetailInfo = () => {
  return http.request<{ datas; resp_code }>("post", "/api-user/account/getAccountInfo");
};

//获取图片域名
export const configListBefore = params => {
  return http.request<void>("get", "/api-user/openApi/configListBefore", {
    params: { value: params }
  });
};

// 获取加密密钥
export const getPublicKeyApi = () => {
  return http.request<void>("post", "/api-uaa/clients/findPublicKey");
};

// 获取小程序二维码
export function getQrCode() {
  return http.request<void>("post", `/api-user/wx/miniapp/front/v1.0/loginQRCode`,{
    params: { tenantId: 'iReport-front', specialBlob: true },
    responseType: 'blob',
  });
}

// 轮询登录
export function pollLogin(params) {
  return http.request<void>("post", `/api-user/wx/miniapp/front/v1.0/queryUserLogin`,{
    params,
  });
}

// 发送验证码
export function sendCode(params) {
  return http.request<void>("get", `/api-user/user/sendLoginSMS`,{
    params,
  })
}

// 登录
export function login(params) {
  return http.request<void>("post", `/api-uaa/oauth/token`,{
    params
  })
}

// 更新用户信息
export function updateUserInfo(data:any) {
  return http.request<void>("post", `/api-user/account/updateAccountInfo`,{
    data
  })
}
// 修改手机号发送验证码
export function modifyMbCode() {
  return http.request<void>("get", `/api-user/account/sendBoundMobileSMS`)
}
export function modifyMbCode1(params) {
  return http.request<void>("get", `/api-user/account/sendBoundMobileSMS?mobile=${params}`)
}
// 验证原手机验证码
export function verifyMbCode(params) {
  return http.request<void>("get", `/api-user/account/nextStep`,{
    params
  })
}
// 修改手机号
export function modifyMb(data:any) {
  return http.request<void>("post", `/api-user/account/modifyMobile`,{
    data
  })
}