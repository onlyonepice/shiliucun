<template>
  <PageNav class="pageNav" :opacityBg="opacityBg" :class="{ 'pageNav-show': showNavBar, 'es-pageNav--opacity': opacityBg }"
    @onLogin="openLogin = true; openLoginAnimate = true" />
  <el-scrollbar ref="scrollbarRef" class="es-body" @scroll="onScroll">
    <div class="es-pageContent animate__animated animate__fadeIn" :style="{ 'background-color': getBg, 'padding-top': route.path === '/home' ? '0' : '56px'  }">
      <router-view />
    </div>
    <PageBottom></PageBottom>
  </el-scrollbar>
  <Login v-if="openLoginAnimate" :openLogin="openLogin" @onCancel="onCancel" class="animate__animated"
    :class="openLogin ? 'animate__fadeIn' : 'animate__fadeOut'" />
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { windowScrollStore } from "@/store/modules/windowScroll";
import { useUserStore } from '@/store/modules/user'
const opacityBg: Ref<boolean> = ref(true); // 是否展示透明背景
const router = useRouter();
const route = useRoute();
const showNavBar: Ref<boolean> = ref(true)
const lastScrollY: Ref<number> = ref(0)
const openLogin: Ref<boolean> = ref(false) // 登录弹窗
const openLoginAnimate: Ref<boolean> = ref(false) // 登录动画执行完毕弹窗
onMounted(() => {

})
// 监听路由改变
const windowScroll = windowScrollStore()
watch(
  () => route.path,
  (path) => {
    opacityBg.value = path === '/home';
  },
  { immediate: true },
)
const scrollbarRef = ref(null)
watch(windowScroll, (e) => {
  scrollbarRef.value!.setScrollTop(e.scrollTop)
})
const getBg = computed(() => {
  return route.meta.backgroundColor ? route.meta.backgroundColor : '#ffffff'
})
const onScroll = ({ scrollTop }: any) => {
  showNavBar.value = scrollTop < lastScrollY.value
  windowScroll.SET_SCROLL_TOP(scrollTop)
  lastScrollY.value = scrollTop
  if (route.path === '/home') {
    opacityBg.value = scrollTop < 200
  }
}
const onCancel = () => {
  openLogin.value = false
  setTimeout(() => {
    openLoginAnimate.value = false
  }, 500)
}
// 获取文件前缀
useUserStore().getConfigListBefore()
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#app {
  .es-body {
    height: 100vh;
    box-sizing: border-box;
  }

  .es-pageContent {
    background-color: #ffffff;
    min-height: 50vh;
  }
}

.pageNav {
  @include fixed(99999, -56px, 0, 0, 0);
}

.pageNav-show {
  @include fixed(99999, 0, 0, 0, 0);
}

.es-pageNav--opacity {
  background-color: rgba(255, 255, 255, 0) !important;
}
</style>
