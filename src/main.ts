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
const app = createApp(App);
app.config.warnHandler = () => null;

createApp(App)
  .use(store)
  .use(router)
  .use(components)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");
