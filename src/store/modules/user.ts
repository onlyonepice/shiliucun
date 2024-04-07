import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { getUserInfo, configListBefore, getPermissionApi } from "@/api/user";
import { getPublicKeyApi } from "@/api/user";
import { removeToken } from "@/utils/auth";
import router from "@/router";
const { VITE_ENV } = import.meta.env;

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token: "", // 用户token 用于判断用户登录还是退出 通过watch监听
    fileUrl: "", // 文件路径
    userInfo: {}, // 用户信息
    publicKey: "", // 加密密钥 用于监听
    openLoginVisible: false, // 打开登录弹窗
    openVipVisible: false, // 打开vip弹窗
    permissionList: [], // 用户权限
  }),
  getters: {
    getFileUrl(): string {
      return this.fileUrl;
    },
    getUserInfo(): string {
      return this.userInfo;
    },
    getUserAccount(): object {
      return this.userAccount;
    },
    getRememberPsd(): boolean {
      return this.isRememberPsd;
    },
  },
  actions: {
    // 获取加密密钥
    async getPublicKey() {
      return new Promise((resolve, reject) => {
        getPublicKeyApi()
          .then((data) => {
            if (data["resp_code"] === 0) {
              window.localStorage.setItem("publicKey", data["datas"]);
              this.publicKey = data["datas"];
              resolve(data);
            } else {
              reject(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 打开登录弹窗
    openLogin(type: Boolean) {
      this.openLoginVisible = type;
    },
    // 打开开通vip弹窗
    openVip(type: Boolean) {
      this.openVipVisible = type;
    },
    // 获取用户权限
    async getPermissionList() {
      const { datas, resp_code }: any = await getPermissionApi();
      if (resp_code === 0) {
        this.permissionList = datas;
      }
    },
    // 校验权限功能
    checkPermission(key: String) {
      const data = this.permissionList.find((item: any) => item.code === key);
      if (this.permissionList.length === 0 || !data.permission) {
        this.openVip(true);
        return false;
      }
      return true;
    },
    // 设置加密密钥
    setPublicKey() {
      this.publicKey = window.localStorage.getItem("publicKey");
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
        getUserInfo()
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
    /**获取图片域名 */
    async getConfigListBefore() {
      return new Promise<void>((resolve, reject) => {
        configListBefore(VITE_ENV)
          .then(({ datas }: any) => {
            if (datas) {
              this.fileUrl = datas[0].url;
              resolve(datas);
            }
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
