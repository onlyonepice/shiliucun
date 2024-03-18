<template>
  <NavBar @onHashChange="onHashChange" />
  <div class="nav-padding">
    <investment v-show="currentHash.indexOf('investment') > -1" />
    <priceTracking v-if="elPriceTracking" v-show="currentHash.indexOf('priceTracking') > -1" />
  </div>
  <a class="footer" href="https://i-report.eesaenergy.com/#/relation-servicer?name=企业数据服务"
    target="_blank"><span>储能领跑者联盟</span>提供技术支持</a>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import NavBar from '@/components/NavBar.vue'
import investment from './investment/enter.vue'
import priceTracking from './priceTracking/enter.vue'
const currentHash = ref(window.location.hash);
const elPriceTracking = ref(false);
const handleHashChange = () => {
  currentHash.value = window.location.hash;
};
const onHashChange = (newHash: string) => {
  window.location.hash = newHash;
};

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange);
})
const hashChange = () => {
  window.addEventListener(
    'hashchange',
    () => {
      // console.log('hash变化');
    },
    false
  );
};
hashChange()
watch(
  () => currentHash.value,
  () => {
    if(currentHash.value.indexOf('priceTracking') > -1){
      elPriceTracking.value = true
    }
  }
)
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.footer {
  display: block;
  @include widthAndHeight(100%);
  @include font(14px, 400, #919DB5, 22px);
  @include margin(16px, 0, 24px, 0);
  text-align: center;
  span{
    @include font(14px,400,#165DFF,44px)
  }
}

.nav-padding {
  @include margin(94px, 0, 0, 0);
}</style>
