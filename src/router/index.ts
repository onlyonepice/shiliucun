import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts", "./*.ts"],
  {
    eager: true,
  },
);

/** 原始静态路由（未做任何处理） */
const routes: any = [
  {
    path: "/",
    redirect: "/home",
    meta: {
      title: "shiliucun",
      keepAlive: true,
    },
  },
];

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

// 导出router数据
export const routerArrays = routes;

export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(routes),
);

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

router.beforeEach(async (to, from, next) => {
  if (typeof to.meta?.title === "string") {
    document.title = to.meta?.title;
  }
  console.log(to);

  // 如果跳转的是 home或者重定向到首页直接放行，不然会路由跳转死循环
  if (to.path === "/ssl" || to.path === "/tt" || to.path === "/") {
    if( to.fullPath === "/activity" ){
      next("/activity");
    }else{
      next("/home");
    }
  }
  await useUserStoreHook().handleGetUserInfo();
  next();
});

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/xiaoxian521/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    } else {
      newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = routesList;
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList
        .slice(0, i + 1)
        .concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

export default router;
