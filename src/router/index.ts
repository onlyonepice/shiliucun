import { createRouter, createWebHashHistory } from 'vue-router'
/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts","./*.ts"],
  {
    eager: true
  }
);

/** 原始静态路由（未做任何处理） */
const routes:any = [
  {
    path: "/",
    redirect: "/home"
  },
  modules
];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});

// 导出router数据
export const routerArrays = routes;

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (typeof (to.meta?.title) === 'string') {
    document.title = to.meta?.title;
  }
  next()
})


export default router
