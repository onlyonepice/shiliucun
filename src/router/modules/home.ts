export default {
  path: "/home",
  name: "Home",
  components: {
    default: () => import("@/views/home/index.vue"),
  },
  meta: {
    title: "shiliucun",
    backgroundColor: "#FFFFFF",
  },
  children: [
    {
      path: "/gamePreview",
      name: "GamePreview",
      components: {
        default: () => import("@/views/gamePreview/app.vue"),
      },
      meta: {
        title: "游戏一览",
      },
    },
    {
      path: "/recharge",
      name: "Recharge",
      components: {
        default: () => import("@/views/recharge/app.vue"),
      },
      meta: {
        title: "充值中心",
      },
    },
    {
      path: "/gameDetail",
      name: "GameDetail",
      components: {
        default: () => import("@/views/gameDetail/app.vue"),
      },
      meta: {
        title: "游戏详情",
      },
    },
  ],
};
