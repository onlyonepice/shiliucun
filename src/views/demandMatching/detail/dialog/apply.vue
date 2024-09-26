<template>
  <el-drawer
    title="立即报名"
    v-model="visibleApply"
    confirmText="提交申请"
    :class="ns.b()"
    @close="onHandleClose(false)"
    :append-to-body="true"
  >
    <template #default>
      <BusinessCard
        :info="Object.assign(useUserStore().userInfo, { companyLogo })"
        width="352px"
      />
      <h5>企业简介</h5>
      <el-input
        v-model="applyInfo.enterpriseSummary"
        type="textarea"
        placeholder="请输入"
        maxlength="500"
        show-word-limit
        resize="none"
        :rows="8"
      />
      <h5>留言</h5>
      <el-input
        v-model="applyInfo.message"
        type="textarea"
        placeholder="请输入"
        maxlength="150"
        show-word-limit
        resize="none"
        :rows="6"
      />
      <div />
    </template>
    <template #footer>
      <div :class="ns.b('footer')">
        <el-button @click="onHandleClose(false)">取消</el-button>
        <el-button type="primary" @click="onHandleClose(true)"
          >提交申请</el-button
        >
      </div>
    </template>
  </el-drawer>
  <InfoDialog :visible="visibleInfo" @onHandleCloseInfo="visibleInfo = false" />
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import BusinessCard from "../components/businessCard.vue";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { applyDemandApi, getApplyMessageApi } from "@/api/demandMatching";
import { getUserDetailInfo } from "@/api/user";
const emits = defineEmits(["onApply"]);
const ns = useNamespace("demandMatchingDetail-apply");
const visibleApply: Ref<boolean> = ref(false); // 弹窗
const visibleInfo: Ref<boolean> = ref(false);
const companyLogo: Ref<string> = ref(null); // 企业logo
const applyInfo: Ref<any> = ref({
  enterpriseSummary: "",
  message: "",
});
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 报名需求id
  needId: {
    type: Number,
    default: 0,
  },
});
watch(
  () => props.visible,
  (newVal) => {
    visibleApply.value = newVal;
  },
  { immediate: true },
);
const onHandleClose = async (type: boolean) => {
  visibleApply.value = false;
  if (type) {
    const { email, mobile, company, realName, position } =
      useUserStore().userInfo;
    const { resp_code } = await applyDemandApi({
      email,
      mobile,
      enterpriseName: company,
      position,
      userName: realName,
      needId: props.needId,
      enterpriseSummary: applyInfo.value.enterpriseSummary,
      message: applyInfo.value.message,
    });
    if (resp_code === 0) {
      resp_code === 0 && ElMessage.success("报名成功");
    }
  }
  setTimeout(() => {
    emits("onApply");
  }, 500);
};
// 获取用户信息
const geuUserInfo = async () => {
  const { datas, resp_code } = await getUserDetailInfo();
  if (resp_code === 0) {
    !applyInfo.value.enterpriseSummary &&
      (applyInfo.value.enterpriseSummary = datas.introduction);
    companyLogo.value = datas.companyLogo;
  }
};
// 获取上次报名信息
const getApplyMessage = async () => {
  const { resp_code, datas } = await getApplyMessageApi();
  if (resp_code === 0) {
    applyInfo.value.enterpriseSummary = datas.enterpriseSummary;
    applyInfo.value.message = datas.message;
    geuUserInfo();
  }
};
getApplyMessage();
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDetail-apply {
  width: 400px !important;
  h5 {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    margin: 16px 0 8px;
  }
  .el-textarea__inner {
    // @include widthAndHeight(100%, 64px);
    background: #f2f3f5;
  }
  .el-input__count {
    background: #f2f3f5;
  }
  .el-drawer__header {
    margin-top: 0;
    padding: 16px 24px;
  }
  .el-drawer__body {
    padding: 0 24px;
  }
  .el-drawer__footer {
    border-top: 1px solid #dbdce2;
    padding: 16px 24px 24px;
  }
}
.es-demandMatchingDetail-apply-footer {
  width: 100%;
  @include flex(center, flex-end, nowrap);
}
</style>
