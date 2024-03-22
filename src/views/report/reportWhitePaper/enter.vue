<template>
  <div :class="[ns.b(),'es-commonPage']">

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
  @include padding(56px,0,0,0);
  min-height: 100vh;
}
</style>