import "animate.css";
import App from "./App.vue";
import "./style/index.scss";
import router from "./router";
import { createApp } from "vue";
import { store } from "./store";
import "./style/element-plus.scss";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const app = createApp(App);
app.config.warnHandler = () => null;

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");
