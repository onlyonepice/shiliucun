
const Layout = () => import("@/layout/enter.vue");

export default {
  path: "/home",
  name: "Home",
  components: {
    default: () => import("@/views/home/index.vue"),
  },
  meta: {
    title: "首页"
  }
};