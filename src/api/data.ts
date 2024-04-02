import { http } from "@/utils/http";

// 获取招标内容筛选项
export const getTenderApi = () => {
  
}

export const getFile = (url, token) => {
  return http.request<void>("get", url, {
    params: { hideError: true },
    headers: {
      "x-oss-meta-token": token,
    },
    responseType: "blob",
  });
};
