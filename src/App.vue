<template>
  <router-view class="app"/>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();

onMounted(()=>{

})
</script>

<style lang="scss">
@import "@/style/mixin.scss";

#app {
  width: 100%;
  min-width: 1080px;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 12px;
  background-color: #F8F9FB;
}

</style>
