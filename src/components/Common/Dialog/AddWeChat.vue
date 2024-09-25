<template>
  <el-dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    style="padding: 0"
  >
    <img :src="src" :class="ns.b('img')" />
    <img
      src="@/assets/img/common/close.png"
      @click="handleClose"
      :class="ns.b('img-two')"
    />
    <div :class="ns.b('empty')" @click="handleClose" />
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("addWeChat");
const dialogVisible: Ref<boolean> = ref(false);
const emits = defineEmits(["onHandleClose"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  src: {
    type: String,
    default: "",
  },
});
watch(
  () => props.visible,
  () => {
    dialogVisible.value = props.visible;
  },
  { immediate: true },
);
const handleClose: any = (type: boolean) => {
  emits("onHandleClose", type);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-addWeChat {
  position: fixed;
  top: 50% !important;
  left: 50% !important;
  width: 400px !important;
  border-radius: 10px !important;
  transform: translate(-50%, -50%);
  background-color: rgb(0, 0, 0, 0) !important;
  margin: 0 !important;
  @include relative();
  .es-addWeChat-img-two {
    position: absolute;
    width: 32px;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, calc(100% + 16px));
    cursor: pointer;
  }
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
    background-color: rgb(0, 0, 0, 0) !important;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }
  .el-dialog__headerbtn {
    right: 14px;
  }
}
.es-addWeChat-img {
  @include widthAndHeight(100%, 100%);
}
.es-addWeChat-empty {
  @include widthAndHeight(30px, 30px);
  @include absolute(1, 10px, 10px, none, none);
  cursor: pointer;
}
</style>
