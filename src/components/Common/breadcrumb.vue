<template>
  <el-breadcrumb separator="/">
    <template v-for="item in breadcrumbList" :key="item.text">
      <el-breadcrumb-item v-if="item.path !==  '' && item.path.indexOf('http') === -1" :to="{ path: '/' }">{{ item.text }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="item.path !==  '' && item.path.indexOf('http') !== -1">
        <a href="/">{{ item.text }}</a>
      </el-breadcrumb-item >
      <el-breadcrumb-item v-if="item.path ===  ''">{{ item.text }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
interface BreadcrumbList {
  text: string;
  path: string;
}
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('breadcrumb')
const props = defineProps({
  breadcrumbList: {
    type: Array as () => BreadcrumbList[],
    default: () => []
  }
})
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
</style>
