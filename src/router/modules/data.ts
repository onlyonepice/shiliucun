export default {
  path: "/data",
  name: "Data",
  component: {
    default: () => import("@/views/data/index.vue"),
  },
  meta: {
    title: "数据",
  },
};
