export default {
  path: "/vip",
  name: "Vip",
  components: {
    default: () => import("@/views/vip/index.vue"),
  },
  meta: {
    title: "开通VIP",
  },
  children: [
    {
      path: "/memberNews",
      name: "MemberNews",
      components: {
        default: () => import("@/views/vip/memberNews.vue"),
      },
      meta: {
        title: "会员动态",
        backgroundColor: "#fff",
      },
    },
  ],
};
