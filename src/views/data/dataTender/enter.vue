<template>
  <div :class="['es-commonPage', ns.b()]">
    <Tabs :tabsList="tabsList" />
  </div>
</template>

<script lang="ts" setup>
interface TabsList {
  id: number;
  name: string;
}
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("dataTender");
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "招标查找" },
  { id: 2, name: "招标月度分析" },
  { id: 3, name: "招标企业分析" },
  { id: 4, name: "招标地区分析" },
]);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-dataTender {
  padding: 80px 0;
}
</style>
