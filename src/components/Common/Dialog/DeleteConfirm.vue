<template>
  <Dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :showFoot="true"
    :showClose="false"
    width="384px"
    @onHandleClose="onHandleClose"
  >
    <template #content>
      <div :class="ns.b('content')">
        <h4 :class="ns.b('btn')" @click="handleClose">{{ text }}</h4>
        <img
          :class="ns.b('cancel')"
          :src="CancelIcon"
          @click="onHandleClose(false)"
          alt=""
          v-if="showClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import CancelIcon from "@/assets/img/common/delete-cancel.png";
const ns = useNamespace("deleteConfirm");
const emits = defineEmits(["onHandleClose"]);
const dialogVisible: Ref<boolean> = ref(false);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
});
watch(
  () => props.visible,
  () => {
    dialogVisible.value = props.visible;
  },
  { immediate: true },
);
const onHandleClose = (type: boolean) => {
  emits("onHandleClose", type);
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.es-dialog.es-deleteConfirm {
  .el-dialog__body {
    padding-top: 24px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .es-deleteConfirm-content {
    @include flex(flex-start, space-between, nowrap);
  }
  .es-deleteConfirm-cancel {
    @include widthAndHeight(20px, 20px);
    cursor: pointer;
  }
}
</style>
