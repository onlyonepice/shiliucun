import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
// import { router } from "@/router";
import {
  getUserInfo,
  configListBefore
} from "@/api/user";
import { getPublicKeyApi } from "@/api/user";
import { setToken, removeToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
const { VITE_ENV } = import.meta.env;

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    fileUrl: "", // 文件路径
    userInfo: {}, // 用户信息
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
    }
  },
  actions: {
    // 获取加密密钥
    async getPublicKey() {
      return new Promise((resolve, reject) => {
        getPublicKeyApi().then(data => {
          if (data["resp_code"] === 0) {
            window.localStorage.setItem("publicKey", data["datas"]);
            resolve(data);
          } else {
            reject(data);s
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 设置加密密钥
    setPublicKey() {
      this.publicKey = window.localStorage.getItem("publicKey");
    },
    /** 前端登出（不调用接口） */
    logOut() {
      removeToken();
      // router.push("/");
    },
    /** 获取用户信息 */
    async handleGetUserInfo() {
      return new Promise<void>((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response["datas"];
          this.userInfo = data;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    /**获取图片域名 */
    async getConfigListBefore() {
      return new Promise<void>((resolve, reject) => {
        configListBefore(VITE_ENV).then(( {datas}:any ) => {
          if ( datas ) {
            this.fileUrl = datas[0].url;
            resolve(datas);
          }
        })
        .catch(error => {
          reject(error);
        });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}