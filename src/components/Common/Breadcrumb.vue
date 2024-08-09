<template>
  <div :class="[ns.b()]">
    <div class="es-commonPage">
      <el-breadcrumb separator="/">
        <template v-for="item in breadcrumbList" :key="item.text">
          <el-breadcrumb-item
            v-if="item.path !== '' && item.path.indexOf('http') === -1"
            @click="onTo(item.path)"
            >{{ item.text }}</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-if="item.path !== '' && item.path.indexOf('http') !== -1"
          >
            <a href="/">{{ item.text }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="item.path === ''">{{
            item.text
          }}</el-breadcrumb-item>
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
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("breadcrumb");
const router = useRouter();
defineProps({
  breadcrumbList: {
    type: Array as () => BreadcrumbList[],
    default: () => [],
  },
});
const onTo = (path: string) => {
  if (path === "goBack") {
    router.go(-1);
  }
  router.push(path);
};
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.es-breadcrumb {
  line-height: 48px;
  @include widthAndHeight(100vw, 48px);
  background-color: #f2f3f5;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-breadcrumb {
  min-width: 1080px;
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
  .el-breadcrumb__inner {
    max-width: 104px;
    @include textOverflow();
  }
}
</style>
