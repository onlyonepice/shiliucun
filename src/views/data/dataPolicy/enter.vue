<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
    <PolicyList v-if="choseTabs === 1" />
    <PolicyAnalysis v-if="choseTabs === 2" />
    <ElectricityText :url="VITE_DATABASE_URL + '#/policyLibraryManage'" />
    <NpsMark module="查政策" title="「查政策」" npsConfigCode="Policy" />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import PolicyList from "./policyList.vue";
import PolicyAnalysis from "./policyAnalysis.vue";
import useNamespace from "@/utils/nameSpace";
const { VITE_DATABASE_URL } = import.meta.env;
interface TabsList {
  id: number;
  name: string;
}

const ns = useNamespace("policy");
const choseTabs = ref(1);
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "政策查找" },
  { id: 2, name: "政策分析" },
]);
const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
window.trackFunction("pc_Policy_Search_click");
</script>
<style lang="scss" scoped>
.es-policy {
  padding: 80px 0;
}
</style>
