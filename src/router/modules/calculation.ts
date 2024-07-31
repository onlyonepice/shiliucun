export default {
  path: "/calculation",
  name: "Calculation",
  components: {
    default: () => import("@/views/calculation/index.vue"),
  },
  meta: {
    title: "工商业测算",
  },
  children: [
    {
      path: "/calculationLite",
      name: "CalculationLite",
      components: {
        default: () => import("@/views/calculation/lite/index.vue"),
      },
      meta: {
        title: "项目",
      },
    },
    {
      path: "/calculationBasic",
      name: "CalculationBasic",
      components: {
        default: () => import("@/views/calculation/basic/index.vue"),
      },
      meta: {
        title: "项目",
      },
    },
  ],
};
