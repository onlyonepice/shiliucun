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
      path: "/dataProject",
      name: "DataProject",
      components: {
        default: () => import("@/views/data/dataProject/enter.vue"),
      },
      meta: {
        title: "项目",
        keepAlive: false,
      },
    },
    {
      path: "/dataTender",
      name: "DataTender",
      components: {
        default: () => import("@/views/data/dataTender/enter.vue"),
      },
      meta: {
        title: "招标",
        keepAlive: false,
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
        keepAlive: false,
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
        keepAlive: false,
      },
    },
    {
      path: "/electricityApi",
      name: "ElectricityApi",
      components: {
        default: () => import("@/views/data/electricityApi/index.vue"),
      },
      meta: {
        title: "电价Api",
      },
    },
  ],
};
