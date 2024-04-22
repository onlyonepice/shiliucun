import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import "element-plus/dist/index.css";
import "animate.css";
import "./style/index.scss";
import "./style/element-plus.scss";
import router from "./router";
import { store } from "./store";
const app = createApp(App);
app.config.warnHandler = () => null;

//
const modules: Record<string, any> = import.meta.glob(
  [
    "./components/Business/**.vue",
    "./components/Common/**.vue",
    "./components/Common/Dialog/**.vue",
  ],
  {
    eager: true,
  },
);
Object.keys(modules).forEach((key) => {
  console.log("========", key);
});

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");
