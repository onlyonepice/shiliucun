import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
// import { router } from "@/router";
import { storageSession } from "@pureadmin/utils";
import {
  // getLogin,
  refreshTokenApi,
  getUserInfo,
  configListBefore
} from "@/api/user";
import { UserResult, getPublicKeyApi } from "@/api/user";
import { setToken, removeToken } from "@/utils/auth";
import { regIP } from "@/utils/rule";
import { ElMessage } from "element-plus";
const { VITE_APP_DOMAIN } = import.meta.env;

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({

    publicKey: ""
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
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    // 获取加密密钥
    async getPublicKey() {
      return new Promise((resolve, reject) => {
        getPublicKeyApi()
          .then(data => {
            if (data["resp_code"] === 0) {
              this.publicKey = data["datas"];
              window.localStorage.setItem("publicKey", data["datas"]);
              resolve(data);
            } else {
              reject(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 设置加密密钥
    setPublicKey() {
      this.publicKey = window.localStorage.getItem("publicKey");
    },
    /** 登入 */
    async loginByUsername(data) {
      removeToken();
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data["resp_code"] === 0) {
              data["datas"] = Object.assign(data["datas"], {
                domain: regIP.test(window.location.hostname)
                  ? window.location.hostname
                  : VITE_APP_DOMAIN
              });
              setToken(data["datas"]);
              resolve(data);
            } else {
              reject(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      if (!JSON.parse(window.localStorage.getItem("isRememberPsd"))) {
        window.localStorage.removeItem("userAccountMobile");
        window.localStorage.removeItem("userAccountPsd");
      }
      this.username = "";
      this.roles = [];
      removeToken();
      // router.push("/");
    },
    /** 获取用户信息 */
    async handleGetUserInfo() {
      return new Promise<void>((resolve, reject) => {
        getUserInfo()
          .then(response => {
            const data = response["datas"];
            this.userInfo = data;
            if (data.roles.length === 0 || data.roles === undefined) {
              window.localStorage.setItem("roles", JSON.stringify(false));
              ElMessage({ message: "暂无权限，请联系管理员", type: "error" });
              reject("暂无权限，请联系管理员");
            } else {
              window.localStorage.setItem("roles", JSON.stringify(true));
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**获取图片域名 */
    async getConfigListBefore() {
      return new Promise<void>((resolve, reject) => {
        let params = "";
        switch (import.meta.env.MODE) {
          case "development":
            params = "dev";
            break;
          case "dev":
            params = "dev";
            break;
          case "production":
            params = "prod";
            break;
          case "test":
            params = "test";
            break;
        }
        configListBefore(params)
          .then(data => {
            if (data["datas"]) {
              this.fileUrl = data["datas"][0][params];
              resolve(data["datas"]);
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
