<template>
  <el-dialog
    v-model="dialogVisible"
    title="公告"
    width="500"
    :before-close="handleClose"
    class="login-dialog"
  >
    <div>
      <p style="font-size: 2vw; margin-bottom: 1vw">
        {{ useUserStoreHook().$state.announcementInfo.title }}
      </p>
      <p style="font-size: 1.5vw; margin-bottom: 0.8vw">
        {{ useUserStoreHook().$state.announcementInfo.intro }}
      </p>
      <p style="font-size: 1vw; margin-bottom: 0.6vw">
        {{ useUserStoreHook().$state.announcementInfo.created_at }}
      </p>
      <p v-html="useUserStoreHook().$state.announcementInfo.detail"></p>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
const dialogVisible = ref(true); // 弹窗显示控制

const handleClose = (done: any) => {
  useUserStoreHook().$state.openAnnouncement = false;
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
</style>
