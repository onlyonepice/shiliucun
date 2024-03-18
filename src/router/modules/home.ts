
const Layout = () => import("@/layout/enter.vue");

export default {
  path: "/home",
  name: "home",
  components: {
    default: () => import("@/views/Home/index.vue"),
  },
  meta: {
    title: "首页"
  }
};