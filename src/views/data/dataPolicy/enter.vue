<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";

interface TabsList {
  id: number;
  name: string;
}

const ns = useNamespace("policy");
const choseTabs = ref(1);
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "招标查找" },
  { id: 2, name: "招标月度分析" },
  { id: 3, name: "招标企业分析" },
  { id: 5, name: "应用场景分析" },
  { id: 6, name: "储能时长分析" },
]);
const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
</script>
