import { createRouter, createWebHashHistory } from 'vue-router'
/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true
  }
);

/** 原始静态路由（未做任何处理） */
const routes = [
  {
    path: "/",
    components: {
      default: () => import("@/App.vue"),
    }
  },
  {
    path: "/ipotisedge/PC/investment",
    name: "PCInvestment",
    components: {
      default: () => import("@/views/PC/enter.vue"),
    },
    meta: {
      title: "精控能源"
    }
  },
  {
    path: "/ipotisedge/PC/priceTracking",
    name: "PCPriceTracking",
    components: {
      default: () => import("@/views/PC/enter.vue"),
    },
    meta: {
      title: "精控能源"
    }
  },
  {
    path: "/ipotisedge/mobile",
    name: "MobilePriceTracking",
    components: {
      default: () => import("@/views/MOBILE/enter.vue"),
    },
    meta: {
      title: "精控能源"
    }
  },
];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});



const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (typeof (to.meta?.title) === 'string') {
    document.title = to.meta?.title;
  }
  // if(document.documentElement.clientWidth <= 500 && to.path!=='/ipotisedge/mobile'){
  //   next('/ipotisedge/mobile')
  // }else{
  //   next('/ipotisedge/PC/investment')
  // }
  next()
})


export default router
