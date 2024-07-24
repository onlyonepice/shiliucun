<template>
  <el-dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    style="padding: 0"
  >
    <img :src="NewUserVip" :class="ns.b('img')" />
    <div :class="ns.b('empty')" @click="handleClose" />
    <div :class="ns.b('btn')" @click="handleClose" />
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import NewUserVip from "@/assets/img/common/new-user-vip.png";
const ns = useNamespace("newUserVip");
const dialogVisible: Ref<boolean> = ref(false);
const emits = defineEmits(["onHandleClose"]);
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
const handleClose = (type: boolean) => {
  emits("onHandleClose", type);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-newUserVip {
  width: 400px !important;
  height: 348px !important;
  border-radius: 10px !important;
  translate: 50vw 50vh;
  margin-top: -100px !important;
  margin-left: -184px !important;
  @include relative();
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }
  .el-dialog__headerbtn {
    right: 14px;
  }
}
.es-newUserVip-img {
  @include widthAndHeight(100%, 100%);
}
.es-newUserVip-empty {
  @include widthAndHeight(30px, 30px);
  @include absolute(1, 10px, 10px, none, none);
  cursor: pointer;
}
.es-newUserVip-btn {
  @include widthAndHeight(180px, 40px);
  @include absolute(1, none, 110px, 32px, none);
  cursor: pointer;
}
</style>
