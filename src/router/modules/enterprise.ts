export default {
  path: "/enterprise",
  name: "Enterprise",
  component: {
    default: () => import("@/views/enterprise/index.vue"),
  },
  meta: {
    title: "企业",
  },
};
