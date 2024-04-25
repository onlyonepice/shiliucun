import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer,
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig,
  defaultProjectConfig,
} from "./types.d";
import { toType } from "../index";
import { encrypt } from "@EESA/components/src/librarys/jsencrypt";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import { stringify } from "qs";
const { VITE_GLOB_API_URL } = import.meta.env;
import { useUserStoreHook } from "@/store/modules/user";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 1000 * 150,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};
// 请求不带token白名单
const whiteUrlList = [
  "/api-uaa/oauth/token",
  "/api-user/user/sendLoginSMS",
  "/api-user/wx/miniapp/front/v1.0/loginQRCode",
  "/api-user/wx/miniapp/front/v1.0/queryUserLogin",
];
// 导出白名单，设置超长请求接口过期时间
const exportList = [
  "/file-service/eesa/report/file/convertFile",
  "/file-service/eesa/report/wordToBase64",
];

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: any) => {
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        // 导出报告耗时较长，需要设置超时时间 5分钟
        exportList.includes(config.url) && (config.timeout = 1000 * 60 * 5);
        // 添加平台标识
        config.headers["tenant"] = defaultProjectConfig.clientId;
        // 添加token
        const token = getToken();
        if (token && !whiteUrlList.includes(config.url)) {
          config.headers["Authorization"] = "Bearer " + token;
        } else {
          config.headers["Authorization"] =
            "Basic " +
            window.btoa(
              defaultProjectConfig.clientId +
                ":" +
                defaultProjectConfig.clientSecret,
            );
        }
        // 定义请求链接
        config.url =
          config.url.indexOf("http") === -1
            ? `${VITE_GLOB_API_URL}${config.url}`
            : config.url;
        // 接口加密
        config.headers["sign"] = encrypt(config);

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const { config, data } = response;
        const code = data.resp_code ?? data.code;
        if (toType(data) === "blob") {
          return response;
        }
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeResponseCallback === "function") {
          config.beforeResponseCallback(response);
          return data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return data;
        }
        if (code !== 0) {
          switch (code) {
            // 无登录
            case 1001:
              onErrorHandling();
              break;
            case 1:
              onErrorHandling();
              break;
            // token过期
            case 1002:
              onErrorHandling();
              break;
            // 请求接口频繁调用
            case 1003:
              ElMessage.error(data?.resp_msg || "Error");
              break;
            // 小程序登录报错兼容
            case 2044:
              break;
            case 10027:
              break;
            default:
              if (config.params && config.params.hideError) return data;
              ElMessage.error(data?.resp_msg || "Error");
              break;
          }
        }
        return data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      },
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig,
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig,
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig,
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

const onErrorHandling = () => {
  useUserStoreHook().logOut();
};

export const http = new PureHttp();
