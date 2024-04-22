<template>
  <div :class="[ns.b()]">
    <span :class="ns.b('text')">共计 {{ total }} 条</span>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="20"
      @current-change="onchangeCurrent"
    />
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("pagination");
const emits = defineEmits(["onchangeCurrent"]);
defineProps({
  total: {
    type: Number,
    default: 0,
  },
  
});
const onchangeCurrent = (data: any) => {
  emits("onchangeCurrent", data);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-pagination {
  @include flex(center, flex-end);
  @include widthAndHeight(100%, 64px);
}
.es-pagination-text {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  margin-right: 16px;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-pagination {
  .el-pagination button {
    background-color: transparent;
    margin-right: 8px !important;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: transparent;
    margin: 0;
  }
  .el-pager li.is-active {
    background: #dee8ff !important;
    border-radius: 4px !important;
    color: #244bf1 !important;
  }
  .el-pagination > .is-last {
    margin-right: 0 !important;
  }
  .el-pager li {
    @include widthAndHeight(32px, 32px);
    margin: 0;
    padding: 0;
    margin-right: 8px !important;
    &:last-of-type {
      margin-right: 0 !important;
    }
  }
}
</style>
