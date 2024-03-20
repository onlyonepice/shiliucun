<template>
  <PageNav />
  <el-scrollbar class="es-body" @scroll="onScroll">
    <div class="es-pageContent">
      <router-view />
    </div>
    <PageBottom></PageBottom>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useRouter } from "vue-router";
import PageBottom from '@/components/Business/PageBottom.vue'
import PageNav from '@/components/Business/PageNav.vue'
const router = useRouter();

onMounted(()=>{

})
const onScroll = ({ scrollTop }:any) => {

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
