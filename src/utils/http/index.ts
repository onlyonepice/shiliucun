import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig,
  defaultProjectConfig
} from "./types.d";
import { toType } from '../index'
import { encrypt } from "@EESA/components/src/librarys/jsencrypt";
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/auth";
import { stringify } from "qs";
const { VITE_GLOB_API_URL } = import.meta.env;

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};
const { clientId } = defaultProjectConfig

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

        // 添加平台标识
        config.headers["tenant"] = defaultProjectConfig.clientId;
        // 定义请求链接
        config.url = config.url.indexOf('http') === -1 ? `${VITE_GLOB_API_URL}${config.url}` : config.url;
        // 接口加密
        config.headers["sign"] = encrypt(config);
        // 添加token
        const token = getToken();

        config.headers["Authorization"] = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X3R5cGUiOiJhZG1pbiIsInVzZXJfbmFtZSI6IjE3MDgzMTI5MTE1NzEiLCJzY29wZSI6WyJhbGwiXSwiaWQiOjczNTUsImV4cCI6MTcxMTUyOTY2MCwidHlwZSI6IlJFR0lTVEVSIiwiYXV0aG9yaXRpZXMiOlsiUEVSU09OX01FTUJFUl9VU0VSIl0sImp0aSI6IjdiMzE5N2RlLWU0MjktNGYyMi04NmZmLTdiZGE2MjhhMTYxYyIsImNsaWVudF9pZCI6ImlSZXBvcnQtZnJvbnQifQ.I-rg7B49_pFIy_bvywX8621jqJgW3g-_diLWpBd0bAXh5SciDzz4jCOd2feoO_tRqugzqGwpTTMeJBqBjZAE3nRASqtWZPKGYzz8OKctae-gG83o5tgXbU008xeyG8EawZ_4gZiHyN7dfM0CXWPJCQ0e83mRdmphKv-ORn48a8U";
        // if (token) {
        //   config.headers["Authorization"] = "Bearer " + token;
        // } else {
        //   config.headers["Authorization"] =
        //     "Basic " +
        //     window.btoa(
        //       defaultProjectConfig.clientId +
        //         ":" +
        //         defaultProjectConfig.clientSecret
        //     );
        // }

        return config
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const { config, data }  = response
        const code = data.resp_code ?? data.code;
        if (toType(data) === 'blob') {
          return response
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
          ElMessage({ message: data.resp_msg || data.message, type: 'error' })
        }
        return data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp();
