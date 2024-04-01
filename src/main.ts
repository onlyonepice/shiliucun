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

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
