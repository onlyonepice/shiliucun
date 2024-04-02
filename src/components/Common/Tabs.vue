<template>
  <div :class="[ns.b()]">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="item.name"
        :name="item.id"
        v-for="item in tabsList"
        :key="item.id"
      />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
interface TabsList {
  id: number;
  name: string;
}
import { watch, ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import type { TabsPaneContext } from "element-plus";
const ns = useNamespace("tabs");
const emits = defineEmits(["onHandleClick"]);
const activeName: Ref<string | number> = ref(0);
const props = defineProps({
  tabsList: {
    type: Array as () => TabsList[],
    default: () => [],
  },
  defaultId: {
    type: Number || String,
    default: -1,
  },
});
watch(
  () => props.tabsList,
  (val: Array<TabsList>) => {
    if (props.defaultId === -1) {
      activeName.value = val[0].id;
    } else {
      activeName.value = props.defaultId;
    }
  },
  { immediate: true },
);
const handleClick = (tab: TabsPaneContext) => {
  activeName.value = tab.props.name;
  emits("onHandleClick", tab.props.name);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-tabs {
  .el-tabs__item {
    @include widthAndHeight(116px, 56px);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 24px);
    padding: 17px 16px !important;
    margin-right: 8px;
  }
  .el-tabs__item:nth-of-type(2) {
    @include widthAndHeight(116px, 56px);
  }
  .el-tabs__item.is-active {
    @include font(14px, 600, #244bf1, 22px);
    padding: 17px 0 !important;
  }
  .el-tabs__active-bar.is-top {
    padding: 0 -10px;
    box-sizing: border-box !important;
    background-clip: content-box !important;
  }
}
</style>
