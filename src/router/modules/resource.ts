export default {
  path: "/resource",
  name: "Resource",
  components: {
    default: () => import("@/views/resource/index.vue"),
  },
  meta: {
    title: "资源",
  },
  children: [
    {
      path: "/financingPlan",
      name: "FinancingPlan",
      components: {
        default: () => import("@/views/financingPlan/enter.vue"),
      },
      meta: {
        title: "融资方案",
        backgroundColor: "#fff",
      },
    },
  ],
};
