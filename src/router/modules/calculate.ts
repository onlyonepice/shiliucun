export default {
  path: "/calculate",
  name: "Calculate",
  components: {
    default: () => import("@/views/calculate/index.vue"),
  },
  meta: {
    title: "工商业测算",
  },
};
