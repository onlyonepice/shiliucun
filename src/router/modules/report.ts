export default {
  path: "/report",
  name: "Report",
  components: {
    default: () => import("@/views/report/index.vue"),
  },
  meta: {
    title: "报告",
  },
  children: [
    {
      path: "/reportDetail",
      name: "ReportDetail",
      components: {
        default: () => import("@/views/reportDetail/enter.vue"),
      },
      meta: {
        title: "报告详情",
        backgroundColor: "#F2F3F5",
        keepAlive: false,
      },
    },
    {
      path: "/reportWhitePaper",
      name: "WhitePaper",
      components: {
        default: () => import("@/views/report/reportWhitePaper/enter.vue"),
      },
      meta: {
        title: "白皮书",
        keepAlive: false,
      },
    },
    {
      path: "/reportOnLine",
      name: "ReportOnLine",
      components: {
        default: () => import("@/views/report/reportOnLine/enter.vue"),
      },
      meta: {
        title: "在线报告",
        keepAlive: false,
      },
    },
    {
      path: "/industryInsight",
      name: "IndustryInsight",
      components: {
        default: () => import("@/views/report/industryInsight/index.vue"),
      },
      meta: {
        title: "行业洞察",
        backgroundColor: "",
        keepAlive: false,
      },
    },
    {
      path: "/expertInterviews",
      name: "ExpertInterviews",
      components: {
        default: () => import("@/views/report/expertInterviews/enter.vue"),
      },
      meta: {
        title: "专家访谈",
        backgroundColor: "",
        keepAlive: false,
      },
    },
    {
      path: "/quarterlyMonthlyReports",
      name: "QuarterlyMonthlyReports",
      components: {
        default: () =>
          import("@/views/report/quarterlyMonthlyReports/index.vue"),
      },
      meta: {
        title: "周月季报",
        backgroundColor: "",
        keepAlive: false,
      },
    },
  ],
};
