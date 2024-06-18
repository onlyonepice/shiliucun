<template>
  <breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="[ns.b(), 'es-commonPage animate__animated animate__fadeIn']">
    <DetailInfo
      v-if="detailInfo.id"
      :detailInfo="detailInfo"
      :minePublish="minePublish"
      :totalApply="totalApply"
      @onApply="
        applyDialogVisible = true;
        getDemandDetail();
      "
      @onDelete="deleteDialogVisible = true"
      @onCheckApplyList="drawer = true"
    />
    <div
      :style="{ height: showExtra ? '256px' : '246px' }"
      :class="ns.b('card')"
    >
      <h4>{{ minePublish ? "您的名片信息" : "需求方名片" }}</h4>
      <BusinessCard :info="detailInfo.accountInfo" :minePublish="minePublish" />
      <div :class="ns.be('content', 'extra')" v-if="showExtra">
        <img :src="LamentIcon" alt="" />
        <p>需求方同意报名后将显示联系方式</p>
      </div>
    </div>
  </div>
  <ApplyDialog
    v-if="applyDialogVisible"
    :visible="applyDialogVisible"
    :needId="detailInfo.id"
  />
  <DeleteDialog
    v-if="deleteDialogVisible"
    :visible="deleteDialogVisible"
    :needId="detailInfo.id"
  />
  <ApplyList
    :drawer="drawer"
    :totalApply="totalApply"
    :applyList="applyList"
    @onHandleClose="drawer = false"
    @onchangeCurrent="onchangeCurrent"
    @onAgreeOrRefuse="getApplyList()"
  />
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import BusinessCard from "./components/businessCard.vue";
import DetailInfo from "./components/detailInfo.vue";
import ApplyList from "./components/applyList.vue";
import ApplyDialog from "./dialog/apply.vue";
import DeleteDialog from "./dialog/delete.vue";
import { useUserStore } from "@/store/modules/user";
import { useRoute } from "vue-router";
import { getDemandDetailApi, getApplyListApi } from "@/api/demandMatching";
import LamentIcon from "@/assets/img/common/lament_icon.png";
const route = useRoute();
const ns = useNamespace("demandMatchingDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "需求大厅", path: "/demandMatching/list" },
  { text: "需求详情", path: "" },
]);
const minePublish: Ref<boolean> = ref(false); // 是否是我发布的需求
const detailInfo: Ref<any> = ref({}); // 需求详情
const applyDialogVisible: Ref<boolean> = ref(false); // 申请报名弹窗
const deleteDialogVisible: Ref<boolean> = ref(false); // 删除需求弹窗
const showExtra: Ref<boolean> = ref(true); // 是否显示额外信息
const totalApply: Ref<number> = ref(0); // 报名总数
const drawer: Ref<boolean> = ref(false); // 报名列表弹窗
const applyList: Ref<Array<any>> = ref([]); // 报名列表
watch(
  () => drawer.value,
  (val) => {
    useUserStore().$state.showConsultationNav = !val;
  },
  { immediate: true },
);
const pageInfo: Ref<any> = ref({
  page: 1,
  limit: 10,
});
onMounted(() => {
  getDemandDetail();
  getApplyList();
});
// 获取需求详情
const getDemandDetail = async () => {
  const { datas, resp_code } = await getDemandDetailApi({ id: route.query.id });
  if (resp_code === 0) {
    detailInfo.value = datas;
    minePublish.value = datas.userId === useUserStore().userInfo.id;
    showExtra.value = minePublish.value ? false : datas.applyStatus !== 2;
  }
};
// 获取报名列表
const getApplyList = async () => {
  const { datas, resp_code } = await getApplyListApi(
    Object.assign(pageInfo.value, { needId: route.query.id }),
  );
  if (resp_code === 0) {
    totalApply.value = datas.total;
    applyList.value = datas.records;
  }
};
// 报名列表分页
const onchangeCurrent = (val: number) => {
  pageInfo.value.page = val;
  getApplyList();
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDetail {
  @include flex(flex-start, center, nowrap);
}
.es-demandMatchingDetail-card {
  @include widthAndHeight(368px, 246px);
  background: #ffffff;
  border-radius: 4px;
  padding: 24px;
  @include relative(1);
  h4 {
    margin-bottom: 16px;
  }
}
.es-demandMatchingDetail-content__extra {
  @include widthAndHeight(320px, 30px);
  background: #eaedfe;
  border-radius: 4px;
  @include absolute(-1, 212px, auto, auto, none);
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(16px, 16px);
    margin: 0 4px 0 8px;
  }
}
.es-demandMatchingDetail-content {
  @include widthAndHeight(760px, auto);
  background: #ffffff;
  border-radius: 4px;
  margin-right: 24px;
}
</style>
