<template>
  <el-dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    style="padding: 24px"
  >
    <h4>请选择身份和感兴趣的内容,以便我们更好的向您推送</h4>
    <h5 required>我是<span>（必填且单选）</span></h5>
    <div
      v-for="(item, index) in roleConfig[0].needLabelResponseList"
      :key="item.id"
      @click="onChoseRole(index)"
      :class="[
        ns.b('role'),
        choseRole === index ? ns.bm('role', 'active') : '',
      ]"
    >
      {{ item.labelName }}
    </div>
    <p v-if="choseRole !== -1" :class="ns.b('desc')">
      {{ roleConfig[0].needLabelResponseList[choseRole].description }}
    </p>
    <h5>我喜欢<span>（非必填且多选）</span></h5>
    <div
      v-for="item in roleConfig[1].needLabelResponseList"
      :key="item.id"
      @click="onChoseLike(item.id)"
      :class="[
        ns.b('role'),
        choseLike.includes(item.id) ? ns.bm('role', 'active') : '',
      ]"
    >
      {{ item.labelName }}
    </div>
    <div :class="ns.b('confirm')">
      <el-button type="primary" @click="handleClose">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getRoleConfigApi, selectIdentityApi } from "@/api/demandList";
const ns = useNamespace("roleConfig");
const dialogVisible: Ref<boolean> = ref(false);
const emits = defineEmits(["onHandleClose"]);
const roleConfig: Ref<Array<any>> = ref([]);
const choseRole: Ref<number> = ref(-1); // 选择身份
const choseLike: Ref<Array<any>> = ref([]); // 选择感兴趣
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.visible,
  () => {
    dialogVisible.value = props.visible;
  },
  { immediate: true },
);
// 获取身份配置
const getAssignConfig = async () => {
  const { datas, resp_code } = await getRoleConfigApi();
  if (resp_code === 0) {
    roleConfig.value = datas;
  }
};
getAssignConfig();
// 选择身份
const onChoseRole = (index: number) => {
  choseRole.value = index;
};
// 选择感兴趣
const onChoseLike = (id: number) => {
  if (choseLike.value.includes(id)) {
    choseLike.value = choseLike.value.filter((item) => item !== id);
  } else {
    choseLike.value.push(id);
  }
};
const handleClose = async (type: boolean) => {
  const _data = choseLike.value.concat(
    roleConfig.value[0].needLabelResponseList[choseRole.value].id,
  );
  console.log(_data);
  const { resp_code } = await selectIdentityApi(_data);
  if (resp_code === 0) {
    emits("onHandleClose", type);
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-roleConfig {
  border-radius: 8px;
  .el-dialog__header {
    padding: 0;
  }
  h4 {
    text-align: center;
    line-height: 24px;
  }
  h5 {
    margin-bottom: 8px;
  }
  h5[required]::before {
    content: "*";
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
  h5 span {
    @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
  }
}
.es-roleConfig-confirm {
  @include flex(center, flex-end, nowrap);
}
.es-roleConfig-role {
  background: #f2f3f5;
  border-radius: 4px;
  padding: 5px 19px;
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
}
.es-roleConfig-role--active {
  background: #eaedfe;
  border: 1px solid #244bf1;
  color: #244bf1;
}
.es-roleConfig-desc {
  margin: 4px 0 16px;
}
</style>
