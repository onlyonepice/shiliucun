<template>
  <Dialog
    :visible="visibleDelete"
    width="400px"
    height="360px"
    @onHandleClose="onHandleClose"
    confirmText="删除需求"
    cancelText="下次再说"
    :class="ns.b()"
  >
    <template #content>
      <img :class="ns.b('logo')" :src="DeleteDemand" alt="" />
      <div :class="ns.b('content')">
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
import DeleteDemand from "@/assets/img/demand/delete-demand.png";
import {
  getCloseReasonApi,
  closeDemandApi,
  deleteDemandApi,
} from "@/api/demandMatching";
const ns = useNamespace("demandMatchingDialog-delete");
const visibleDelete: Ref<boolean> = ref(false); // 弹窗
const reasonList: Ref<any[]> = ref([]); // 关闭原因列表
const deleteInfo: Ref<string> = ref(""); // 删除原因
const dictId: Ref<Array<number>> = ref([]); // 关闭原因id
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
    visibleDelete.value = newVal;
  },
  { immediate: true },
);
const onHandleClose = async (type: boolean) => {
  if (type) {
    await closeDemandApi({
      content: deleteInfo.value,
      dictId: dictId.value,
      needId: props.needId,
      score: 0,
      type: "feedback",
    });
    await deleteDemandApi(props.needId);
  }
  emits("onHandleClose", type);
  visibleDelete.value = false;
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
const getCloseReason = async () => {
  const { datas, resp_code } = await getCloseReasonApi({
    type: "needClose",
    value: "NEED_CLOSE",
  });
  if (resp_code === 0) {
    reasonList.value = datas;
  }
};
getCloseReason();
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatchingDialog-delete-logo {
  @include widthAndHeight(400px, 118px);
  @include absolute(1, -14px, 0, none, none);
}
.es-demandMatchingDialog-delete-content {
  border-radius: 8px;
  height: 72px;
  margin-top: 79px;
  margin-bottom: 16px;
  @include flex(center, space-between, wrap);
}
.es-demandMatchingDialog-delete-content__label {
  @include widthAndHeight(172px, 32px);
  background: #f2f3f5;
  border-radius: 4px;
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 32px);
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
}
.es-demandMatchingDialog-delete-content__label-active {
  background: #eaedfe;
  border: 1px solid #244bf1;
  color: #244bf1;
}
.es-demandMatchingDialog-delete {
  .el-textarea__inner {
    background: #f2f3f5;
    border-radius: 4px;
  }
  .el-input__count {
    background: #f2f3f5;
  }
}
</style>
