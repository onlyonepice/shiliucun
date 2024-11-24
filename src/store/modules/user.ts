import { defineStore } from "pinia";
import { store } from "@/store";
import { postUserInfoApi, getBaseConfigApi, getNoticeConfigApi } from "@/api/index";
import { removeToken } from "@/utils/auth";
import router from "@/router";

export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    token: "", // 用户token 用于判断用户登录还是退出 通过watch监听
    openLoginVisible: false, // 打开登录弹窗
    openPayGameVisible: false, // 购买游戏弹窗
    openAnnouncement: false, // 打开公告弹窗
    openDownloadVisible: false, // 打开公告弹窗
    announcementInfo: [], // 公告信息
    openLoginType: "login", // 登录弹窗类型 login/register
    currentGame: {},
    configInfo: {}, // 配置信息
    userInfo: {
      avatar_url: "",
      email: "",
      nickname: "",
      uid: "",
      coin: 0,
    }, // 用户信息
  }),
  getters: {},
  actions: {
    // 打开登录弹窗
    openLogin(type: Boolean, dialogType = "login") {
      this.openLoginVisible = type;
      this.openLoginType = dialogType;
    },
    openPayGame(type: Boolean, gameInfo) {
      this.openPayGameVisible = type;
      this.currentGame = gameInfo
    },
    openDownload(type: Boolean) {
      this.openDownloadVisible = type;
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.token = "";
      removeToken();
      router.push("/home");
    },
    async announcementDialog() {
      const { data, code } = await getNoticeConfigApi();
      code === 200 && (this.announcementInfo = data[0]);
      if (data.length === 0) {
        return;
      }
      if (localStorage.getItem("configInfoIds") === null) {
        this.openAnnouncement = true;
        localStorage.setItem("configInfoIds", JSON.stringify([data[0].id]));
      } else {
        const _list = JSON.parse(localStorage.getItem("configInfoIds"));
        if (_list.includes(data[0].id)) {
          return;
        }
        this.openAnnouncement = true;
        localStorage.setItem("configInfoIds", JSON.stringify(_list.concat(_list.push(data[0].id))));
      }
    },
    /** 基础配置 */
    async handleConfig() {
      return new Promise<void>((resolve, reject) => {
        getBaseConfigApi().then((response) => {
          const { data } = response;
          this.configInfo = data;
        });
      });
    },
    /** 获取用户信息 */
    async handleGetUserInfo() {
      return new Promise<void>((resolve, reject) => {
        postUserInfoApi()
          .then((response) => {
            const data = response["data"];
            this.userInfo = data.user;
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
