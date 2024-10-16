import { http } from "@/utils/http";

// 获取支付列表
export function getPayInfoList() {
  return http.request(
    "POST",
    "/eesa-report/product/product/front/v1.0/clientList",
  );
}

// 获取支付信息-微信
export function getMemberPayInfo(data) {
  return http.request("POST", "/eesa-report/user/order/pay/v1.0/createOrder", {
    data,
  });
}
// 获取支付信息-支付宝
export function getMemberPayInfoALi(data) {
  return http.request(
    "POST",
    "/eesa-report/user/order/pay/v1.0/alipayCreateOrder",
    { data },
  );
}

// 获取支付结果
export function getPayResult(data) {
  return http.request("GET", "/eesa-report/user/order/front/v1.0/orderStatus", {
    params: data,
  });
}

// 获取vip列表配置
export function getVipConfigListApi() {
  return http.request(
    "get",
    "/api-user/system/openApi/front/v1.0/getPermissionChart",
  );
}
// 获取会员动态数据
export const getMemberNews = (params: { limit: number; page: number }) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-report/alliance/memberNews/openApi/v1.1/getReMemberNews",
    { params },
  );
};
