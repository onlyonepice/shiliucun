<template>
  <el-drawer
    v-model="drawerType"
    title="报名列表"
    :class="[ns.b(), drawerDetail ? ns.b('outside') : '']"
    @close="emits('onHandleClose')"
    :close-on-press-escape="!drawerDetail"
    :size="448"
  >
    <div
      :class="[ns.b('list'), choseId === item.id ? ns.b('active') : '']"
      v-for="item in applyList"
      :key="item.id"
      @click="onCheckDetail(item)"
    >
      <img
        :src="
          !item.userInfo.companyLogo
            ? 'https://cdn.eesaenergy.com/mini-app/i-report/v1.0/no_img.png'
            : useUserStore().fileUrl + item.userInfo.companyLogo
        "
        alt=""
      />
      <div>
        <div :class="ns.b('title')">
          <h3>{{ item.userInfo.realName }}｜{{ item.userInfo.position }}</h3>
          <div
            :class="ns.b('status')"
            :style="{
              border:
                '1px solid ' +
                searchApplicationStatus(item.status)?.borderColor,
              color: searchApplicationStatus(item.status)?.color,
              backgroundColor: searchApplicationStatus(item.status)?.background,
            }"
          >
            {{ searchApplicationStatus(item.status).name }}
          </div>
        </div>
        <h5>{{ item.userInfo.company }}</h5>
        <h5>申请时间：{{ item.createTime }}</h5>
      </div>
    </div>
    <Pagination
      :pageSize="7"
      :total="totalApply"
      @onchangeCurrent="onchangeCurrent"
      :desc="'共计' + totalApply + '人报名'"
      :class="ns.b('pagination')"
    />
    <el-drawer
      v-model="drawerDetail"
      title="报名详情"
      :class="ns.b()"
      :modal="false"
      :size="400"
      @close="
        drawerDetail = false;
        choseId = 0;
      "
    >
      <BusinessCard :info="applyDetail.userInfo" style="margin: 0 auto" />
      <h4
        :class="ns.b('title')"
        :style="{ 'margin-top': applyDetail.status !== 2 ? '48px' : '16px' }"
        v-if="applyDetail.enterpriseSummary !== ''"
      >
        企业描述
      </h4>
      <p :class="ns.b('desc')">{{ applyDetail.enterpriseSummary }}</p>
      <h4 :class="ns.b('title')" v-if="applyDetail.message !== ''">留言</h4>
      <p :class="ns.b('desc')">{{ applyDetail.message }}</p>
      <!-- <div
        :class="ns.b('option')"
        v-if="applyDetail.status === 1 || applyDetail.status === 4"
      >
        <el-button @click="onAgreeOrRefuse(3)">暂不考虑</el-button>
        <el-button type="primary" @click="onAgreeOrRefuse(2)"
          >同意申请</el-button
        >
      </div> -->
      <div />
    </el-drawer>
  </el-drawer>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import BusinessCard from "./businessCard.vue";
import { searchApplicationStatus } from "../../config";
import {
  // agreeOrRefuseApplyApi,
  changeApplyStatusApi,
} from "@/api/demandMatching";
// import { ElMessage } from "element-plus";
const ns = useNamespace("demandMatching-applyList");
const emits = defineEmits([
  "onHandleClose",
  "onchangeCurrent",
  // "onAgreeOrRefuse",
]);
const drawerType: Ref<boolean> = ref(false);
const drawerDetail: Ref<boolean> = ref(false);
const applyDetail: Ref<any> = ref({}); // 报名详情
const choseId: Ref<number> = ref(0); // 选中的id
const props = defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
  // 总数
  totalApply: {
    type: Number,
    default: 0,
  },
  // 报名列表
  applyList: {
    type: Array as () => any[],
    default: () => [],
  },
});
watch(
  () => props.drawer,
  (val) => {
    drawerType.value = val;
  },
  {
    immediate: true,
  },
);
// 分页点击
const onchangeCurrent = (current: number) => {
  emits("onchangeCurrent", current);
};
// 查看详情
const onCheckDetail = async (data: any) => {
  choseId.value = data.id;
  drawerDetail.value = true;
  applyDetail.value = data;
  await changeApplyStatusApi(data.id);
};
// 同意或拒绝申请
// const onAgreeOrRefuse = async (type: number) => {
//   const { resp_code } = await agreeOrRefuseApplyApi({
//     applyId: choseId.value,
//     status: type,
//   });
//   if (resp_code === 0) {
//     drawerDetail.value = false;
//     type === 2 && ElMessage.success("已同意该申请");
//     type === 3 && ElMessage.warning("已拒绝该申请");
//     emits("onAgreeOrRefuse");
//   }
// };
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatching-applyList-pagination {
  @include absolute(1, none, 24px, 34px, none);
}
.es-demandMatching-applyList-list {
  @include widthAndHeight(416px, 112px);
  @include flex(center, flex-start, nowrap);
  padding: 8px;
  margin-bottom: 16px;
  &:hover {
    background: #f2f3f5;
    border-radius: 4px;
    cursor: pointer;
  }
  img {
    @include widthAndHeight(96px, 96px);
    margin-right: 16px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dbdce2;
    object-fit: contain;
  }
  h3 {
    font-weight: 400;
    line-height: 28px;
    margin-top: 4px;
  }
  h5 {
    font-weight: 400;
    margin-bottom: 16px;
    line-height: 22px;
  }
}
.es-demandMatching-applyList-title {
  width: 288px;
  margin: 16px 0 8px;
  @include flex(center, space-between, nowrap);
  h3 {
    width: 230px;
    @include textOverflow();
  }
  div {
    min-width: 56px;
    height: 24px;
    padding: 2px 8px;
    border-radius: 4px;
    @include font(12px, 400, #ff892e, 20px);
  }
}
.es-demandMatching-applyList-desc {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
.es-demandMatching-applyList-option {
  @include widthAndHeight(100%, 80px);
  border-top: 1px solid #dbdce2;
  @include absolute(1, none, 0, 0, none);
  @include flex(center, flex-end, nowrap);
  padding-right: 24px;
}
.es-demandMatching-applyList-active {
  background: #f2f3f5;
  border-radius: 4px;
  cursor: pointer;
}
.es-demandMatching-applyList-content__extra {
  @include widthAndHeight(320px, 30px);
  background: #eaedfe;
  border-radius: 4px;
  @include absolute(-1, 296px, 0, auto, 0);
  margin: 0 auto;
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(16px, 16px);
    margin: 0 4px 0 8px;
  }
}
.es-demandMatching-applyList-outside.el-drawer.rtl {
  right: 400px;
}
.el-drawer {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
.el-drawer__header {
  margin-top: 56px;
  border-bottom: 1px solid #dbdce2;
  margin-bottom: 24px;
  padding-bottom: 15px;
  .el-drawer__title {
    @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  }
}
.el-drawer__body {
  padding: 0 16px;
  & > div:nth-last-child(1) {
    z-index: -1 !important;
  }
}
.es-demandMatching-applyList {
  .el-drawer__body {
    max-height: 80%;
  }
}
</style>
