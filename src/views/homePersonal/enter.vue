<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    123
  </div>
</template>


<script lang="ts" setup>
import { ref, Ref, } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('home')

const breadcrumbList: Ref<Array<any>> = ref([
  { text: '首页',path: '/home' },
  { text: '个人中心',path: '' },
])
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

</style>
