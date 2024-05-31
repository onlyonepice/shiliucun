<template>
  <div v-for="item in pageData" :key="item.id" :class="ns.b('list')">
    <div :class="ns.bm('list', 'content')">
      <div :class="[ns.bm('content', 'title')]" v-html="item.reportName" />
      <div :class="[ns.bm('content', 'line')]" />
      <div :class="[ns.bm('content', 'desc')]" v-html="item.contentOverview" />
      <div :class="[ns.bm('content', 'more')]">
        <div :class="[ns.bm('more', 'left')]">
          <img
            v-for="_item in item.compilationPartner"
            :key="_item"
            :src="useUserStore().fileUrl + _item"
            alt=""
          />
        </div>
        <img
          :class="[ns.bm('more', 'right')]"
          :src="RightArrow"
          alt=""
          @click="onDetail(item)"
        />
      </div>
    </div>
    <img
      :class="ns.bm('list', 'cover')"
      :src="useUserStore().fileUrl + item.reportCover"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("whitePaper");
import { useUserStore } from "@/store/modules/user";
import RightArrow from "@/assets/img/common/right-arrow.png";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
const router = useRouter();
defineProps({
  pageData: {
    type: Object,
    default: () => {},
  },
});
// 跳转白皮书详情
const onDetail = (data: any) => {
  if (!getToken()) {
    return useUserStoreHook().openLogin(true);
  }
  router.push(`/reportDetail?id=${data.id}&moduleName=${data.moduleName}`);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-whitePaper-list {
  @include flex(flex-start, center, nowrap);
  margin-bottom: 40px;
}

.es-whitePaper-list--content {
  width: 760px;
  @include margin(0, 24px, 0, 0);
  @include relative();
}

.es-whitePaper-content--title {
  @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
}

.es-whitePaper-content--line {
  @include widthAndHeight(32px, 4px);
  background: linear-gradient(90deg, #ff8d32 0%, rgba(255, 141, 50, 0) 100%);
  @include margin(24px, 0, 56px, 0);
}

.es-whitePaper-content--desc {
  @include font(16px, 400, rgba(0, 0, 0, 0.6), 24px);
  @include margin(0, 0, 74px, 0);
}

.es-whitePaper-content--more {
  @include flex(flex-start, space-between);
}

.es-whitePaper-more--left {
  img {
    @include widthAndHeight(auto, 40px);
    @include margin(0, 24px, 0, 0);
  }
}

.es-whitePaper-more--right {
  @include widthAndHeight(48px, 48px);
  cursor: pointer;
}

.es-whitePaper-list--cover {
  @include widthAndHeight(368px, 552px);
  object-fit: cover;
}
</style>
