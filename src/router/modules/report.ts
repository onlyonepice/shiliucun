export default {
  path: "/report",
  name: "Report",
  components: {
    default: () => import("@/views/report/index.vue"),
  },
  meta: {
    title: "报告"
  },
  children: [
    {
      path: "/reportDetail",
      name: "ReportDetail",
      components: {
        default: () => import("@/views/report/reportDetail/index.vue"),
      },
      meta: {
        title: "报告详情",
        backgroundColor: "#F2F3F5"
      },
    },
    {
      path: "/reportWhitePaper",
      name: "WhitePaper",
      components: {
        default: () => import("@/views/report/reportWhitePaper/enter.vue"),
      },
      meta: {
        title: "白皮书"
      },
    },
    {
      path: "/reportOnLine",
      name: "ReportOnLine",
      components: {
        default: () => import("@/views/report/reportOnLine/enter.vue"),
      },
      meta: {
        title: "原创报告"
      },
    },
  ]
};