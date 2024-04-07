<template>
  <div :class="ns.b()">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']">
      <div :class="ns.be('content', 'left')" />
      <div :class="ns.be('content', 'right')">
        <reportOption />
        <recommendReport />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useRoute } from "vue-router";
import { getReportDetailApi } from "@/api/reportDetail";
const route = useRoute();
const ns = useNamespace("reportDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "报告", path: "/industryInsight" },
  { text: "季报月报", path: "/quarterlyMonthlyReports" },
  { text: "", path: "" },
]);
// 获取报告详情
const getReportDetail = async () => {
  const { datas }: any = await getReportDetailApi({
    id: route.query.id,
  });
  breadcrumbList.value[breadcrumbList.value.length - 1].text = datas.reportName;
};
getReportDetail();
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-reportDetail {
  height: calc(100vh - 56px);
  background: red;
}
.es-reportDetail-content {
  @include flex();
}
</style>
