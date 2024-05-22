export default {
  path: "/data",
  name: "Data",
  component: {
    default: () => import("@/views/data/index.vue"),
  },
  meta: {
    title: "数据",
  },
  children: [
    {
      path: "/dataTender",
      name: "DataTender",
      components: {
        default: () => import("@/views/data/dataTender/enter.vue"),
      },
      meta: {
        title: "招标",
      },
    },
    {
      path: "/electricityPrice",
      name: "ElectricityPrice",
      components: {
        default: () => import("@/views/data/electricityPrice/enter.vue"),
      },
      meta: {
        title: "电价",
      },
    },
    {
      path: "/dataWinningBid",
      name: "DataWinningBid",
      components: {
        default: () => import("@/views/data/dataWinningBid/enter.vue"),
      },
      meta: {
        title: "中标",
        keepAlive: true,
      },
    },
    {
      path: "/policy",
      name: "Policy",
      components: {
        default: () => import("@/views/data/dataPolicy/enter.vue"),
      },
      meta: {
        title: "政策",
      },
    },
  ],
};
