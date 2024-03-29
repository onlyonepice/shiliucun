export default {
  path: "/analyze",
  name: "Analyze",
  components: {
    default: () => import("@/views/analyze/index.vue"),
  },
  meta: {
    title: "分析",
  },
};
