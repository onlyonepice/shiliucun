<template>
  <div :class="[ns.b(),'es-commonPage']">
    <div v-for="item in 2" :key="index">
      <div></div>
      <div></div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('whitePaper')


</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-whitePaper{
  min-height: 100vh;
}
</style>