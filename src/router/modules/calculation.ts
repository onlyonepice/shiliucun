export default {
  path: "/calculation",
  name: "Calculation",
  components: {
    default: () => import("@/views/calculate/calculateBasic/index.vue"),
  },
  meta: {
    title: "工商业测算",
  },
  children: [
    {
      path: "/calculationLite",
      name: "CalculationLite",
      components: {
        default: () => import("@/views/calculate/calculateLite/index.vue"),
      },
      meta: {
        title: "工商业测算Lite版",
      },
    },
    {
      path: "/calculationBasic",
      name: "CalculationBasic",
      components: {
        default: () => import("@/views/calculate/calculateBasic/index.vue"),
      },
      meta: {
        title: "工商业测算Basic版",
      },
    },
  ],
};
