<template>
  <el-scrollbar :class="ns.b()">
    <h4>推荐报告</h4>
    <div
      :class="ns.b('list')"
      v-for="item in recommendList"
      :key="item.id"
      @click="onDetail(item)"
    >
      <p>{{ item.reportName }}</p>
      <span>{{ item.reportTag.join(" | ") }}</span>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getReportDetailRecommendApi } from "@/api/reportDetail";
import { useRoute, useRouter } from "vue-router";
const emit = defineEmits(["getInfo"]);
const route = useRoute();
const router = useRouter();
const ns = useNamespace("reportDetailRecommend");
const recommendList = ref([]); // 推荐报告列表
onMounted(() => {
  getReportDetailRecommendApi(Number(route.query.id)).then((res: any) => {
    recommendList.value = res.datas;
  });
});
// 跳转详情
const onDetail = (item: any) => {
  router.replace(`/reportDetail?id=${item.id}&moduleName=${item.moduleName}`);
  setTimeout(() => {
    emit("getInfo");
  }, 200);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-reportDetailRecommend {
  @include widthAndHeight(100%);
  height: calc(100vh - 568px);
  margin-top: 24px;
  background: #ffffff;
  border-radius: 8px;
  @include padding(24px, 24px, 18px, 24px);
  h4 {
    margin-bottom: 16px;
  }
}
.es-reportDetailRecommend-list {
  margin-bottom: 16px;
  max-width: 222px;
  cursor: pointer;
  p {
    width: 100%;
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    @include textOverflowOne();
  }
  span {
    width: 100%;
    display: block;
    @include font(12px, 400, rgba(0, 0, 0, 0.4), 20px);
    margin-top: 4px;
    @include textOverflowOne();
  }
}
</style>
