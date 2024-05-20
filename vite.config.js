import dayjs from "dayjs";
import { resolve } from "path";
import pkg from "./package.json";
import { warpperEnv } from "./build";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { visualizer } from "rollup-plugin-visualizer";
import { loadEnv } from "vite";
/** 当前执行node命令时文件夹的地址（工作目录） */
const root = process.cwd();

/** 路径查找 */
const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};
/** 设置别名 */
const alias = {
  "@": pathResolve("src"),
  "@build": pathResolve("build"),
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
};

export default ({ mode }) => {
  const { VITE_ENV, VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,

    resolve: {
      alias,
    },
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.11.169:8080",
    //     changeOrigin: true, // 设置这个参数可以避免跨域
    //     pathRewrite: {
    //       "^/api": "/"
    //     }
    //   }
    // },
    // 服务端渲染
    server: {
      hmr: true,
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {},
    },
    plugins: [
      getPluginsList(VITE_CDN, VITE_COMPRESSION),
      // 分析打包结果
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: "test.html", //分析图生成的文件名
        open: true, //如果存在本地服务端口，将在打包后自动展示
      }),
    ],
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude,
    },
    build: {
      sourcemap: VITE_ENV !== "prod",
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html"),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
};
