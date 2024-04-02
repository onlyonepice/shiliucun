export default {
  path: "/resource",
  name: "Resource",
  components: {
    default: () => import("@/views/resource/index.vue"),
  },
  meta: {
    title: "资源",
  },
};
