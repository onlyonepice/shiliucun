<template>
  <div :class="[ns.b()]">
    修改密码
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
