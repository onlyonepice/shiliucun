import { defineAsyncComponent, AsyncComponentLoader } from "vue";
// 解构全局组件
const components = import.meta.glob([
  "./Business/*.vue",
  "./Common/*.vue",
  "./Common/Dialog/*.vue",
]);

export default function install(app) {
  for (const [key, value] of Object.entries(components)) {
    console.log("=========", key);
    const _key = key.split("/");
    const _name = _key[_key.length - 1].split(".vue")[0];
    app.component(_name, defineAsyncComponent(value as AsyncComponentLoader));
  }
}
