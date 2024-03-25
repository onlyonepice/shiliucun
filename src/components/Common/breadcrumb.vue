<template>
  <div :class="[ns.b()]">
    <div class="es-commonPage">
      <el-breadcrumb separator="/">
        <template v-for="item in breadcrumbList" :key="item.text">
          <el-breadcrumb-item v-if="item.path !== '' && item.path.indexOf('http') === -1" :to="{ path: '/' }">{{
    item.text }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="item.path !== '' && item.path.indexOf('http') !== -1">
            <a href="/">{{ item.text }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="item.path === ''">{{ item.text }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>

  </div>
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

.es-breadcrumb {
  height: 48px;
  line-height: 48px;
  width: 100vw;
  background-color: #F2F3F5;
}
</style>
<style lang="scss">
.es-breadcrumb {
  .el-breadcrumb {
    height: 48px;

    span {
      line-height: 48px;
    }
  }

  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
