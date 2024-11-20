import { defineStore } from "pinia";
import { store } from "@/store";
import { postUserInfoApi } from "@/api/index";
import { removeToken } from "@/utils/auth";
import router from "@/router";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    token: "", // 用户token 用于判断用户登录还是退出 通过watch监听
    openLoginVisible: false, // 打开登录弹窗
    openLoginType: "login", // 登录弹窗类型 login/register
  }),
  getters: {},
  actions: {
    // 打开登录弹窗
    openLogin(type: Boolean, dialogType = "login") {
      this.openLoginVisible = type;
      this.openLoginType = dialogType;
      console.log(this.openLoginType);
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.token = "";
      removeToken();
      router.push("/home");
    },
    /** 获取用户信息 */
    async handleGetUserInfo() {
      return new Promise<void>((resolve, reject) => {
        postUserInfoApi()
          .then((response) => {
            const data = response["datas"];
            this.userInfo = data;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
