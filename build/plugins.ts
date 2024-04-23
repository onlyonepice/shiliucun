import { cdn } from "./cdn";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import removeConsole from "vite-plugin-remove-console";
import removeNoMatch from "vite-plugin-router-warn";
import { configCompressPlugin } from "./compress";
import eslintPlugin from "vite-plugin-eslint";
import type { PluginOption } from "vite";

export function getPluginsList(
  VITE_CDN: boolean,
  VITE_COMPRESSION,
): PluginOption[] {
  return [
    vue(),
    // jsx、tsx语法支持
    vueJsx(),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    /**
     * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
     * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
     * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
     */
    removeNoMatch(),
    eslintPlugin({
      include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
    }),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
  ];
}
