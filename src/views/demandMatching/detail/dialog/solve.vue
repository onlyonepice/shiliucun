<template>
  <Dialog
    :visible="visibleSolve"
    width="400px"
    :height="score > 0 && score < 6 ? '492px' : score > 7 ? '450px' : '360px'"
    @onHandleClose="onHandleClose"
    confirmText="提交评分"
    cancelText="下次再说"
    :class="ns.b()"
  >
    <template #content>
      <img :class="ns.b('logo')" :src="SolveDemand" alt="" />
      <div :class="ns.b('number')">
        <div
          :class="[score === item ? ns.b('number-active') : '']"
          v-for="item in 10"
          :key="item"
          @click="onChoseScore(item)"
        >
          {{ item }}
        </div>
      </div>
      <div style="margin-bottom: 20px">
        <span>非常糟糕</span>
        <span style="float: right">非常棒</span>
      </div>
      <div :class="ns.b('content')" v-if="reasonList.length > 0">
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
        v-model="deleteInfo"
        maxlength="200"
        style="width: 352px"
        placeholder="您的建议是我们进步的方向"
        show-word-limit
        rows="3"
        type="textarea"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import SolveDemand from "@/assets/img/demand/solve-demand.png";
import { getAssignConfigApi, closeDemandApi } from "@/api/demandMatching";
const ns = useNamespace("demandMatchingDialog-solve");
const visibleSolve: Ref<boolean> = ref(false); // 弹窗
const reasonList: Ref<any[]> = ref([]); // 关闭原因列表
const allReasonList: Ref<any[]> = ref([]); // 所有原因列表
const deleteInfo: Ref<string> = ref(""); // 删除原因
const dictId: Ref<Array<number>> = ref([]); // 关闭原因id
const score: Ref<number> = ref(0); // 评分
const emits = defineEmits(["onHandleClose"]);
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
    visibleSolve.value = newVal;
  },
  { immediate: true },
);
const onHandleClose = async (type: boolean) => {
  if (type) {
    await closeDemandApi({
      content: deleteInfo.value,
      dictId: dictId.value,
      needId: props.needId,
      score: score.value,
      type: "score",
    });
  }
  visibleSolve.value = false;
  emits("onHandleClose", type);
};
// 选择分数
const onChoseScore = (data: number) => {
  score.value = data;
  reasonList.value = [];
  allReasonList.value.forEach((item) => {
    item.scores.includes(data) && (reasonList.value = item.list);
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
// 获取关闭原因
const getAssignConfig = async () => {
  const { datas, resp_code } = await getAssignConfigApi({});
  if (resp_code === 0) {
    allReasonList.value = datas;
  }
};
getAssignConfig();
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDialog-solve-logo {
  @include widthAndHeight(400px, 118px);
  @include absolute(1, -14px, 0, none, none);
}
.es-demandMatchingDialog-solve-number {
  margin-top: 80px;
  margin-bottom: 4px;
  @include flex(center, space-between, nowrap);
  .es-demandMatchingDialog-solve-number-active {
    background: #eaedfe;
    border: 1px solid #244bf1;
    color: #244bf1;
  }
  div {
    @include widthAndHeight(32px, 32px);
    border-radius: 4px;
    border: 1px solid #dbdce2;
    background: #ffffff;
    cursor: pointer;
    @include flex(center, center);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    &:hover {
      background: #f2f3f5;
    }
  }
}
.es-demandMatchingDialog-solve-number
  .es-demandMatchingDialog-solve-number-active {
  background: #eaedfe !important;
  border: 1px solid #244bf1;
  color: #244bf1;
}
.es-demandMatchingDialog-solve-content {
  border-radius: 8px;
  padding: 0 0 16px;
  @include flex(center, space-between, wrap);
}
.es-demandMatchingDialog-solve-content__label {
  @include widthAndHeight(172px, 32px);
  background: #f2f3f5;
  border-radius: 4px;
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 32px);
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  margin-bottom: 8px;
}
.es-demandMatchingDialog-solve-content__label-active {
  background: #eaedfe;
  border: 1px solid #244bf1;
  color: #244bf1;
}
.es-demandMatchingDialog-solve {
  .el-textarea__inner {
    background: #f2f3f5;
    border-radius: 4px;
  }
  .el-input__count {
    background: #f2f3f5;
  }
}
</style>
