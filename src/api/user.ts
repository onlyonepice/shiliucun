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

//获取图片域名
export const configListBefore = params => {
  return http.request<void>("get", "/api-user/configListBefore/", {
    params: { value: params }
  });
};

// 获取加密密钥
export const getPublicKeyApi = () => {
  return http.request<void>("post", "/api-uaa/clients/findPublicKey");
};

// 获取小程序二维码
export function getQrCode() {
  return http.request<void>("post", `/api-user/wx/miniapp/front/v1.0/loginQRCode?tenantId=iReport-front`,{
    params: { specialBlob: true },
    responseType: 'blob',
  });
}

// 轮询登录
export function pollLogin(params) {
  return http.request<void>("post", `/api-user/wx/miniapp/front/v1.0/queryUserLogin`,{
    params,
  });
}
