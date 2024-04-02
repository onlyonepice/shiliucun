<template>
  <div :class="[ns.b()]">
    <template v-if="isLoading">
      <div class="title">
        <p class="title_text">行业洞察。</p>
        <img :src="rightArrow" alt="" @click="onEnterList" />
      </div>
      <div class="content">
        <IndustryInsightList
          v-for="(item, index) in pageData"
          :pageData="item"
          :key="`IndustryInsightList${index}`"
        />
      </div>
    </template>
    <el-skeleton :throttle="500" v-else style="width: 100%" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="width: 160px; height: 44px; margin-bottom: 32px"
        />
        <div
          v-for="i in 5"
          :key="i"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-items: space-between;
            margin-bottom: 40px;
          "
        >
          <el-skeleton-item
            variant="text"
            style="width: 74px; height: 74px; margin-right: 24px"
          />
          <el-skeleton-item variant="text" style="flex: 1; height: 76px" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import rightArrow from "@/assets/img/common/right-arrow.png";
import { getReNewsInFormations } from "@/api/home";
import { useRouter } from "vue-router";
import IndustryInsightList from "@/components/Common/IndustryInsightList.vue";
const ns = useNamespace("home-industryInsight");
const router = useRouter();
const pageData = ref([]);
const isLoading = ref<boolean>(false);
const onEnterList = () => {
  router.push("/industryInsight");
};
const getReNewsInFormationsFn = async () => {
  const data = await getReNewsInFormations({
    page: 1,
    limit: 5,
    keyword: "",
  });
  isLoading.value = true;
  if (data.resp_code === 0) {
    pageData.value = data.datas.records;
  }
};
getReNewsInFormationsFn();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-home-industryInsight {
  padding-bottom: 56px;
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
  .content {
    width: 100%;
  }
}
</style>
