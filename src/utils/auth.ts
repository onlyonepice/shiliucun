import Cookies from "js-cookie";
import { regIP } from "@/utils/rule";

const { VITE_APP_DOMAIN } = import.meta.env;
export const TokenKey = "token";

export interface DataInfo {
  /** token */
  access_token: string;
  /** 跨平台登录 */
  domain?: string;
}

const domain = regIP.test(window.location.hostname)
  ? window.location.hostname
  : VITE_APP_DOMAIN;

/** 获取`token` */
export function getToken() {
  return Cookies.get(TokenKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 */
export function setToken(data: DataInfo) {
  const { access_token } = data;
  Cookies.set(TokenKey, access_token, { domain });
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey, { domain });
  sessionStorage.clear();
}
