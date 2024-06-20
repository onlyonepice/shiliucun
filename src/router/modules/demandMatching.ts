export default {
  path: "/demandMatching",
  name: "DemandMatching",
  meta: {
    title: "需求对接",
  },
  children: [
    {
      path: "/demandMatching/list",
      name: "DemandMatchingList",
      components: {
        default: () => import("@/views/demandMatching/list/index.vue"),
      },
      meta: {
        title: "需求对接列表",
      },
    },
    {
      path: "/demandMatching/detail",
      name: "DemandMatchingDetail",
      components: {
        default: () => import("@/views/demandMatching/detail/index.vue"),
      },
      meta: {
        title: "需求对接详情",
        backgroundColor: "#F2F3F5",
      },
    },
  ],
};
