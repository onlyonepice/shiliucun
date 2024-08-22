<template>
  <el-dialog
    v-model="dialogVisible"
    :class="ns.b()"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    style="padding: 0"
  >
    <img :class="ns.b('bg')" :src="UpdateLogBg" alt="" />
    <p :class="ns.b('title')">发现新版本</p>
    <div :class="ns.b('version')">{{ updateInfo.version }}</div>
    <el-scrollbar height="320px" :class="ns.b('content')">
      <div v-html="content" />
    </el-scrollbar>
    <el-button
      type="primary"
      :class="ns.b('btn')"
      @click="dialogVisible = false"
      >立即体验</el-button
    >
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import UpdateLogBg from "@/assets/img/common/update-log-bg.png";
import { getUpdateLogApi } from "@/api/home";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("updateLog");
const dialogVisible: Ref<boolean> = ref(false);
const updateInfo: Ref<any> = ref({}); // 更新日志
const content: Ref<string> = ref(""); // 更新日志
// const emits = defineEmits(["onHandleClose"]);
watch(
  () => useUserStore().$state.token,
  (val) => {
    val !== "" && getUpdateLog();
  },
  { immediate: true },
);
// 获取更新日志
function getUpdateLog() {
  getUpdateLogApi().then((res) => {
    if (res.resp_code === 0) {
      if (res.datas === null) {
        dialogVisible.value = false;
      } else {
        console.log(useUserStore().fileUrl);
        dialogVisible.value = true;
        content.value = res.datas.content.replace(
          /img src="/g,
          `img src="${useUserStore().fileUrl}`,
        );
        updateInfo.value = res.datas;
      }
    }
  });
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-updateLog {
  width: 400px !important;
  @include relative();
  border-radius: 8px;
  padding: 32px 24px 40px !important;
  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
    padding: 0;
  }
}
.es-updateLog-bg {
  @include widthAndHeight(100%, 160px);
  @include absolute(-1, 0, 0, none, 0);
}
.es-updateLog-title {
  @include font(28px, 600, rgba(0, 0, 0.9), 36px);
}
.es-updateLog-version {
  @include widthAndHeight(64px, 28px);
  border-radius: 2px 8px 8px 8px;
  border: 1px solid #244bf1;
  @include flex(center, center);
  margin-top: 8px;
}
.es-updateLog-content {
  margin: 24px auto 32px;
}
.es-updateLog-btn {
  @include widthAndHeight(288px, 40px);
  margin: 0 auto;
  display: block;
}
</style>
