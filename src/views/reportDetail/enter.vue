<template>
  <div :class="ns.b()">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']" v-if="reportDetail.id">
      <div :class="ns.be('content', 'left')">
        <reportInfo :detail="reportDetail" />
      </div>
      <div :class="ns.be('content', 'right')">
        <reportOption :detail="reportDetail" />
        <reportRecommend />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useRoute } from "vue-router";
import { getReportDetailApi } from "@/api/reportDetail";
import reportOption from "./components/option.vue";
import reportRecommend from "./components/recommend.vue";
import reportInfo from "./components/info.vue";
const route = useRoute();
const ns = useNamespace("reportDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "报告", path: "/industryInsight" },
  { text: "季报月报", path: "/quarterlyMonthlyReports" },
  { text: "", path: "" },
]);
const reportDetail: Ref<any> = ref({}); // 报告详情
// 获取报告详情
const getReportDetail = async () => {
  const { datas, resp_code }: any = await getReportDetailApi({
    id: route.query.id,
  });
  if (resp_code === 0) {
    breadcrumbList.value[breadcrumbList.value.length - 1].text =
      datas.reportName;
    reportDetail.value = datas;
  }
};
getReportDetail();
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-reportDetail {
  height: calc(100vh - 56px -80px);
  background: #f2f3f5;
}
.es-reportDetail-content {
  @include flex(center, space-between, nowrap);
  padding-bottom: 80px !important;
}
.es-reportDetail-content__left {
  @include widthAndHeight(858px, calc(100vh - 56px - 50px));
  background: #ffffff;
  border-radius: 8px;
  margin-right: 24px;
}
.es-reportDetail-content__right {
  width: 270px;
}
</style>
