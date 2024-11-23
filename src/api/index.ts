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