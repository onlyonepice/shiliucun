import { http } from "@/utils/http";
import { responseType } from "@/utils/type";

// 登录
export const loginApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/login/email", { data });
};
// 获取用户信息
export const postUserInfoApi = () => {
  return http.request<responseType>("post", "/web/api/user/info");
};

// 发送验证码
export const sendVerificationCodeApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/login/sendCode", {
    data,
  });
};

// 首页轮播图
export const getHomeBannerApi = () => {
  return http.request<responseType>("post", "/web/api/index/banner");
};

// 游戏列表
export const getGameListApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/index/gameList", { data });
};

// 支付列表
export const getPayListApi = () => {
  return http.request<responseType>("post", "/web/api/pay/config");
};
// 创建支付
export const createPayApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/pay/pay", { data });
};
// 轮询订单状态
export const getRechargeListApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/pay/status", {data});
}
// M币记录
export const getRechargeRecordApi = () => {
  return http.request<responseType>("post", "/web/api/user/log")
}
// 支付记录
export const getPayRecordApi = () => {
  return http.request<responseType>("post", "/web/api/user/payOrder")
}