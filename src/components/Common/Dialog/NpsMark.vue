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
      <div :class="ns.b('content-box')" v-if="reasonList.length > 0">
        <div
          v-for="item in reasonList"
          :key="item.id"
          :class="[
            ns.be('content', 'label'),
            dictId.includes(item.id) ? ns.be('content', 'label-active') : '',
          ]"
          @click="choseReason(item)"
        >
          {{ item.label }}
        </div>
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
      <el-button
        type="primary"
        :class="ns.be('content', 'btn')"
        @click="onSubmitScore()"
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
import {
  isNpsMarkApi,
  scoreMarkApi,
  getNpsConfigInfoApi,
  scoreMarkApi2,
} from "@/api/user";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
const ns = useNamespace("npsMark");
const dialogVisible: Ref<boolean> = ref(false);
const props = defineProps({
  title: { type: String, default: "「查招标」" },
  width: { type: String, default: "456px" },
  module: { type: String, default: "" },
  apiText: { type: String, default: "" },
  npsConfigCode: { type: String, default: "" },
});
const score: Ref<number> = ref(0); // 选中的分数
const reasonList: Ref<Array<any>> = ref([]); // 原因列表
const allReasonList: Ref<Array<any>> = ref([]); // 原因配置列表
const dictId: Ref<Array<number>> = ref([]); // 选择原因组成的数组
const markInfo: Ref<string> = ref(""); // 写原因
const handleClose = () => {
  dialogVisible.value = false;
};
// 选择分数
const onChoseScore = async (data: number) => {
  score.value = data;
  reasonList.value = [];
  allReasonList.value.forEach((item) => {
    const _list = item.label.split(",");
    _list.includes(String(data)) && (reasonList.value = item.children);
  });
};
// 选择原因
const choseReason = (item: any) => {
  // 数组中没有就添加，有就删除
  if (dictId.value.includes(item.id)) {
    dictId.value = dictId.value.filter((i) => i !== item.id);
  } else {
    dictId.value.push(item.id);
  }
};
// 提交评价
const onSubmitScore = async () => {
  const { resp_code }: any = await scoreMarkApi({
    moduleName: props.module,
    satisfactionScore: score.value,
  });
  resp_code === 0 && onSubmitScore2();
};
// 评价再提交另一个接口
const onSubmitScore2 = async () => {
  const { resp_code }: any = await scoreMarkApi2({
    dictId: dictId.value,
    content: markInfo.value,
    npsConfigCode: props.npsConfigCode,
    score: score.value,
    userId: useUserStore().$state.userInfo.id,
  });
  if (resp_code === 0) {
    ElMessage.success("感谢您的评价");
    dialogVisible.value = false;
  }
};
// 获取nps配置
const getNpsConfig = async () => {
  const { datas, resp_code }: any = await getNpsConfigInfoApi(props.apiText);
  if (resp_code === 0) {
    allReasonList.value = datas;
  }
};
onMounted(async () => {
  if (getToken()) {
    const { datas, resp_code } = await isNpsMarkApi(props.module);
    if (resp_code === 0) {
      dialogVisible.value = datas;
      getNpsConfig();
    }
  } else {
    dialogVisible.value = false;
  }
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
.es-npsMark-content-box {
  border-radius: 8px;
  padding: 0 0 16px;
  @include flex(center, space-between, wrap);
}
.es-npsMark-content__label {
  @include widthAndHeight(172px, 32px);
  background: #f2f3f5;
  border-radius: 4px;
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 32px);
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  margin-bottom: 8px;
}
.es-npsMark-content__label-active {
  background: #eaedfe;
  border: 1px solid #244bf1;
  color: #244bf1;
}
</style>
