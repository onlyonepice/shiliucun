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
      path: "/announcement",
      name: "Announcement",
      components: {
        default: () => import("@/views/announcement/app.vue"),
      },
      meta: {
        title: "公告中心",
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
      path: "/account",
      name: "Account",
      components: {
        default: () => import("@/views/account/app.vue"),
      },
      meta: {
        title: "账户信息",
      },
    },
    {
      path: "/gameItem",
      name: "GameItem",
      components: {
        default: () => import("@/views/gameItem/app.vue"),
      },
      meta: {
        title: "游戏详情",
      },
    },
    {
      path: "/activity",
      name: "activity",
      components: {
        default: () => import("@/views/activity/app.vue"),
      },
      meta: {
        title: "宣传页",
      },
    },
  ],
};
