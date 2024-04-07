<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('left')">
      <el-tree
        :class="ns.be('left', 'tree')"
        :data="biddingContentFilter"
        show-checkbox
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
      <el-tree
        :class="ns.be('left', 'tree')"
        :data="area"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
      <el-tree
        :class="ns.be('left', 'tree')"
        :data="area"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <div :class="ns.b('right')" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("dataSearch");
defineProps({
  biddingContentFilter: {
    type: Array as () => any[],
    default: () => [],
  },
});
const defaultProps = ref({
  children: "dropDownBoxResp",
  label: "paramDesc",
});

const handleNodeClick = () => {
  console.log(111);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-dataSearch {
  padding: 24px 0 80px;
}
.es-dataSearch-left {
  @include widthAndHeight(270px);
}
.es-dataSearch-left__tree {
}
</style>
