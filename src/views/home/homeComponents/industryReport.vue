<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <template v-if="isLoading">
      <div class="content">
        <div class="title">
          <p class="title_text">行业报告。</p>
          <img @click="handleListClick" :src="rightArrow" alt="" />
        </div>
        <div class="list-box">
          <onLineReportList
            :pageData="item"
            v-for="(item, index) in pageData"
            :key="`page${index}`"
          />
        </div>
      </div>
    </template>
    <el-skeleton v-else style="width: 100%" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="width: 160px; height: 44px; margin-bottom: 32px"
        />
        <div
          style="width: 1152px; display: flex; justify-content: space-between"
        >
          <div style="width: 211px" v-for="i in 5" :key="i">
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 298px; margin-bottom: 16px"
            />
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 48px; margin-bottom: 8px"
            />
            <el-skeleton-item
              variant="text"
              style="width: 100%; height: 22px; margin-bottom: 8px"
            />
            <el-skeleton-item
              variant="text"
              style="width: 160px; height: 22px"
            />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import rightArrow from "@/assets/img/common/right-arrow.png";
import { getHomeOnlineReportSelected } from "@/api/home";
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("home-industryReport");
const pageData = ref<[]>([]);
const isLoading = ref<boolean>(false);
const getOnlineReportSelectedFn = async () => {
  const data = await getHomeOnlineReportSelected({
    page: 1,
    limit: 5,
    keyword: "",
  });
  isLoading.value = true;
  if (data.resp_code === 0) {
    pageData.value = data.datas;
  }
};
const handleListClick = () => {
  router.push("/reportOnLine");
};
getOnlineReportSelectedFn();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryReport {
  display: flex;
  justify-content: center;
  height: 580px;

  .content {
    width: 100%;

    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      .title_text {
        @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
      }

      img {
        @include widthAndHeight(48px, 48px);
        cursor: pointer;
      }
    }

    .list-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
