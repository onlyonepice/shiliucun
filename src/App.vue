<template>
  <PageNav class="pageNav" :class="{ 'pageNav-show': showNavBar }" />
  <el-scrollbar class="es-body" @scroll="onScroll">
    <div class="es-pageContent" :style="{ 'background-color': getBg  }">
      <router-view />
    </div>
    <PageBottom></PageBottom>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref, computed } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { windowScrollStore } from "@/store/modules/windowScroll";
const router = useRouter();
const route = useRoute();
const showNavBar: Ref<boolean> = ref(true)
const lastScrollY: Ref<number> = ref(0)
onMounted(()=>{

})
const getBg = computed(()=>{
  return route.meta.backgroundColor? route.meta.backgroundColor : '#ffffff'
})
const onScroll = ({ scrollTop }:any) => {
  showNavBar.value = scrollTop < lastScrollY.value
  windowScrollStore().SET_SCROLL_TOP(scrollTop)
  lastScrollY.value = scrollTop
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
</style>
