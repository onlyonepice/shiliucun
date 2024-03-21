<template>
  <PageNav />
  <el-scrollbar class="es-body" @scroll="onScroll">
    <div class="es-pageContent" :style="{ 'background-color': route.meta.backgroundColor ? route.meta.backgroundColor : '#ffffff'  }">
      <router-view />
    </div>
    <PageBottom></PageBottom>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import PageBottom from '@/components/Business/PageBottom.vue'
import PageNav from '@/components/Business/PageNav.vue'
import { windowScrollStore } from "@/store/modules/windowScroll";
const router = useRouter();
const route = useRoute();
console.log('route',route)
onMounted(()=>{

})
const onScroll = ({ scrollTop }:any) => {
  windowScrollStore().SET_SCROLL_TOP(scrollTop)
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
</style>
