

export default {
  path: "/home",
  name: "Home",
  components: {
    default: () => import("@/views/home/index.vue"),
  },
  meta: {
    title: "首页"
  },
  children:[
    {
      path: "/homeSearchDetail",
      name: "HomeSearchDetail",
      components: {
        default: () => import("@/views/home/searchDetail.vue"),
      },
      meta: {
        title: "首页"
      },
    }
  ]
};