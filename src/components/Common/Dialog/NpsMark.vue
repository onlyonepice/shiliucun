<template>
  <div
    v-if="dialogVisible"
    :class="[ns.b(), 'animate__animated animate__fadeIn']"
    :style="{ width: width }"
  >
    <img :src="NpsTopBg" :class="ns.b('bg')" alt="" />
    <img
      :class="ns.b('cancel')"
      :src="CancelIcon"
      @click="handleClose()"
      alt=""
    />
    <div :class="ns.b('content')">
      <h4 :class="ns.be('content', 'title')">
        您向朋友或同事推荐<span>{{ title }}</span
        >的可能性有多大？
      </h4>
      <div :class="ns.be('content', 'number')">
        <div
          :class="[score === item ? ns.b('number-active') : '']"
          v-for="item in 10"
          :key="item"
          @click="onChoseScore(item)"
        >
          {{ item }}
        </div>
      </div>
      <div :class="ns.be('content', 'desc')">
        <span>不可能</span>
        <span style="float: right">极有可能</span>
      </div>
      <el-input
        v-model="markInfo"
        maxlength="200"
        style="width: 376px"
        placeholder="您的建议是我们进步的方向"
        show-word-limit
        rows="3"
        type="textarea"
      />
      <el-button type="primary" :class="ns.be('content', 'btn')"
        >提交评价</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import CancelIcon from "@/assets/img/common/cancel.png";
import NpsTopBg from "@/assets/img/common/nps-top-bg.png";
import { isNpsMarkApi, scoreMarkApi } from "@/api/user";
import { ElMessage } from "element-plus";
const ns = useNamespace("npsMark");
const dialogVisible: Ref<boolean> = ref(false);
const props = defineProps({
  title: { type: String, default: "「查招标」" },
  cancelText: { type: String, default: "取消" },
  confirmText: { type: String, default: "确定" },
  width: { type: String, default: "456px" },
  height: { type: String, default: "" },
  showFoot: { type: Boolean, default: true },
  appendToBody: { type: Boolean, default: true },
  module: { type: String, default: "" },
});
const score: Ref<number> = ref(0); // 选中的分数
// const reasonList: Ref<Array<any>> = ref([]); // 原因列表
// const allReasonList: Ref<Array<any>> = ref([]); // 原因配置列表
const markInfo: Ref<string> = ref(""); // 写原因
const handleClose = () => {
  dialogVisible.value = false;
};
// 选择分数
const onChoseScore = async (data: number) => {
  score.value = data;
  // reasonList.value = [];
  // allReasonList.value.forEach((item) => {
  //   item.scores.includes(data) && (reasonList.value = item.list);
  // });
  const { resp_code }: any = await scoreMarkApi({
    moduleName: props.module,
    satisfactionScore: score.value,
  });
  if (resp_code === 0) {
    ElMessage.success("感谢您的评价");
    dialogVisible.value = false;
  }
};
onMounted(async () => {
  const { datas, resp_code } = await isNpsMarkApi(props.module);
  resp_code === 0 && (dialogVisible.value = datas);
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-npsMark {
  @include fixed(1, none, 112px, 40px, none);
  background: #f2f3f5;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #dbdce2;
  padding: 68px 16px 16px;
}
.es-npsMark-bg {
  @include absolute(0, 0, 0, none, none);
  @include widthAndHeight(456px, 176px);
}
.es-npsMark-content {
  background: #ffffff;
  border-radius: 4px;
  padding: 24px 24px 80px;
  @include relative();
}
.es-npsMark-content__number {
  @include flex(center, space-between, nowrap);
  margin: 24px 0 8px;
  div {
    @include widthAndHeight(32px, 32px);
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dbdce2;
    @include flex(center, center, nowrap);
    cursor: pointer;
    &:hover {
      background: #f2f3f5;
    }
  }
  .es-npsMark-number-active {
    background: #eaedfe !important;
    border: 1px solid #244bf1;
    color: #244bf1;
  }
}
.es-npsMark-content__desc {
  margin-bottom: 24px;
  span {
    color: rgba(0, 0, 0, 0.6);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
}
.es-npsMark-content__title {
  span {
    color: #244bf1;
  }
}
.es-npsMark-content__btn {
  @include absolute(1, none, 24px, 24px, none);
}
.es-npsMark-cancel {
  @include widthAndHeight(28px, 28px);
  @include absolute(1, 24px, 18px, none, none);
  cursor: pointer;
}
.es-npsMark {
  .el-textarea__inner {
    background: #f2f3f5;
    border-radius: 4px;
  }
  .el-input__count {
    background: #f2f3f5;
  }
}
</style>
