<template>
  <Breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="[ns.b(), 'es-commonPage animate__animated animate__fadeIn']">
    <div :class="[ns.b('common'), ns.b('left')]">
      <div :class="[ns.be('left', 'top')]">
        <h3>{{ hotSpotsDetail.title }}</h3>
        <span>{{ hotSpotsDetail.createTime || hotSpotsDetail.date }}</span>
        <span v-if="hotSpotsDetail.source"
          >来源：{{ hotSpotsDetail.source }}</span
        >
        <div :class="ns.b('line')" />
        <div v-html="hotSpotsDetail.content" :class="ns.b('html')" />
      </div>
    </div>
    <div :class="[ns.b('common'), ns.b('right')]">
      <template v-if="hotSpotsDetail.previousPost.id">
        <p>上一篇</p>
        <h4 @click="onHotSpots(hotSpotsDetail.previousPost.id)">
          {{ hotSpotsDetail.previousPost.title }}
        </h4>
      </template>
      <template v-if="hotSpotsDetail.nextChapter.id">
        <p>下一篇</p>
        <h4 @click="onHotSpots(hotSpotsDetail.nextChapter.id)">
          {{ hotSpotsDetail.nextChapter.title }}
        </h4>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { getHotSpotsDetailApi } from "@/api/home";
import useNamespace from "@/utils/nameSpace";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
const route = useRoute();
const router = useRouter();
const ns = useNamespace("hotSpots");
const breadcrumbList: Ref<Array<any>> = ref([
  {
    text: "首页",
    path: "/home",
  },
  {
    text: "热点",
    path: "",
  },
]);
// 获取热点详情
const hotSpotsDetail = ref<any>({});
const getHotSpotsDetail = async () => {
  const { resp_code, datas } = await getHotSpotsDetailApi({
    id: route.query.id,
  });
  if (resp_code === 0) {
    console.log(datas);
    hotSpotsDetail.value = datas;
    hotSpotsDetail.value.content = datas.content.replace(
      /img src="/g,
      `img src="${useUserStore().fileUrl}`,
    );
  }
};
getHotSpotsDetail();
// 跳转热点详情
const onHotSpots = async (id: String) => {
  await router.push(`/hotSpots?id=${id}`);
  window.location.reload();
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-hotSpots {
  @include flex(flex-start, space-between, nowrap);
  img {
    width: 100%;
    object-fit: contain;
  }
}
.es-hotSpots-common {
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 80px;
}
.es-hotSpots-left {
  @include widthAndHeight(858px, auto);
  padding: 24px 24px 192px;
  .es-hotSpots-left__top {
    padding-bottom: 23px;
    h3 {
      margin-bottom: 8px;
      line-height: 28px;
    }
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      margin-right: 40px;
    }
  }
}
.es-hotSpots-line {
  @include widthAndHeight(100%, 1px);
  background-color: #dbdce2;
  margin: 23px 0 24px;
}
.es-hotSpots-html {
  p {
    @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
  }
}
.es-hotSpots-right {
  @include widthAndHeight(270px, auto);
  padding: 24px;
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-bottom: 8px;
    &:nth-of-type(2) {
      margin-top: 24px;
    }
  }
  h4 {
    @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
    cursor: pointer;
  }
}
</style>
