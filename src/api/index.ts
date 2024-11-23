import { http } from "@/utils/http";
import { responseType } from "@/utils/type";
const url = {
  getBanner: 'http://api-1980831594.ap-east-1.elb.amazonaws.com/web/api/index/banner',
  getGameList: 'http://api-1980831594.ap-east-1.elb.amazonaws.com/web/api/index/gameList',
  gameInfo: 'http://api-1980831594.ap-east-1.elb.amazonaws.com/web/api/index/gameInfo'
}

// 登录
export const loginApi = (data: any) => {
  return http.request<responseType>("post", "/web/api/login/email", { data });
};
// 获取用户信息
export const postUserInfoApi = () => {
  return http.request<responseType>("post", "/web/api/user/info");
};
// 获取游戏banner
export const getBanner = () => {
  return http.request<responseType>("post", url.getBanner);
};
// 获取游戏
export const getGameList = (data: any) => {
  return http.request<responseType>("post", url.getGameList, { data });
};
// 获取游戏详情
export const gameInfo = (data: any) => {
  return http.request<responseType>("post", url.gameInfo, { data });
};
