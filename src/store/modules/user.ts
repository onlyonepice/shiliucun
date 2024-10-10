import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import {
  getUserInfo,
  configListBefore,
  getPermissionApi,
  getUserDetailInfo,
} from "@/api/user";
import { getPublicKeyApi } from "@/api/user";
import { notReadNumApi } from "@/api/home";
import { removeToken } from "@/utils/auth";
import router from "@/router";
const { VITE_ENV } = import.meta.env;

export const useUserStore = defineStore({
  id: "userStore",
  state: (): userType => ({
    token: "", // 用户token 用于判断用户登录还是退出 通过watch监听
    fileUrl: "", // 文件路径
    imgUrl: {}, // i-report报告缓存
    userInfo: {
      roles: [],
    }, // 用户信息
    accountInfo: {}, // account用户信息
    publicKey: "", // 加密密钥 用于监听
    openLoginVisible: false, // 打开登录弹窗
    openVipVisible: false, // 打开vip弹窗
    openVipTitle: "开通VIP会员，继续使用该功能。",
    openVipSubmitTitle: "开通会员",
    permissionList: [], // 用户权限
    showMembersBuy: false, //订阅会员弹框
    comparedList: [], // 产品对比列表
    showConsultationNav: true, // 展示产品二维码
    showNewUserVip: false, // 新用户开通会员
    hasNotRead: 0, // 未读消息
    businessList: [
      { label: "材料", value: "材料" },
      { label: "电芯", value: "电芯" },
      { label: "PCS", value: "PCS" },
      { label: "BMS", value: "BMS" },
      { label: "EMS", value: "EMS" },
      { label: "大储系统", value: "大储系统" },
      { label: "工商业系统", value: "工商业系统" },
      { label: "户用系统", value: "户用系统" },
      { label: "半导体", value: "半导体" },
      { label: "消防热管理", value: "消防热管理" },
      { label: "集装箱", value: "集装箱" },
      { label: "生产设备", value: "生产设备" },
      { label: "测控设备", value: "测控设备" },
      { label: "投资", value: "投资" },
      { label: "EPC", value: "EPC" },
      { label: "认证", value: "认证" },
      { label: "业主", value: "业主" },
      { label: "回收", value: "回收" },
      { label: "充电", value: "充电" },
      { label: "运营", value: "运营" },
      { label: "行业咨询", value: "行业咨询" },
      { label: "金融租赁", value: "金融租赁" },
      { label: "云服务", value: "云服务" },
      { label: "物流", value: "物流" },
      { label: "协会联盟", value: "协会联盟" },
    ], // 业务范围数组
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
    // 设置产品对比列表
    setComparedList(list: any) {
      this.comparedList = list;
    },
    // 删除对比列表中一项
    deleteComparedList(index: any) {
      this.comparedList.splice(index, 1);
    },
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
    // 打开订阅会员弹窗
    openMembersBuy(type: Boolean) {
      this.showMembersBuy = type;
    },
    // 打开开通vip弹窗
    openVip(type: Boolean) {
      this.openVipVisible = type;
      if (type === false) {
        setTimeout(() => {
          this.openVipTitle = "开通VIP会员，继续使用该功能。";
        }, 500);
      }
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
      if (this.token === "") {
        return this.openLogin(true);
      }
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
            if (response.resp_code === 0) {
              this.getPermissionList();
              window.localStorage.setItem("VIP", data.roles[0].code);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取account信息
    async handleGetAccountInfo() {
      return new Promise<void>((resolve, reject) => {
        getUserDetailInfo()
          .then((response) => {
            const data = response["datas"];
            this.accountInfo = data;
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
              this.imgUrl = datas.find((item) => item.type === "REPORT_CACHE");
              resolve(datas);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取未读数量
    async getNotReadNum() {
      const { datas, resp_code } = await notReadNumApi();
      if (resp_code === 0) {
        this.hasNotRead = datas;
      }
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
