<template>
  <div :class="ns.b()">
    <div
      :class="ns.b('top')"
      v-if="detailInfo.status !== 4 && detailInfo.status !== 99"
    >
      <div>
        <!-- 待审核 -->
        <template v-if="detailInfo.status === 1">
          <el-button @click="emits('onDelete')">删除</el-button>
        </template>
        <!-- 需求中 -->
        <template v-if="detailInfo.status === 2">
          <template v-if="!minePublish">
            <el-button
              v-if="detailInfo.applyStatus === null"
              type="primary"
              @click="emits('onApply')"
              >立即报名</el-button
            >
            <el-button
              v-if="
                detailInfo.applyStatus === 1 || detailInfo.applyStatus === 4
              "
              >撤销报名</el-button
            >
          </template>
          <template v-else>
            <el-button type="primary" @click="emits('onSolve')"
              >需求已解决</el-button
            >
            <el-button @click="emits('onDelete')">删除</el-button>
          </template>
          <el-button @click="onShare()">分享</el-button>
        </template>
        <!-- 审核未通过 -->
        <template v-if="detailInfo.status === 3">
          <el-button type="primary">重新提交</el-button>
          <el-button @click="emits('onDelete')">删除</el-button>
        </template>
        <!-- 已解决 -->
        <template v-if="detailInfo.status === 4" />
        <!-- 已下架 -->
        <template v-if="detailInfo.status === 99" />
      </div>
      <div :class="ns.be('top', 'number')">
        <span>{{ totalApply }}人已报名</span>
        <el-button
          style="margin-left: 8px"
          v-if="minePublish"
          @click="emits('onCheckApplyList')"
          >报名列表</el-button
        >
      </div>
    </div>
    <div
      v-if="detailInfo.status === 1 || detailInfo.status === 2"
      :class="ns.be('top', 'line')"
    />
    <!-- 下架原因 -->
    <div v-if="detailInfo.status === 99" :class="ns.be('top', 'removed-head')">
      <div :class="ns.be('top', 'removed')">
        下架原因：{{ detailInfo.unEnableReason }}
      </div>
      <div :class="ns.be('top', 'number')">
        <span>{{ totalApply }}人已报名</span>
      </div>
    </div>
    <!-- 驳回原因 -->
    <div v-if="detailInfo.status === 3">
      <div :class="ns.be('top', 'turnDown')">
        未通过原因：{{ detailInfo.auditRemark }}
      </div>
    </div>
    <div :class="ns.be('info', 'head')">
      <div>
        <h3>{{ detailInfo.title }}</h3>
        <div
          :class="ns.be('info__head', 'tag')"
          :style="{
            border:
              '1px solid ' + searchDemandStatus(detailInfo.status)?.borderColor,
            color: searchDemandStatus(detailInfo.status)?.color,
            backgroundColor: searchDemandStatus(detailInfo.status)?.background,
          }"
        >
          {{ searchDemandStatus(detailInfo.status)?.name
          }}{{
            detailInfo.applyStatus === null
              ? ""
              : " | " + searchApplicationStatus(detailInfo.applyStatus)?.name
          }}
        </div>
      </div>
      <div :class="ns.be('top', 'number')" v-if="detailInfo.status === 4">
        <span>{{ totalApply }}人已报名</span>
      </div>
    </div>
    <h4 :class="ns.be('info', 'description')">{{ detailInfo.description }}</h4>
    <img
      :class="ns.be('info', 'img')"
      v-for="item in getImgList"
      :key="item"
      :src="useUserStore().fileUrl + item"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import useClipboard from "vue-clipboard3";
import { searchDemandStatus, searchApplicationStatus } from "../../config";
import { ElMessage } from "element-plus";
const emits = defineEmits([
  "onApply",
  "onCheckApplyList",
  "onDelete",
  "onSolve",
]);
const { toClipboard } = useClipboard();
const ns = useNamespace("demandMatching-detail");
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => ({}),
  },
  // 是否是我发布的需求
  minePublish: {
    type: Boolean,
    default: false,
  },
  // 报名总数
  totalApply: {
    type: Number,
    default: 0,
  },
});
const getImgList = computed(() => {
  return props.detailInfo.imageUrls
    ? props.detailInfo.imageUrls.split(",")
    : [];
});
// 分享链接
const onShare = async () => {
  await toClipboard(window.location.href);
  ElMessage.success("分享链接已复制");
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatching-detail {
  @include widthAndHeight(760px, auto);
  padding: 0 24px 208px 24px;
  background: #ffffff;
  border-radius: 4px;
  margin-right: 24px;
  margin-bottom: 80px;
}
.es-demandMatching-detail-top {
  @include widthAndHeight(100%, 79px);
  @include flex(center, space-between, nowrap);
}
.es-demandMatching-detail-top__number {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
}
.es-demandMatching-detail-top__removed-head {
  @include flex(center, space-between, nowrap);
  margin-top: 24px;
}
.es-demandMatching-detail-top__removed {
  @include widthAndHeight(621px, 38px);
  background: #f2f3f5;
  border-radius: 4px;
  padding: 8px 16px;
  @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
}
.es-demandMatching-detail-top__turnDown {
  @include widthAndHeight(100%, 38px);
  background: #feeff0;
  border-radius: 4px;
  padding: 8px 16px;
  @include font(14px, 600, #f75964, 22px);
}
.es-demandMatching-detail-top__line {
  @include widthAndHeight(712px, 1px);
  background: #dbdce2;
}
.es-demandMatching-detail-info__head {
  margin-top: 24px;
  @include flex(center, space-between, nowrap);
  h3 {
    margin-right: 8px;
    margin-right: 8px;
  }
  div {
    @include flex(center, flex-start, nowrap);
  }
}
.es-demandMatching-detail-info__head__tag {
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.es-demandMatching-detail-info__description {
  font-weight: 400;
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
  margin-bottom: 24px;
}
.es-demandMatching-detail-info__img {
  @include widthAndHeight(144px, 144px);
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-right: 16px;
  margin-bottom: 16px;
  object-fit: contain;
}
</style>
