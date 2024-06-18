<template>
  <Dialog
    title="申请报名"
    :visible="visibleApply"
    width="400px"
    height="522px"
    @onHandleClose="onHandleClose"
    confirmText="提交申请"
    :class="ns.b()"
  >
    <template #content>
      <BusinessCard :info="useUserStore().userInfo" width="352px" />
      <h5>企业简介</h5>
      <el-input
        v-model="applyInfo.enterpriseSummary"
        type="textarea"
        placeholder="请输入"
        maxlength="500"
        show-word-limit
      />
      <h5>留言</h5>
      <el-input
        v-model="applyInfo.message"
        type="textarea"
        placeholder="请输入"
        maxlength="150"
        show-word-limit
      />
      <el-button :class="ns.b('edit')">编辑名片</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import BusinessCard from "../components/businessCard.vue";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { applyDemandApi } from "@/api/demandMatching";
const ns = useNamespace("demandMatchingDetail-apply");
const visibleApply: Ref<boolean> = ref(false); // 弹窗
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
  if (type && applyInfo.value.enterpriseSummary === "") {
    return ElMessage.warning("请填写企业简介");
  }
  if (type && applyInfo.value.message === "") {
    return ElMessage.warning("请填写留言");
  }
  visibleApply.value = false;
  if (type) {
    const { email, mobile, company, realName, position } =
      useUserStore().userInfo;
    await applyDemandApi({
      email,
      mobile,
      enterpriseName: company,
      position,
      userName: realName,
      needId: props.needId,
      enterpriseSummary: applyInfo.value.enterpriseSummary,
      message: applyInfo.value.message,
    });
  }
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDetail-apply {
  h5 {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    margin: 16px 0 8px;
  }
  .el-textarea__inner {
    @include widthAndHeight(100%, 64px);
    background: #f2f3f5;
  }
  .el-input__count {
    background: #f2f3f5;
  }
}
.es-demandMatchingDetail-apply-edit {
  @include absolute(1, none, none, 12px, 24px);
}
</style>
