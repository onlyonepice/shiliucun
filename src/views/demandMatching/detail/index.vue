<template>
  <breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="[ns.b(), 'es-commonPage animate__animated animate__fadeIn']">
    <DetailInfo :detailInfo="detailInfo" />
    <BusinessCard />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import BusinessCard from "./components/businessCard.vue";
import DetailInfo from "./components/detailInfo.vue";
import { useRoute } from "vue-router";
import { getDemandDetailApi } from "@/api/demandMatching";
const route = useRoute();
const ns = useNamespace("demandMatchingDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "需求大厅", path: "/demandMatching/list" },
  { text: "需求详情", path: "" },
]);
const detailInfo: Ref<any> = ref({}); // 需求详情
onMounted(() => {
  getDemandDetail();
});
// 获取需求详情
const getDemandDetail = async () => {
  const { datas, resp_code } = await getDemandDetailApi({ id: route.query.id });
  if (resp_code === 0) {
    detailInfo.value = datas;
  }
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDetail {
  @include flex(flex-start, center, nowrap);
}
.es-demandMatchingDetail-content {
  @include widthAndHeight(760px, auto);
  background: #ffffff;
  border-radius: 4px;
  margin-right: 24px;
}
</style>
