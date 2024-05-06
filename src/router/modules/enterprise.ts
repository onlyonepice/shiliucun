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
        keepAlive: true,
      },
    },
    {
      path: "/searchProductDetail",
      name: "SearchProductDetail",
      components: {
        default: () => import("@/views/searchProduct/detail.vue"),
      },
      meta: {
        title: "产品详情",
        backgroundColor: "#F2F3F5",
      },
    },
    {
      path: "/searchProductCompared",
      name: "SearchProductCompared",
      components: {
        default: () => import("@/views/searchProduct/compared.vue"),
      },
      meta: {
        title: "产品对比",
        backgroundColor: "#F2F3F5",
      },
    },
  ],
};
