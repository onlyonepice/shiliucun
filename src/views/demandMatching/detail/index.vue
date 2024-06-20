<template>
  <breadcrumb :breadcrumbList="breadcrumbList" />
  <div
    :class="[ns.b(), 'es-commonPage animate__animated animate__fadeIn']"
    v-if="detailInfo.id"
  >
    <DetailInfo
      :detailInfo="detailInfo"
      :minePublish="minePublish"
      :totalApply="totalApply"
      @onApply="onOpenApplyDialog()"
      @onDelete="deleteDialogVisible = true"
      @onSolve="solveDialogVisible = true"
      @onCheckApplyList="drawer = true"
      @onResetApply="resetDialogVisible = true"
      @onRevocation="onRevocation"
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
    @onApply="
      applyDialogVisible = false;
      getDemandDetail();
    "
  />
  <DeleteDialog
    v-if="deleteDialogVisible"
    :visible="deleteDialogVisible"
    :needId="detailInfo.id"
    @onHandleClose="onDelete"
  />
  <SolveDialog
    v-if="solveDialogVisible"
    :visible="solveDialogVisible"
    :needId="detailInfo.id"
    @onHandleClose="onSolve"
  />
  <ApplyList
    :drawer="drawer"
    :totalApply="totalApply"
    :applyList="applyList"
    @onHandleClose="drawer = false"
    @onchangeCurrent="onchangeCurrent"
    @onAgreeOrRefuse="getApplyList()"
  />
  <ReleaseDemand
    v-if="getToken()"
    :show="resetDialogVisible"
    :needDetailData="detailInfo"
    :appendToBody="true"
    @close="resetDialogVisible = false"
  />
</template>

<script setup lang="ts">
import { getToken } from "@/utils/auth";
import { Ref, ref, onMounted, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import BusinessCard from "./components/businessCard.vue";
import DetailInfo from "./components/detailInfo.vue";
import ApplyList from "./components/applyList.vue";
import ApplyDialog from "./dialog/apply.vue";
import DeleteDialog from "./dialog/delete.vue";
import SolveDialog from "./dialog/solve.vue";
import ReleaseDemand from "../releaseDemand.vue";
import { useUserStore } from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
import {
  getDemandDetailApi,
  getApplyListApi,
  cancelApplyApi,
} from "@/api/demandMatching";
import LamentIcon from "@/assets/img/common/lament_icon.png";
const route = useRoute();
const router = useRouter();
const ns = useNamespace("demandMatchingDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "需求大厅", path: "/demandMatching/list" },
  { text: "需求详情", path: "" },
]);
const minePublish: Ref<boolean> = ref(false); // 是否是我发布的需求
const detailInfo: Ref<any> = ref({}); // 需求详情
const applyDialogVisible: Ref<boolean> = ref(false); // 申请报名弹窗
const deleteDialogVisible: Ref<boolean> = ref(false); // 删除需求弹窗
const solveDialogVisible: Ref<boolean> = ref(false); // 解决需求弹窗
const resetDialogVisible: Ref<boolean> = ref(false); // 重置报名弹窗
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
    detailInfo.value.enabled === 2 && (detailInfo.value.status = 99);
  }
};
// 打开报名弹窗
const onOpenApplyDialog = () => {
  if (getToken()) {
    applyDialogVisible.value = true;
  } else {
    useUserStore().openLogin(true);
  }
};
// 删除需求
const onDelete = async (type: boolean) => {
  deleteDialogVisible.value = false;
  if (type) {
    router.go(-1);
  }
};
const onSolve = async (type: boolean) => {
  solveDialogVisible.value = false;
  if (type) {
    router.go(-1);
  }
};
// 撤销报名
const onRevocation = async () => {
  const { resp_code } = await cancelApplyApi(detailInfo.value.applyId);
  if (resp_code === 0) {
    getDemandDetail();
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
