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
    >
      <div :class="ns.be('left', 'evaluate')">
        <h5>真实度评价</h5>
        <template v-if="detailInfo.applyEvaluateVOList.length !== 0">
          <div
            :class="[
              ns.be('left', 'reviews'),
              item.code === 'FAVORABLE_COMMENT'
                ? ns.be('left', 'goodReviews')
                : ns.be('left', 'badReviews'),
            ]"
            v-for="item in detailInfo.applyEvaluateVOList"
            :key="item.code"
          >
            <div :class="ns.be('left', 'reviews-head')">
              <img
                :src="
                  item.code === 'FAVORABLE_COMMENT'
                    ? GoodReviewsImg
                    : BadReviewsImg
                "
                alt=""
              />
              <span
                >+{{
                  item.code === "FAVORABLE_COMMENT"
                    ? detailInfo.likes
                    : detailInfo.unlike
                }}</span
              >
            </div>
            <span>｜</span>
            <span
              v-for="(_item, _index) in item.applyEvaluateResponseList"
              :key="_index"
              >{{ _item.feedback }} +{{ _item.count
              }}{{
                _index === item.applyEvaluateResponseList.length - 1 ? "" : "、"
              }}</span
            >
          </div>
        </template>
        <template v-else>
          <span :class="ns.be('left', 'reviews-none')">暂无评价</span>
        </template>
      </div>
    </DetailInfo>
    <div>
      <div
        :style="{ height: showExtra ? '256px' : '246px' }"
        :class="ns.b('card')"
      >
        <h4>{{ minePublish ? "您的名片信息" : "需求方名片" }}</h4>
        <template v-if="detailInfo.accountInfo">
          <BusinessCard
            :info="detailInfo.accountInfo"
            :minePublish="minePublish"
          />
          <div :class="ns.be('content', 'extra')" v-if="showExtra">
            <img :src="LamentIcon" alt="" />
            <p>需求方同意报名后将显示联系方式</p>
          </div>
        </template>
      </div>
      <ApplyData v-if="applyData.length > 0" :applyData="applyData" />
      <Reviews
        v-if="detailInfo.isApply && !detailInfo.isEvaluate"
        @onSubmit="onSubmit"
      />
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
    v-if="getToken() && Object.keys(detailInfo).length > 0"
    :show="resetDialogVisible"
    :needDetailData="detailInfo"
    :appendToBody="true"
    @success="releaseDemandSuccess"
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
import ApplyData from "./components/applyData.vue";
import ApplyDialog from "./dialog/apply.vue";
import DeleteDialog from "./dialog/delete.vue";
import SolveDialog from "./dialog/solve.vue";
import ReleaseDemand from "../releaseDemand.vue";
import Reviews from "./components/reviews.vue";
import { useUserStore } from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
import GoodReviewsImg from "@/assets/img/common/good-reviews.png";
import BadReviewsImg from "@/assets/img/common/bad-reviews.png";
import {
  getDemandDetailApi,
  getApplyListApi,
  cancelApplyApi,
} from "@/api/demandMatching";
import LamentIcon from "@/assets/img/common/lament_icon.png";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const ns = useNamespace("demandMatchingDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "需求大厅", path: "goBack" },
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
const applyData: Ref<Array<any>> = ref([]); // 报名列表数据
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
  if (route.query.source) {
    breadcrumbList.value[0] = {
      text: "个人中心",
      path: "/homePersonal?id=3",
    };
  }
  if (route.query.beforeRouter) {
    breadcrumbList.value[0] = {
      path: "/demandMatching/list",
    };
  }
  getDemandDetail();
  getApplyList();
  getApplyData();
});
// 提交评价
const onSubmit = () => {
  ElMessage.success("评价成功");
  getDemandDetail();
};
const releaseDemandSuccess = () => {
  getDemandDetail();
  resetDialogVisible.value = false;
};
// 获取需求详情
const getDemandDetail = async () => {
  const { datas, resp_code } = await getDemandDetailApi({ id: route.query.id });
  if (resp_code === 0) {
    datas.tags && (datas.tags = datas.tags.split(","));
    detailInfo.value = datas;
    if (detailInfo.value.accountInfo) {
      detailInfo.value.accountInfo.companyId = datas.enterpriseId || null;
    }
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
// 获取两个报名列表信息
const getApplyData = async () => {
  const { datas, resp_code } = await getApplyListApi(
    Object.assign({ page: 1, limit: 2 }, { needId: route.query.id }),
  );
  if (resp_code === 0) {
    applyData.value = datas.records;
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
  padding-bottom: 46px;
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
.es-demandMatchingDetail-left__evaluate {
  h5 {
    line-height: 22px;
    margin-bottom: 8px;
  }
}
.es-demandMatchingDetail-left__reviews {
  height: 32px;
  margin-bottom: 8px;
  @include flex(center, flex-start, nowrap);
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  img {
    @include widthAndHeight(24px, 24px);
    margin-right: 4px;
  }
  .es-demandMatchingDetail-left__reviews-head {
    @include widthAndHeight(80px, 32px);
    padding: 4px 8px;
    border-radius: 4px;
    @include flex(center, flex-start, nowrap);
  }
}
.es-demandMatchingDetail-left__goodReviews {
  .es-demandMatchingDetail-left__reviews-head {
    background: linear-gradient(90deg, #eaedfe 0%, rgba(234, 237, 254, 0) 100%);
    @include font(16px, 400, #244bf1, 24px);
  }
}
.es-demandMatchingDetail-left__badReviews {
  .es-demandMatchingDetail-left__reviews-head {
    background: linear-gradient(90deg, #feeff0 0%, rgba(254, 239, 240, 0) 100%);
    @include font(16px, 400, #f75964, 24px);
  }
}

.es-demandMatchingDetail-left__reviews-none {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
</style>
