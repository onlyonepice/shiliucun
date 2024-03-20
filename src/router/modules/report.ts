export default {
  path: "/report",
  name: "Report",
  components: {
    default: () => import("@/views/report/index.vue"),
  },
  meta: {
    title: "报告"
  },
  children: {
    path: "/reportDetail",
    name: "ReportDetail",
    components: {
      default: () => import("@/views/report/reportDetail/index.vue"),
    },
    meta: {
      title: "报告详情"
    },
  }
};