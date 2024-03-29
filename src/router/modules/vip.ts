export default {
  path: "/vip",
  name: "Vip",
  components: {
    default: () => import("@/views/vip/index.vue"),
  },
  meta: {
    title: "开通VIP",
  },
};
