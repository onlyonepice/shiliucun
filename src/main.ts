import { createApp } from 'vue'
import ElementPlus from "element-plus";
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css';
import 'animate.css'
import './registerServiceWorker'
import './style/index.scss'
import './style/element-plus.scss'
import './style/vant-ui.scss'
import router from './router'
import { store } from './store'
const app = createApp(App);
app.config.warnHandler = () => null
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
