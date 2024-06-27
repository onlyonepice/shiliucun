<template>
  <div :class="['es-commonPage', ns.b()]">
    <WhiteReport :page-data="paperList" @click="onDetail()" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getPaperList } from "@/api/report";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("whitePaper");
const paperList = ref([]); // 白皮书列表
// 获取白皮书列表
const getWhitePaperList = async () => {
  const { datas } = await getPaperList();
  paperList.value = datas.records;
};
onMounted(() => {
  getWhitePaperList();
});
const onDetail = () => {
  window.trackFunction("pc_Report_WhitePaper_File_click");
};
window.trackFunction("pc_Report_WhitePaper_click");
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-whitePaper {
  padding-top: 80px;
  @include padding(80px, 0, 80px, 0);
}
</style>
