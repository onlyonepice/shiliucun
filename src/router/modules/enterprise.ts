export default {
  path: "/enterprise",
  name: "Enterprise",
  meta: {
    title: "企业",
  },
  children: [
    {
      path: "/searchProduct",
      name: "SearchProduct",
      components: {
        default: () => import("@/views/searchProduct/index.vue"),
      },
      meta: {
        title: "查产品",
      },
    },
  ],
};
