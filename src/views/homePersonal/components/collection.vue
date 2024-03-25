<template>
  <div :class="[ns.b()]">
    我的收藏
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('homePersonalInfo')
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

</style>
