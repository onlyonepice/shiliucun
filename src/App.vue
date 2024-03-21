<template>
  <PageNav class="pageNav" :class="{ 'pageNav-show': showNavBar, 'es-pageNav--opacity': opacityBg }" @onLogin="openLogin = true;openLoginAnimate = true" />
  <el-scrollbar class="es-body" @scroll="onScroll">
    <div class="es-pageContent" :style="{ 'background-color': getBg  }">
      <router-view />
    </div>
    <PageBottom></PageBottom>
  </el-scrollbar>
  <Login v-if="openLoginAnimate" @onCancel="onCancel" class="animate__animated" :class="openLogin ? 'animate__fadeIn' : 'animate__fadeOut'" />
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { windowScrollStore } from "@/store/modules/windowScroll";
const opacityBg: Ref<boolean> = ref(true); // 是否展示透明背景
const router = useRouter();
const route = useRoute();
const showNavBar: Ref<boolean> = ref(true)
const lastScrollY: Ref<number> = ref(0)
const openLogin: Ref<boolean> = ref(false) // 登录弹窗
const openLoginAnimate: Ref<boolean> = ref(false) // 登录动画执行完毕弹窗
onMounted(()=>{

})
// 监听路由改变
watch(
  () => route.path,
  (path) => {
    opacityBg.value = path === '/home';
  },
  { immediate: true },
)
const getBg = computed(()=>{
  return route.meta.backgroundColor? route.meta.backgroundColor : '#ffffff'
})
const onScroll = ({ scrollTop }:any) => {
  showNavBar.value = scrollTop < lastScrollY.value
  windowScrollStore().SET_SCROLL_TOP(scrollTop)
  lastScrollY.value = scrollTop
  if( route.path === '/home' ){
    opacityBg.value = scrollTop < 200
  }
}
const onCancel = () => {
  openLogin.value = false
  setTimeout(()=>{
    openLoginAnimate.value = false
  },500)
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";
#app{
  .es-body{
    height: 100vh;
    box-sizing: border-box;
  }
  .es-pageContent{
    background-color: #ffffff;
  }
}
.pageNav{
  @include fixed(99999,-56px,0,0,0);
}
.pageNav-show{
  @include fixed(99999,0,0,0,0);
}
.es-pageNav--opacity{
  background-color: rgba(255,255,255,0) !important;
}
</style>
