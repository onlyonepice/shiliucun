<template>
  <router-view class="app"/>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
const wInnerWidth: Ref<number> = ref(0);
// 定义好rem尺寸为 1px = 0.1rem
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 10 * (clientWidth / 750) + "px";
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

onMounted(()=>{
  wInnerWidth.value = window.innerWidth;
  if(wInnerWidth.value > 500){
    router.push('/ipotisedge/PC/investment')
  } else{
    document.getElementById('app').style.minWidth = '100vw'
    document.getElementById('app').style.minHeight = 'none'
    router.push('/ipotisedge/mobile')
  }
  console.log('ppppp')
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
