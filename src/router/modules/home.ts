export default {
  path: "/home",
  name: "Home",
  components: {
    default: () => import("@/views/home/index.vue"),
  },
  meta: {
    title: "掌上储能",
    backgroundColor: "#FFFFFF",
  },
  children: [
    {
      path: "/homeSearchDetail/:searchContent",
      name: "HomeSearchDetail",
      components: {
        default: () => import("@/views/home/searchDetail.vue"),
      },
      meta: {
        title: "掌上储能",
        keepAlive: false,
      },
    },
    {
      path: "/homePersonal",
      name: "HomePersonal",
      components: {
        default: () => import("@/views/homePersonal/enter.vue"),
      },
      meta: {
        title: "个人中心",
        backgroundColor: "#F2F3F5",
        keepAlive: true,
      },
    },
    {
      path: "/hotSpots",
      name: "HotSpots",
      components: {
        default: () => import("@/views/home/hotSpots.vue"),
      },
      meta: {
        title: "热点详情",
        backgroundColor: "#F2F3F5",
        keepAlive: false,
      },
    },
  ],
};
