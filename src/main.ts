import "animate.css";
import App from "./App.vue";
import "./style/index.scss";
import "./style/element-plus.scss";
import router from "./router";
import { createApp } from "vue";
import { store } from "./store";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import components from "@/components/index";
import * as Sentry from "@sentry/vue";
import { useUserStore } from "@/store/modules/user";
const { VITE_ENV } = import.meta.env;
const app = createApp(App);
app.config.warnHandler = () => null;

// 上传报错信息至 sentry 平台
Sentry.init({
  dsn: "https://eaa2d33f5f4a1325e29c392cafb9f164@sentry.eesaenergy.com/4",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  autoSessionTracking: true,
  tracesSampleRate: 1.0,
});
// 只监听生产环境错误
window.addEventListener("error", (event) => {
  // 可以在这里进行错误的处理和上报
  // 上报错误到 Sentry
  Sentry.captureException(`环境：** ${VITE_ENV} **
  用户名：${useUserStore().userInfo.username || "未登录"}
    具体报错信息：${event.error}
  `);
});

createApp(App)
  .use(store)
  .use(router)
  .use(components)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");
