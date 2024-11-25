<template>
  <PageHead @share="handleShare = true" />
  <div class="page-content">
    <PageAside />
    <div class="main-content">
      <router-view />
    </div>
  </div>
  <Login v-if="openLoginVisible" />
  <PayGame v-if="openPayGameVisible" />
  <DownloadApp v-if="openDownloadVisible" />
  <Share v-if="handleShare" @close="handleShare = false" />
  <Announcement v-if="useUserStoreHook().$state.openAnnouncement" />
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken } from "@/utils/auth";

const openLoginVisible = ref(useUserStoreHook().$state.openLoginVisible);
const openPayGameVisible = ref(useUserStoreHook().$state.openPayGameVisible);
const openDownloadVisible = ref(useUserStoreHook().$state.openDownloadVisible);
const handleShare = ref(false);
watch(
  () => useUserStoreHook().$state.openLoginVisible,
  (newVal) => {
    openLoginVisible.value = newVal;
  },
);
watch(
  () => useUserStoreHook().$state.openPayGameVisible,
  (newVal) => {
    openPayGameVisible.value = newVal;
  },
);
watch(
  () => useUserStoreHook().$state.openDownloadVisible,
  (newVal) => {
    openDownloadVisible.value = newVal;
  },
);
watch(
  () => getToken(),
  (newVal) => {
    if (newVal !== "") {
      useUserStoreHook().$state.token = newVal === null ? "" : newVal;
    }
  },
  { immediate: true },
);
useUserStoreHook().announcementDialog(true);
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#app {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-variant: tabular-nums;
  background-color: #050505;
  font-feature-settings: "tnum", "tnum";
  min-height: 100vh;
  min-width: 100vw;
  background-size: cover;
  background-attachment: fixed;
}
.page-content {
  padding: 0.625vw;
  @include flex(center, space-between, nowrap);
}
.main-content {
  height: calc(100vh - 6.25vw);
  width: 100%;
  overflow-y: scroll;
}
</style>
